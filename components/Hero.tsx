import Image from "next/image";
import Reveal from "./Reveal";
import ConstellationCanvas from "./ConstellationCanvas";
import HeroParallax from "./HeroParallax";

export default function Hero() {
  return (
    <section
      id="hero"
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
          <g className="hero-line-group hero-line-group-1">
            <path d="M-100,200 C300,50 400,600 700,300 C1000,0 1100,700 1540,400" stroke="#00D9FF" strokeWidth="1" opacity="0.12" />
            <path
              className="hero-line-path hero-line-path-1"
              d="M-100,200 C300,50 400,600 700,300 C1000,0 1100,700 1540,400"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="320"
              filter="url(#glow-line)"
            />
          </g>

          {/* ── GARIS 2 ── */}
          <g className="hero-line-group hero-line-group-2">
            <path d="M200,-50 C100,400 900,200 600,700 C300,1200 1200,500 1600,800" stroke="#FFFFFF" strokeWidth="1" opacity="0.08" />
            <path
              className="hero-line-path hero-line-path-2"
              d="M200,-50 C100,400 900,200 600,700 C300,1200 1200,500 1600,800"
              stroke="url(#grad2)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="300"
              filter="url(#glow-line)"
            />
          </g>

          {/* ── GARIS 3 ── */}
          <g className="hero-line-group hero-line-group-3">
            <path d="M-50,600 C400,800 600,200 1000,500 C1400,800 1200,200 1500,-100" stroke="#00D9FF" strokeWidth="1" opacity="0.1" />
            <path
              className="hero-line-path hero-line-path-3"
              d="M-50,600 C400,800 600,200 1000,500 C1400,800 1200,200 1500,-100"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="340"
              filter="url(#glow-line)"
            />
          </g>
        </svg>
      </div>

      {/* Spacer kosong */}
      <div className="relative z-30 w-full" />

      {/* Main Content */}
      <div className="relative z-20 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ─── Sisi Kiri: Identity + Value + CTA ─── */}
        <div className="relative z-30 lg:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-ink">
                  Motion Designer
                </p>
                <p className="text-sm font-light uppercase tracking-[0.18em] text-ink">
                  &amp; Creative Developer
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="text-[13px] font-light leading-[1.7] text-ink-2 max-w-[300px]">
                Crafting cinematic visuals and interactive experiences.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
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

        {/* Sisi Kanan/Tengah — UNCHANGED */}
        <HeroParallax>
        <div className="relative lg:col-span-8 h-[400px] md:h-[500px] w-full pointer-events-none flex items-center justify-center">
          
          {/* LAYER 1: Teks ACID */}
          <div className="hero-parallax-acid absolute inset-0 z-0 flex select-none items-center justify-center">
            <h1 className="w-full select-none text-center font-sans text-[clamp(9rem,26vw,22rem)] font-thin uppercase leading-[0.8] tracking-[0.2em] text-ink">
              ACID
            </h1>
          </div>

          {/* LAYER 2: Objek 3D */}
          
          <div className="hero-parallax-cube absolute bottom-[2%] left-[8%] z-[1]">
            <div className="relative h-[140px] w-[140px] md:h-[190px] md:w-[190px]">
              <Image src="/hero/cube.webp" alt="Cube" width={190} height={190} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </div>
          </div>

          <div className="hero-parallax-ring absolute right-[5%] top-[-5%] z-[1]">
            <div className="relative h-[150px] w-[150px] md:h-[210px] md:w-[210px]">
              <Image src="/hero/ring.webp" alt="Ring" width={210} height={210} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </div>
          </div>

          <div className="hero-parallax-sphere absolute bottom-[-15%] right-[20%] z-[1]">
            <div className="relative h-[80px] w-[80px] md:h-[110px] md:w-[110px]">
              <Image src="/hero/sphere.webp" alt="Sphere" width={110} height={110} className="h-full w-full object-contain mix-blend-plus-lighter opacity-90 filter contrast-125 brightness-110" priority />
            </div>
          </div>

        </div>
        </HeroParallax>
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