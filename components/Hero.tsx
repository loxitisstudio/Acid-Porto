"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import ConstellationCanvas from "./ConstellationCanvas";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springPx = useSpring(px, { stiffness: 50, damping: 30 });
  const springPy = useSpring(py, { stiffness: 50, damping: 30 });

  const acidX = useTransform(springPx, (v) => v * 15);
  const acidY = useTransform(springPy, (v) => v * 10);

  const cubeX = useTransform(springPx, (v) => v * 30);
  const cubeY = useTransform(springPy, (v) => v * 25);

  const ringX = useTransform(springPx, (v) => v * -22);
  const ringY = useTransform(springPy, (v) => v * 28);

  const sphereX = useTransform(springPx, (v) => v * 35);
  const sphereY = useTransform(springPy, (v) => v * -20);

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative min-h-screen overflow-hidden bg-bg text-ink flex flex-col justify-between px-6 md:px-14 py-10 font-body"
    >
      {/* Background Constellation */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <ConstellationCanvas />
      </div>

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── Efek Garis-garis ─── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── GARIS 1 ── */}
          <motion.g
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: [-10, 10, -10] }}
            transition={{
              opacity: { duration: 2.2, ease: "easeOut" },
              y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <path d="M-100,200 C300,50 400,600 700,300 C1000,0 1100,700 1540,400" stroke="#00D9FF" strokeWidth="1" opacity="0.12" />
            <motion.path
              d="M-100,200 C300,50 400,600 700,300 C1000,0 1100,700 1540,400"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="320"
              filter="url(#glow-line)"
              initial={{ opacity: 0.1, strokeDashoffset: 320 }}
              animate={{ opacity: [0.15, 0.9, 0.15], strokeDashoffset: [320, -320] }}
              transition={{
                opacity: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                strokeDashoffset: { duration: 10, repeat: Infinity, ease: "linear", delay: 1.2 },
              }}
            />
          </motion.g>

          {/* ── GARIS 2 ── */}
          <motion.g
            initial={{ opacity: 0, y: 12, x: 6 }}
            animate={{ opacity: 1, y: [12, -18, 12], x: [-8, 8, -8] }}
            transition={{
              opacity: { duration: 2.4, ease: "easeOut", delay: 0.2 },
              y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 11, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <path d="M200,-50 C100,400 900,200 600,700 C300,1200 1200,500 1600,800" stroke="#FFFFFF" strokeWidth="1" opacity="0.08" />
            <motion.path
              d="M200,-50 C100,400 900,200 600,700 C300,1200 1200,500 1600,800"
              stroke="url(#grad2)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="300"
              filter="url(#glow-line)"
              initial={{ opacity: 0.1, strokeDashoffset: 300 }}
              animate={{ opacity: [0.12, 0.85, 0.12], strokeDashoffset: [300, -300] }}
              transition={{
                opacity: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                strokeDashoffset: { duration: 12, repeat: Infinity, ease: "linear", delay: 1.6 },
              }}
            />
          </motion.g>

          {/* ── GARIS 3 ── */}
          <motion.g
            initial={{ opacity: 0, y: 18, x: -6 }}
            animate={{ opacity: 1, y: [18, -12, 18], x: [10, -10, 10] }}
            transition={{
              opacity: { duration: 2.6, ease: "easeOut", delay: 0.4 },
              y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 13, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <path d="M-50,600 C400,800 600,200 1000,500 C1400,800 1200,200 1500,-100" stroke="#00D9FF" strokeWidth="1" opacity="0.1" />
            <motion.path
              d="M-50,600 C400,800 600,200 1000,500 C1400,800 1200,200 1500,-100"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="340"
              filter="url(#glow-line)"
              initial={{ opacity: 0.1, strokeDashoffset: 340 }}
              animate={{ opacity: [0.15, 0.9, 0.15], strokeDashoffset: [340, -340] }}
              transition={{
                opacity: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
                strokeDashoffset: { duration: 11, repeat: Infinity, ease: "linear", delay: 2.2 },
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Spacer kosong */}
      <div className="relative z-30 w-full" />

      {/* Main Content */}
      <div className="relative z-20 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Sisi Kiri */}
        <div className="relative z-30 lg:col-span-4 flex flex-col gap-8">
          <Reveal>
            <div className="flex flex-col gap-2.5 text-[11px] font-light uppercase tracking-widest2 text-ink-2">
              <p>CREATIVE DEVELOPER</p>
              <p>MOTION DESIGNER</p>
              <p>VISUAL STORYTELLER</p>
              <p>CREATIVE EDITOR</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full border border-line-2 bg-glass px-7 py-3.5 text-[11px] uppercase tracking-widest2 font-medium text-ink transition-all duration-300 hover:bg-ink hover:text-bg hover:border-ink hover:shadow-glow"
              >
                VIEW PORTFOLIO
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Sisi Kanan/Tengah */}
        <div className="relative lg:col-span-8 h-[400px] md:h-[500px] w-full pointer-events-none flex items-center justify-center">
          
          {/* LAYER 1: Teks ACID */}
          <motion.div 
            style={{ x: acidX, y: acidY }} 
            className="absolute inset-0 flex items-center justify-center select-none z-0"
          >
            <motion.h2 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="font-sans font-thin text-[clamp(9rem,26vw,22rem)] leading-[0.8] tracking-[0.2em] text-ink text-center select-none w-full uppercase"
            >
              ACID
            </motion.h2>
          </motion.div>

          {/* LAYER 2: Objek 3D */}
          
          <motion.div style={{ x: cubeX, y: cubeY }} className="absolute left-[8%] bottom-[2%] z-[1]">
            <motion.div
              animate={{ y: [-18, 14, -18], rotateZ: [-5, 12, -5], rotateX: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-[140px] w-[140px] md:h-[190px] md:w-[190px]"
            >
              <Image src="/hero/cube.webp" alt="Cube" width={190} height={190} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </motion.div>
          </motion.div>

          <motion.div style={{ x: ringX, y: ringY }} className="absolute right-[5%] top-[-5%] z-[1]">
            <motion.div
              animate={{ y: [15, -20, 15], rotateZ: [10, -12, 10], rotateY: [0, 15, 0] }}
              transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-[150px] w-[150px] md:h-[210px] md:w-[210px]"
            >
              <Image src="/hero/ring.webp" alt="Ring" width={210} height={210} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </motion.div>
          </motion.div>

          <motion.div style={{ x: sphereX, y: sphereY }} className="absolute right-[20%] bottom-[-15%] z-[1]">
            <motion.div
              animate={{ y: [-22, 16, -22], x: [-10, 10, -10], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-[80px] w-[80px] md:h-[110px] md:w-[110px]"
            >
              <Image src="/hero/sphere.webp" alt="Sphere" width={110} height={110} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Footer / Scroll Indicator */}
      <div className="relative z-30 w-full flex items-center justify-start">
        <Reveal delay={0.4}>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest2 text-ink-2">
            <span className="inline-block animate-pulse text-accent">◎</span>
            SCROLL TO EXPLORE
          </div>
        </Reveal>
      </div>
    </section>
  );
}