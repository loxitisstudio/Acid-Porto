"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { navLinks } from "@/lib/data";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    setHidden(y > lastY && y > 200);
    setLastY(y);
  });

  return (
    <>
      {/* 
        CSS @property mencegah animasi dari "reset" ke 0 derajat. 
        Browser akan terus menambahkan nilai derajatnya (361, 362... dst) 
        sehingga menciptakan loop 3D yang benar-benar seamless tanpa Gimbal Lock.
      */}
      <style jsx global>{`
        @property --rx-1 {
          syntax: '<number>';
          inherits: false;
          initial-value: 0;
        }
        @property --ry-1 {
          syntax: '<number>';
          inherits: false;
          initial-value: 0;
        }
        @property --rx-2 {
          syntax: '<number>';
          inherits: false;
          initial-value: 0;
        }
        @property --ry-2 {
          syntax: '<number>';
          inherits: false;
          initial-value: 0;
        }

        .orbit-1 {
          transform: rotateX(calc(var(--rx-1) * 1deg)) rotateY(calc(var(--ry-1) * 1deg));
          animation: spinOrbit1 6s linear infinite;
        }
        .orbit-2 {
          transform: rotateX(calc(var(--rx-2) * 1deg)) rotateY(calc(var(--ry-2) * 1deg));
          animation: spinOrbit2 9s linear infinite;
        }

        @keyframes spinOrbit1 {
          to {
            --rx-1: 360;
            --ry-1: 360;
          }
        }
        @keyframes spinOrbit2 {
          to {
            --rx-2: -360;
            --ry-2: -360;
          }
        }
      `}</style>

      <motion.nav
        initial={false}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 top-0 z-[500] flex items-center justify-between px-[8vw] py-[22px] transition-all duration-600 ${
          scrolled
            ? "border-b border-line bg-bg/75 backdrop-blur-md shadow-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* ── Logo & Brand dengan Efek Orbit 3D Seamless ── */}
        <div className="flex items-center gap-3.5 pl-2">
          <div className="relative flex items-center justify-center p-3">
            {/* Container Perspektif 3D */}
            <div className="absolute inset-0 flex items-center justify-center [perspective:400px]">
              {/* Cincin Orbit 3D Utama (Sekarang 100% Mulus) */}
              <div
                className="orbit-1 absolute h-10 w-10 rounded-full border border-accent/40 [transform-style:preserve-3d] shadow-[0_0_12px_rgba(0,217,255,0.25)]"
              >
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#00D9FF]" />
              </div>

              {/* Cincin Orbit Pendukung (Rotasi Berlawanan & Kecepatan Berbeda) */}
              <div
                className="orbit-2 absolute h-12 w-12 rounded-full border border-white/20 [transform-style:preserve-3d]"
              >
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
              </div>
            </div>

            {/* Logo Utama */}
            <Image 
              src="/icon/Logo LX Putih.png" 
              alt="ACID logo" 
              width={32} 
              height={32} 
              className="object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" 
            />
          </div>
          <span className="font-brandbe font-extrabold text-[16px] tracking-widest3">ACID</span>
        </div>

        {/* ── Nav Links ── */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="group relative text-[11px] uppercase tracking-[0.2em] text-ink-2 transition-colors duration-300 hover:text-ink font-mono"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-300 ease-luxury group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* ── Let's Talk Button ── */}
        <div className="hidden md:block">
          <MagneticButton
            href="#footer"
            className="rounded-full border border-line-2 bg-glass px-6 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:border-accent hover:bg-accent-dim hover:text-accent font-mono"
          >
            Let&apos;s Talk
          </MagneticButton>
        </div>

        {/* ── Mobile Hamburger Menu ── */}
        <button
          aria-label="Open menu"
          data-cursor-hover
          className="flex flex-col gap-1.5 md:hidden p-2"
        >
          <span className="h-px w-[22px] bg-white transition-all" />
          <span className="h-px w-[22px] bg-white transition-all" />
          <span className="h-px w-[22px] bg-white transition-all" />
        </button>
      </motion.nav>
    </>
  );
}