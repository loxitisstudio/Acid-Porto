import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <div
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      className={`reveal-on-scroll ${className}`}
    >
      {children}
    </div>
  );
}