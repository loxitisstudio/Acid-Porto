"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function HeroParallax({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updatePosition = () => {
      container.style.setProperty("--cursor-x", `${pointerX}`);
      container.style.setProperty("--cursor-y", `${pointerY}`);
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

      if (!frame) frame = requestAnimationFrame(updatePosition);
    };

    const resetPosition = () => {
      pointerX = 0;
      pointerY = 0;
      if (!frame) frame = requestAnimationFrame(updatePosition);
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", resetPosition, { passive: true });

    return () => {
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", resetPosition);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-parallax h-full w-full">
      {children}
    </div>
  );
}