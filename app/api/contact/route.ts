import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO;
const CONTACT_EMAIL_FROM = process.env.CONTACT_EMAIL_FROM;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  destination?: "email" | "discord";
  honeypot?: string;
};

function validatePayload(payload: ContactPayload) {
  if (payload.honeypot?.trim()) {
    console.log("🚫 SPAM detected - honeypot filled");
    return { valid: false, reason: "spam" };
  }

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    console.log("❌ MISSING FIELDS:", { name: !!payload.name, email: !!payload.email, message: !!payload.message });
    return { valid: false, reason: "missing_fields" };
  }

  if (!payload.destination) {
    payload.destination = "discord";
  } else if (!["email", "discord"].includes(payload.destination)) {
    return { valid: false, reason: "invalid_destination" };
  }

  return { valid: true };
}

async function sendDiscord(payload: ContactPayload) {
  console.log("🔍 Checking Discord config...");
  console.log("   WEBHOOK_URL exists:", !!DISCORD_WEBHOOK_URL);
  console.log("   WEBHOOK_URL value:", DISCORD_WEBHOOK_URL?.substring(0, 50) + "...");

  if (!DISCORD_WEBHOOK_URL) {
    throw new Error("Discord backend is not configured. Set DISCORD_WEBHOOK_URL.");
  }

  const webhookBody = {
    embeds: [
      {
        title: `📩 New message from ${payload.name}`,
        description: payload.message,
        color: 0x22d3ee,
        fields: [
          { name: "Email", value: payload.email, inline: true },
          { name: "Subject", value: payload.subject || "(no subject)", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  console.log("📤 Sending to Discord...", webhookBody);

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhookBody),
  });

  console.log("📥 Discord response status:", response.status, response.statusText);

  if (!response.ok) {
    const body = await response.text();
    console.log("❌ Discord error body:", body);
    throw new Error(`Discord webhook error: ${response.status} ${body}`);
  }

  console.log("✅ Discord message sent successfully!");
}

async function sendEmail(payload: ContactPayload) {
  if (!SENDGRID_API_KEY || !CONTACT_EMAIL_FROM || !CONTACT_EMAIL_TO) {
    throw new Error("Email backend is not configured.");
  }

  const formattedSubject = `New contact from ${payload.name}${payload.subject ? ` — ${payload.subject}` : ""}`;
  const emailBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Message:`,
    payload.message,
  ].join("\n");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: CONTACT_EMAIL_TO }], subject: formattedSubject }],
      from: { email: CONTACT_EMAIL_FROM },
      content: [{ type: "text/plain", value: emailBody }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid error: ${response.status} ${body}`);
  }
}

export async function POST(request: Request) {
  console.log("\n========================================");
  console.log("📨 CONTACT API CALLED");
  console.log("========================================");

  try {
    const payload = (await request.json()) as ContactPayload;
    
    console.log("📋 Received payload:", {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message?.substring(0, 50) + "...",
      destination: payload.destination || "(will be set to discord)",
    });

    const validation = validatePayload(payload);

    if (!validation.valid) {
      if (validation.reason === "spam") {
        console.log("🤫 Fake success for spam bot");
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { success: false, error: "Form validation failed." },
        { status: 400 }
      );
    }

    console.log("✅ Validation passed, destination:", payload.destination);

    if (payload.destination === "email") {
      await sendEmail(payload);
    } else {
      await sendDiscord(payload);
    }

    console.log("========================================\n");
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    console.log("❌ CATCH ERROR:", message);
    console.log("========================================\n");
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}