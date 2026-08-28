"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ElementType, ReactNode, useRef } from "react";

type MagneticProps<T extends ElementType = "a"> = {
  children: ReactNode;
  className?: string;
  as?: T;
  href?: string;
  onClick?: () => void;
  strength?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "href" | "onClick">;

export default function MagneticButton<T extends ElementType = "a">({
  children,
  className,
  as = "a" as T,
  href,
  onClick,
  strength = 0.35,
  ...props
}: MagneticProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Diubah menggunakan motion.create() sesuai standar terbaru Framer Motion
  const MotionTag = motion.create(as as ElementType);

  return (
    <MotionTag
      ref={ref}
      href={href}
      onClick={onClick}
      data-cursor-hover
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}