"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Camera, MessageCircle, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";
import ConstellationCanvas from "./ConstellationCanvas";

// --- DATA & TYPES ---
const CONTACT_ROWS = [
  { label: "Email", value: "loxitis.studio@gmail.com", href: "mailto:loxitis.studio@gmail.com", icon: Mail },
  { label: "Instagram DM", value: "@loxits_", href: "https://www.instagram.com/loxitis_/?hl=en", icon: Camera },
  { label: "Discord", value: "loxitis", href: "https://discord.com/channels/@me/1370061705362542735", icon: MessageCircle },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/loxitis_/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "Discord", href: "https://discord.com/" },
];

const INITIAL_FORM = { name: "", email: "", subject: "", message: "", honeypot: "" };

export default function FooterWithContact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Unable to send message.");

      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Send failed.");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <ConstellationCanvas />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-[6vw] pt-24 pb-12">
        {/* ================= SECTION: CONTACT ================= */}
        <section id="contact" className="mb-24">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[0.7fr_1fr_0.9fr] md:gap-12 items-start">
            
            {/* Kiri: Title & Info */}
            <div>
              <Reveal>
                <div className="eyebrow flex items-center gap-1.5"><span className="text-accent">//</span> Contact</div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 font-display text-[44px] font-semibold uppercase leading-[1.1] tracking-tight">
                  Let&apos;s work <br /><span className="text-accent">together.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="mt-12 flex flex-col gap-6">
                {CONTACT_ROWS.map((item) => (
                  <ContactItem key={item.label} {...item} />
                ))}
              </Reveal>
            </div>

            {/* Tengah: Form */}
            <div>
              <Reveal delay={0.1}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
                    <InputField name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
                  </div>

                  <InputField name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />

                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-5 py-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/50"
                  />

                  <input name="honeypot" value={form.honeypot} onChange={handleChange} tabIndex={-1} className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                  <div className="mt-2 flex">
                    <MagneticButton
                      type="submit"
                      className="group inline-flex items-center gap-14 rounded-md border border-cyan-400/40 bg-black/60 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-cyan-400 hover:bg-white/5"
                    >
                      {status === "success" ? "Sent ✓" : status === "sending" ? "Sending..." : "Send Message"}
                      <span className="text-[12px] text-white/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-400">↗</span>
                    </MagneticButton>
                  </div>

                  {status === "error" && <p className="text-sm text-red-400">{errorMessage}</p>}
                  {status === "success" && <p className="text-sm text-green-400">Message sent. Thank you!</p>}
                </form>
              </Reveal>
            </div>

            {/* Kanan: 3D Objects */}
            <div className="relative hidden md:flex items-center justify-center">
              <Reveal delay={0.12}>
                <div className="relative h-[320px] w-full max-w-[360px]">
                  <FloatingImage src="/hero/sphere.webp" alt="Sphere" className="right-6 top-6 h-[120px] w-[120px] md:h-[160px] md:w-[160px]" shadow="rgba(255,0,255,0.06)" />
                  <FloatingImage src="/hero/cube.webp" alt="Cube" className="left-6 bottom-4 h-[140px] w-[140px] md:h-[180px] md:w-[180px]" shadow="rgba(0,217,255,0.06)" yRange={[6, -10, 6]} rotateRange={[0, -10, 0]} duration={7} />
                </div>
              </Reveal>
            </div>

          </div>
        </section>

        {/* ================= SECTION: FOOTER INFO ================= */}
<motion.div
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  className="border-t border-white/10 pt-12"
>
  {/* Mengubah items-end menjadi items-start agar sejajar dari atas */}
  <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
    
    {/* Kiri: Brand Identity */}
    <div>
      <div className="font-brandbe text-[2rem] tracking-[-0.02em] text-white">ACID</div>
      <p className="mt-2 max-w-[340px] text-[13px] font-light uppercase tracking-[0.2em] text-white/35">
        Creative Developer & Visual Storyteller
      </p>
    </div>

    {/* Kanan: Social Links (Naik ke atas) */}
    <div className="flex flex-col gap-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
        Connect
      </h4>
      <div className="flex flex-wrap gap-2.5">
        {SOCIAL_LINKS.map((link) => (
          <SocialButton key={link.label} {...link} />
        ))}
      </div>
    </div>

  </div>

  <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.15em] text-white/30 md:flex-row">
    <div>© {new Date().getFullYear()} ACID. All rights reserved.</div>
    <div>Built with Next.js & Framer Motion</div>
  </div>
</motion.div>
      </div>
    </footer>
  );
}

// --- SUB COMPONENTS (Helpers) ---
function InputField({ name, type = "text", placeholder, value, onChange, required }: { name: string; type?: string; placeholder: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-md border border-white/10 bg-white/5 px-5 py-4 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/50"
    />
  );
}

function ContactItem({ label, value, href, icon: Icon }: { label: string; value: string; href: string; icon: LucideIcon }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="mt-1 flex h-5 w-5 items-center justify-center text-sm text-white/60">
        <Icon size={16} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">{label}</span>
        <a href={href} data-cursor-hover className="mt-0.5 text-[14px] font-medium tracking-wide transition-colors hover:text-cyan-400">
          {value}
        </a>
      </div>
    </div>
  );
}

function SocialButton({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white/70 transition-colors duration-300 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-400"
    >
      {label}
    </motion.a>
  );
}

function FloatingImage({ src, alt, className, shadow, yRange = [0, -18, 0], rotateRange = [0, 8, 0], duration = 6 }: { src: string; alt: string; className: string; shadow: string; yRange?: number[]; rotateRange?: number[]; duration?: number }) {
  return (
    <motion.div
      animate={{ y: yRange, rotate: rotateRange }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute ${className}`}
    >
      <Image 
  src={src} 
  alt={alt} 
  fill 
  sizes="(max-width: 768px) 100vw, 350px"
  className={`object-contain drop-shadow-[0_0_20px_${shadow}]`} 
  priority 
/>
    </motion.div>
  );
}