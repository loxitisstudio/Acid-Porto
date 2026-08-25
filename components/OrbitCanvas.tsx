"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function OrbitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const t = gsap.ticker.frame;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const base = Math.min(canvas.width, canvas.height);
      const radii = [base * 0.28, base * 0.38, base * 0.47];

      radii.forEach((r, i) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.ellipse(cx, cy, r, r * 0.32, t * 0.002 + i * 0.6, 0, Math.PI * 2);
        ctx.stroke();

        const ang = t * 0.006 + i * 2;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r * 0.32;
        ctx.beginPath();
        ctx.fillStyle = i === 1 ? "rgba(0,217,255,.85)" : "rgba(255,255,255,.6)";
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />;
}
