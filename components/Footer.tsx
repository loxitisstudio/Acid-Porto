"use client";

import { motion } from "framer-motion";
import ConstellationCanvas from "./ConstellationCanvas";

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/loxitis_/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "Discord", href: "https://discord.com/" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black px-[6vw] pb-12 pt-24 text-white">
      {/* Background Constellation Full Width - Senada dengan Hero */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <ConstellationCanvas />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-[1200px]"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          
          <div className="flex flex-col items-start md:col-span-5">
            <div className="font-brandbe text-[2rem] tracking-[-0.02em] text-white">
              ACID
            </div>
            <p className="mt-3 max-w-[340px] text-[13px] font-light uppercase tracking-[0.2em] text-white/35">
              Creative Developer & Visual Storyteller
            </p>
          </div>

          <div className="flex flex-col md:col-span-3">
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    data-cursor-hover
                    className="text-sm text-white/60 transition-colors duration-300 hover:text-cyan-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:col-span-4">
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-white/8 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-300 hover:border-cyan-400/40 hover:text-cyan-400"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <form className="mt-6 flex flex-col gap-2.5 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                aria-label="Subscribe email"
                placeholder="your@email.com"
                className="w-full rounded-full border border-white/10 bg-transparent px-5 py-3 text-xs text-white outline-none transition-colors placeholder:text-white/20 focus:border-cyan-400/50"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-all hover:bg-cyan-400 hover:border-cyan-400 whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 text-[11px] uppercase tracking-[0.15em] text-white/30 md:flex-row">
          <div>
            {"\u00A9"} {new Date().getFullYear()} ACID. All rights reserved.
          </div>
          <div>
            <span>Built with Next.js & Framer Motion</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}