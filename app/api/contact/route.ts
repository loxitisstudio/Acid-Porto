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
  destination?: "email" | "discord"; // Diubah jadi opsional
  honeypot?: string;
};

function validatePayload(payload: ContactPayload) {
  if (payload.honeypot?.trim()) {
    return { valid: false, reason: "spam" };
  }

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { valid: false, reason: "missing_fields" };
  }

  // Jika destination tidak dikirim dari UI, otomatis diset ke "discord"
  if (!payload.destination) {
    payload.destination = "discord";
  } else if (!["email", "discord"].includes(payload.destination)) {
    return { valid: false, reason: "invalid_destination" };
  }

  return { valid: true };
}

async function sendEmail(payload: ContactPayload) {
  if (!SENDGRID_API_KEY || !CONTACT_EMAIL_FROM || !CONTACT_EMAIL_TO) {
    throw new Error("Email backend is not configured. Set SENDGRID_API_KEY, CONTACT_EMAIL_FROM, and CONTACT_EMAIL_TO.");
  }

  const formattedSubject = `New contact from ${payload.name}${payload.subject ? ` — ${payload.subject}` : ""}`;
  const emailBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Destination: ${payload.destination}`,
    ``,
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
      personalizations: [
        {
          to: [{ email: CONTACT_EMAIL_TO }],
          subject: formattedSubject,
        },
      ],
      from: { email: CONTACT_EMAIL_FROM },
      content: [{ type: "text/plain", value: emailBody }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid error: ${response.status} ${body}`);
  }
}

async function sendDiscord(payload: ContactPayload) {
  if (!DISCORD_WEBHOOK_URL) {
    throw new Error("Discord backend is not configured. Set DISCORD_WEBHOOK_URL.");
  }

  const response = await fetch(DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: `New message from ${payload.name}`,
          description: payload.message,
          color: 0x22d3ee, // Warna Cyan menyesuaikan tema UI
          fields: [
            { name: "Email", value: payload.email, inline: true },
            { name: "Destination", value: payload.destination ?? "discord", inline: true },
            { name: "Subject", value: payload.subject || "(no subject)", inline: false },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord webhook error: ${response.status} ${body}`);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const validation = validatePayload(payload);

    if (!validation.valid) {
      if (validation.reason === "spam") {
        // Mengelabui bot agar mengira pesan berhasil dikirim
        return NextResponse.json({ success: true });
      }

      return NextResponse.json(
        { success: false, error: "Form validation failed." },
        { status: 400 }
      );
    }

    if (payload.destination === "email") {
      await sendEmail(payload);
    } else {
      // Default ke discord jika destination berupa "discord" atau undefined
      await sendDiscord(payload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}