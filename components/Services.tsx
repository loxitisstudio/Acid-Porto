"use client";

import Reveal from "./Reveal";
import { services } from "@/lib/data";
// Menggunakan lucide-react untuk ikon minimalis modern yang pas
import { Film, Video, Layout, Gamepad2, LucideIcon } from "lucide-react";

// Mapping ikon berdasarkan nama atau ID service yang ada di data
const serviceIcons: Record<string, LucideIcon> = {
  "MOTION GRAPHICS": Film,
  "VIDEO EDITING": Video,
  "UI / UX DESIGN": Layout,
  "ROBLOX DEVELOPMENT": Gamepad2,
};

export default function Services() {
  // Memfilter data service agar Web Development dan Logo & Branding tidak tampil
  const filteredServices = services.filter((service) => {
    const nameUpper = service.name.toUpperCase();
    return (
      !nameUpper.includes("WEB DEVELOPMENT") && 
      !nameUpper.includes("LOGO") && 
      !nameUpper.includes("BRANDING")
    );
  });

  return (
    <section id="services" className="section-shell py-[70px] md:py-[100px]">
      
      {/* Header Layout: Kiri (Title) | Kanan (Button View Pricing) */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
        <div>
          <Reveal>
            <div className="eyebrow">/ SERVICES</div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 font-display text-display font-semibold uppercase leading-[0.95] tracking-wide">
              What I can <br />
              do for <span className="text-accent">you.</span>
            </h2>
          </Reveal>
        </div>

        {/* Tombol View Pricing di sisi kanan */}
        <Reveal delay={0.1}>
          <a
            href="#pricing"
            className="border border-line-2 bg-bg/40 px-5 py-2.5 rounded text-[10px] uppercase tracking-[0.15em] text-ink-2 hover:text-ink hover:border-accent transition-colors flex items-center gap-2"
          >
            View Pricing <span className="text-[11px]">↗</span>
          </a>
        </Reveal>
      </div>

      {/* Grid List Services */}
      <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {filteredServices.map((service, i) => {
          const IconComponent = serviceIcons[service.name.toUpperCase()] || Layout;

          return (
            <Reveal key={service.num} delay={i * 0.04}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-bg p-8 transition-colors duration-400 hover:bg-glass">
                {/* Efek Ambient Glow saat Hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-1/3 -top-1/3 h-[80%] w-[80%] rounded-full bg-accent-dim opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />
                
                <div className="relative">
                  {/* Container Icon */}
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg/50 text-ink-2 transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                    <IconComponent size={22} strokeWidth={1.5} />
                  </div>

                  {/* Service Title */}
                  <h3 className="mb-3 font-display text-[18px] font-medium uppercase tracking-wide">
                    {service.name}
                  </h3>
                  
                  {/* Service Description */}
                  <p className="text-[12.5px] leading-[1.6] text-ink-2 font-light">
                    {service.desc}
                  </p>
                </div>

                {/* Nomor Urut Service di bagian bawah */}
                <div className="relative mt-8 text-[11px] font-mono tracking-[0.1em] text-ink-3/40 group-hover:text-accent/60 transition-colors">
                  {service.num}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}