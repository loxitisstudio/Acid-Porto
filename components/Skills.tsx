"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";
import { skills } from "@/lib/data";
import afterEffects from "@/icon/After Effect Color.png";
import blender from "@/icon/Blender White.png";
import illustrator from "@/icon/Adobe Illustator White.png";
import vscode from "@/icon/vscode White.png";

const toolIcons: Record<string, any> = {
  ae: afterEffects,
  bl: blender,
  ai: illustrator,
  vs: vscode,
};

function SkillCard({ skill }: { skill: (typeof skills)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) setWidth(skill.level);
  }, [inView, skill.level]);

  return (
    <div
      ref={ref}
      className="group flex flex-col justify-between border-line bg-bg p-8 transition-colors duration-400 hover:bg-glass"
    >
      <div>
        <div className="mb-6 flex items-center justify-between">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-[11px] font-medium"
            style={{ color: skill.chipColor, backgroundColor: `${skill.chipColor}14` }}
          >
            {toolIcons[skill.id] ? (
              <Image
                src={toolIcons[skill.id]!}
                alt={`${skill.name} icon`}
                width={20}
                height={20}
                className="max-h-[20px] max-w-[20px]"
              />
            ) : (
              skill.chip
            )}
          </span>
          <span className="text-[11px] text-ink-2">{skill.level}%</span>
        </div>
        <div className="text-[15px]">{skill.name}</div>
        <p className="mt-1.5 text-[12px] text-ink-2">{skill.desc}</p>
      </div>
      <div className="relative mt-7 h-px w-full bg-line-2">
        <div
          className="absolute left-0 top-0 h-px bg-accent transition-[width] duration-[1400ms] ease-soft"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    // Diubah dari py-12 md:py-16 menjadi pt-4 pb-12 md:pt-6 md:pb-16
    <section id="skills" className="section-shell -mt-24 pt-0 pb-12 md:-mt-32 md:pb-16">
      
      {/* Header Layout: Kiri (Title) | Kanan (Desc) */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-[1.5fr_2fr] items-end gap-6 w-full">
        {/* Sisi Kiri: Judul */}
        <Reveal>
          <h2 className="font-display text-display font-semibold uppercase leading-[0.95] tracking-wide">
            Tools <br /> I master
          </h2>
        </Reveal>
        
        {/* Sisi Kanan: Deskripsi Pendek */}
        <Reveal delay={0.05}>
          <p className="max-w-[280px] text-[12px] md:text-sm text-ink-2 md:pl-8 font-light leading-relaxed uppercase tracking-wider">
            The right tools in the right hands can create magic.
          </p>
        </Reveal>
      </div>

      {/* Grid List Skill */}
      <Reveal delay={0.15}>
        <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}