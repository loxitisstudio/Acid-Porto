"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";
import { stats, timeline } from "@/lib/data";

function StatCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const easeOutCubic = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(value * easeOutCubic));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col items-start justify-center">
      <div className="font-display text-[44px] md:text-[48px] font-light leading-none text-white">{count}+</div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.1em] text-zinc-400">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="section-shell bg-black text-white py-12 md:py-16 px-8 md:px-16">
      {/* Grid Utama (4 Kolom Horizontal Sejajar) */}
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] items-start">
        
        {/* Kolom 1: Teks Deskripsi & Tombol Let's Connect */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <Reveal>
              <div className="text-[11px] uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
                <span className="text-zinc-600">/</span> ABOUT ME
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[38px] md:text-[44px] font-normal uppercase leading-[1.05] tracking-wide text-white">
                I CREATE VISUAL EXPERIENCES THAT TELL <span className="text-cyan-400 font-medium">STORIES.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[13px] leading-[1.8] text-zinc-400 max-w-[380px] font-light">
                I'm ACID — a creative developer and motion designer working at the intersection
                of code and cinema. Every frame, interaction, and pixel is built with intent,
                turning ordinary briefs into experiences people remember.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={0.15}>
            <MagneticButton
              href="#contact"
              className="mt-12 inline-flex items-center gap-6 rounded border border-zinc-800 px-6 py-3.5 text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:border-cyan-400 hover:text-cyan-400 bg-transparent"
            >
              Let's Connect
              <span className="text-xs text-zinc-600">↗</span>
            </MagneticButton>
          </Reveal>
        </div>

        {/* Kolom 2: Kubus / Objek 3D di Tengah */}
        <div className="flex justify-center items-center lg:pt-12">
          <Reveal delay={0.2}>
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex h-[280px] w-[280px] items-center justify-center"
            >
              {/* Replace cube 3D placeholder with Saturn image */}
              <div className="relative h-[220px] w-[220px] md:h-[260px] md:w-[260px]">
                <Image
                  src="/hero/saturn.webp"
                  alt="Saturn"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* Kolom 3: Angka Statistik Raksasa */}
        <div className="flex flex-col gap-10 justify-center lg:pt-8">
          <Reveal delay={0.1}>
            <div className="grid gap-10">
              {stats.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Kolom 4: Timeline Rata Kiri dengan Dot Indikator */}
        <div className="flex items-center h-full lg:pl-6 lg:pt-8">
          <Reveal delay={0.15}>
            <div className="relative border-l border-zinc-900 pl-8 py-2 flex flex-col gap-8">
              {timeline.map((item) => (
                <div key={item.year} className="relative text-left group">
                  {/* Lingkaran (Dot) yang pas menempel di atas garis vertikal */}
                  <span className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border border-zinc-800 bg-black group-hover:border-cyan-400 transition-colors flex items-center justify-center">
                    <span className="h-1 w-1 rounded-full bg-zinc-700 group-hover:bg-cyan-400" />
                  </span>
                  
                  <div className="font-display text-[12px] uppercase tracking-[0.1em] text-white font-medium">
                    {item.year}
                  </div>
                  <div className="mt-1 text-[11px] leading-normal text-zinc-500 uppercase tracking-wider font-light">
                    {item.role}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}