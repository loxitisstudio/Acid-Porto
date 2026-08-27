"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { services } from "@/lib/data";

// Mapping nama tool ke path file ikon yang sudah di-rename (bebas spasi)
const iconMap: Record<string, string> = {
  "AFTER EFFECTS": "/icon/after-effects-white.png",
  "ILLUSTRATOR": "/icon/adobe-illustrator-white.png",
  "FIGMA": "/icon/figma.png",
  "CAPCUT": "/icon/capcut-white.png",
  "PREMIERE PRO": "/icon/premiere-pro.png",
  "BLENDER": "/icon/blender-white.png",
  "ROBLOX STUDIO": "/icon/roblox-studio.png",
  "VS CODE": "/icon/vscode-white.png",
};

export default function Services() {
  return (
    <section id="services" className="section-shell py-[70px] md:py-[100px]">
      
      {/* Header Layout */}
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

        <Reveal delay={0.1}>
          <a
            href="#work"
            className="border border-line-2 bg-bg/40 px-5 py-2.5 rounded text-[10px] uppercase tracking-[0.15em] text-ink-2 hover:text-ink hover:border-accent transition-colors flex items-center gap-2 w-fit"
          >
            View My Work <span className="text-[11px]">↗</span>
          </a>
        </Reveal>
      </div>

      {/* Grid List Services */}
      <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {services.map((service, i) => {
          return (
            <Reveal key={service.num} delay={i * 0.04}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-bg p-6 md:p-8 transition-colors duration-400 hover:bg-glass">
                
                {/* Efek Ambient Glow saat Hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-1/3 -top-1/3 h-[80%] w-[80%] rounded-full bg-accent-dim opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div>
                  {/* TOP: Logo Icons (Tools Per Kategori) */}
                  {service.tools && service.tools.length > 0 && (
                    <div className="mb-8 flex items-center gap-2 flex-wrap">
                      {service.tools.map((tool, idx) => {
                        const iconPath = iconMap[tool.trim().toUpperCase()];

                        return (
                          <div
                            key={idx}
                            title={tool}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-bg/60 p-2 text-ink-2 transition-all duration-300 group-hover:border-accent/40 group-hover:bg-bg/90"
                          >
                            {iconPath ? (
                              <Image
                                src={iconPath}
                                alt={tool}
                                width={18}
                                height={18}
                                className="h-4 w-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                              />
                            ) : (
                              <span className="text-[8px] font-mono">{tool.slice(0, 3)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Service Title */}
                  <h3 className="mb-3 font-display text-[17px] font-medium uppercase tracking-wide">
                    {service.name}
                  </h3>
                  
                  {/* Service Description */}
                  <p className="text-[12px] leading-[1.6] text-ink-2 font-light">
                    {service.desc}
                  </p>
                </div>

                {/* BOTTOM: Separator & Nomor Urut */}
                <div className="relative mt-8">
                  <div className="h-px w-full bg-line-2 mb-3" />
                  <div className="flex justify-end">
                    <span className="text-[11px] font-mono tracking-[0.1em] text-ink-3/40 group-hover:text-accent/60 transition-colors">
                      {service.num}
                    </span>
                  </div>
                </div>

              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}