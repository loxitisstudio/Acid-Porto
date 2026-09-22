"use client";

import { useState, type ReactNode } from "react";
import Loader from "@/components/Loader";

export default function HomeShell({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <div
        className={`transition-all duration-700 ease-luxury ${
          loaded
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-6 opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}