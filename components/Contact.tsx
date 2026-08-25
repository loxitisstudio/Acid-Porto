"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, GitBranch, Mail, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";
import Image from "next/image";
import { motion } from "framer-motion";

type ContactRow = {
  label: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

const contactRows: ContactRow[] = [
  { label: "Email", value: "loxitis.studio@gmail.com", href: "mailto:loxitis.studio@gmail.com", icon: Mail },
  { label: "Instagram DM", value: "@loxits_", href: "https://www.instagram.com/loxitis_/?hl=en", icon: Camera },
  { label: "Discord", value: "loxitis", href: "https://discord.com/channels/@me/1370061705362542735", icon: MessageCircle },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  destination: "email" | "discord";
  message: string;
  honeypot: string;
};

const initialFormState: FormState = {
  name: "",
  email: "",
  subject: "",
  destination: "email",
  message: "",
  honeypot: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to send message.");
      }

      setSent(true);
      setStatus("success");
      setMessage("Message sent. Thank you!");
      setForm(initialFormState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Send failed.");
    }
  };

  return (
    <section id="contact" className="section-shell">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.7fr_1fr_0.9fr] md:gap-12 items-start">
        
        {/* SISI KIRI: Judul & Informasi Kontak Bertumpuk */}
        <div>
          <Reveal>
            <div className="eyebrow flex items-center gap-1.5">
              <span className="text-accent">//</span> Contact
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-[44px] font-semibold uppercase leading-[1.1] tracking-tight">
              Let&apos;s work <br />
              <span className="text-accent">together.</span>
            </h2>
          </Reveal>

          {/* List Info Kontak Bertumpuk Sesuai Desain */}
          <Reveal delay={0.1} className="mt-12 flex flex-col gap-6">
            {contactRows.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-start gap-3.5">
                  <div className="mt-1 flex h-5 w-5 items-center justify-center text-sm text-ink-3">
                    <Icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2/40">
                      {row.label}
                    </span>
                    <a
                      href={row.href}
                      data-cursor-hover
                      className="mt-0.5 text-[14px] font-medium tracking-wide transition-colors hover:text-accent"
                    >
                      {row.value}
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Baris Lokasi */}
            <div className="flex items-start gap-3.5 border-t border-line/40 pt-6 mt-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center text-sm text-ink-3">
                <span className="text-[14px]">📍</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-2/40">
                  Location
                </span>
                <span className="mt-0.5 text-[14px] font-medium tracking-wide text-ink-2">
                  Indonesia, Earth
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* SISI TENGAH: Outlined Form Style */}
        <div>
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                type="text"
                placeholder="Your Name"
                className="w-full rounded-md border border-line bg-glass px-5 py-4 text-sm outline-none transition-colors placeholder:text-ink-2/30 focus:border-accent/50"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="Your Email"
                className="w-full rounded-md border border-line bg-glass px-5 py-4 text-sm outline-none transition-colors placeholder:text-ink-2/30 focus:border-accent/50"
              />
            </div>
            
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              type="text"
              placeholder="Subject"
              className="w-full rounded-md border border-line bg-glass px-5 py-4 text-sm outline-none transition-colors placeholder:text-ink-2/30 focus:border-accent/50"
            />

            <label className="flex items-center gap-3 text-[12px] text-ink-2">
              <span className="text-ink-2/40">Send via</span>
              <select
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="rounded-md border border-line bg-glass px-4 py-3 text-sm outline-none transition-colors focus:border-accent/50"
              >
                <option value="email">Email</option>
                <option value="discord">Discord</option>
              </select>
            </label>
            
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              placeholder="Your Message"
              className="w-full resize-none rounded-md border border-line bg-glass px-5 py-4 text-sm outline-none transition-colors placeholder:text-ink-2/30 focus:border-accent/50"
            />

            <input
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              type="text"
              autoComplete="off"
              tabIndex={-1}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-2 items-start justify-start flex">
              <MagneticButton
                type="submit"
                className="group inline-flex items-center gap-14 rounded-md border border-accent/40 bg-bg/60 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:border-accent hover:bg-glass"
              >
                {sent ? "Sent ✓" : "Send Message"}
                <span className="text-[12px] text-ink-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                  ↗
                </span>
              </MagneticButton>
            </div>

            {status !== "idle" && (
              <p className={`text-sm ${status === "success" ? "text-green-500" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </form>
          </Reveal>
        </div>

        {/* SISI KANAN: Visual 3D Objects */}
        <div className="relative hidden md:flex items-center justify-center">
          <Reveal delay={0.12}>
            <div className="relative h-[320px] w-full max-w-[360px]">
              <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-6 top-6 h-[120px] w-[120px] md:h-[160px] md:w-[160px]"
              >
                <Image src="/hero/sphere.webp" alt="Sphere" fill className="object-contain drop-shadow-[0_0_20px_rgba(255,0,255,0.06)]" priority />
              </motion.div>

              <motion.div
                animate={{ y: [6, -10, 6], rotate: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-6 bottom-4 h-[140px] w-[140px] md:h-[180px] md:w-[180px]"
              >
                <Image src="/hero/cube.webp" alt="Cube" fill className="object-contain drop-shadow-[0_0_30px_rgba(0,217,255,0.06)]" priority />
              </motion.div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}