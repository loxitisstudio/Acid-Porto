"use client";

import { useEffect, useRef } from "react";

type ParticleType = "shard" | "dust" | "dot" | "streak" | "elastic";

const TYPES: ParticleType[] = ["shard", "dust", "dot", "streak", "elastic"];

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  r: number;
  g: number;
  b: number;
  baseAlpha: number;
  rotation: number;
  rotSpeed: number;
  speedX: number;
  speedY: number;
  wobbleAmp: number;
  wobbleFreq: number;
  wobbleOffset: number;
  born: number;
  type: ParticleType;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function spawn(vw: number, vh: number): Particle {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const depth = 0.25 + Math.random() * 0.75;

  let w: number, h: number;
  switch (type) {
    case "shard":
      w = 10 + Math.random() * 35;
      h = 1.2 + Math.random() * 2.2;
      break;
    case "dust":
      w = 2 + Math.random() * 5;
      h = w;
      break;
    case "dot":
      w = 1.5;
      h = 1.5;
      break;
    case "streak":
      w = 20 + Math.random() * 70;
      h = 0.6 + Math.random() * 0.4;
      break;
    case "elastic":
      w = 60 + Math.random() * 220;
      h = 1 + Math.random() * 3;
      break;
  }

  const palettes = [
    { r: 255, g: 255, b: 255, a: 0.05 + Math.random() * 0.1 },
    { r: 0, g: 217, b: 255, a: 0.04 + Math.random() * 0.09 },
    { r: 0, g: 255, b: 136, a: 0.03 + Math.random() * 0.06 },
    { r: 255, g: 0, b: 255, a: 0.02 + Math.random() * 0.05 },
  ];
  const c = palettes[Math.floor(Math.random() * palettes.length)];

  return {
    type,
    x: -w - Math.random() * vw * 0.6,
    y: Math.random() * vh,
    w,
    h,
    depth,
    r: c.r,
    g: c.g,
    b: c.b,
    baseAlpha: c.a * depth,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 140,
    speedX: (1.2 + Math.random() * 4.5) * depth,
    speedY: (Math.random() - 0.5) * 0.6,
    wobbleAmp: 4 + Math.random() * 28,
    wobbleFreq: 0.4 + Math.random() * 1.6,
    wobbleOffset: Math.random() * Math.PI * 2,
    born: performance.now(),
  };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export default function WindParticles({ count = 75, className = "absolute inset-0 z-[4] pointer-events-none" }: { count?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = vw + "px";
      canvas.style.height = vh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const pool: Particle[] = Array.from({ length: count }, () => spawn(vw, vh));
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      ctx.clearRect(0, 0, vw, vh);

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        const age = (now - p.born) / 1000;

        // physics
        p.x += p.speedX * 60 * dt;
        p.y += p.speedY * 60 * dt;
        p.rotation += p.rotSpeed * dt;

        const wobbleY = Math.sin(age * p.wobbleFreq + p.wobbleOffset) * p.wobbleAmp;

        // opacity fade in/out
        const fadeIn = Math.min(age / 0.35, 1);
        const fadeOut = p.x > vw * 0.78 ? 1 - (p.x - vw * 0.78) / (vw * 0.28) : 1;
        const alpha = p.baseAlpha * fadeIn * Math.max(0, fadeOut);
        if (alpha < 0.002) {
          // skip tiny alpha to save cycles
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y + wobbleY);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === "dust" || p.type === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha.toFixed(4)})`;
          ctx.fill();
        } else if (p.type === "elastic") {
          const len = p.w;
          const segments = Math.max(6, Math.floor(len / 12));
          ctx.beginPath();
          for (let s = 0; s <= segments; s++) {
            const t = s / segments;
            const xPos = -len * 0.5 + t * len;
            const wobble = Math.sin(age * (1.5 + t * 2.5) + p.wobbleOffset + t * 2) * (p.wobbleAmp * (1 - t) * p.depth);
            const yPos = wobble;
            if (s === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
          }
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${Math.max(0.02, alpha * 0.95).toFixed(4)})`;
          ctx.lineWidth = Math.max(1, p.h * (1 + (1 - p.depth)));
          ctx.lineCap = "round";
          ctx.stroke();

          // head glow
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(alpha * 0.12).toFixed(4)})`;
          ctx.arc(len * 0.5, 0, Math.max(1.5, p.h * 1.8), 0, Math.PI * 2);
          ctx.fill();
        } else {
          const radius = Math.max(1, p.h * 0.5);
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha.toFixed(4)})`;
          roundRect(ctx, -p.w * 0.5, -p.h * 0.5, p.w, p.h, radius);
          ctx.fill();
        }

        ctx.restore();

        // recycle
        if (p.x > vw + p.w + 60 || p.y < -100 || p.y > vh + 100) {
          pool[i] = spawn(vw, vh);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
    />
  );
}
