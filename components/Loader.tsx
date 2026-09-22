"use client";

import { useEffect, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah melihat loader di sesi browser ini
    const hasLoaded = sessionStorage.getItem("hasLoadedBefore");

    if (hasLoaded) {
      setVisible(false);
      onDone();
      return;
    }

    // Jika belum pernah, jalankan animasi gimik timer
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          sessionStorage.setItem("hasLoadedBefore", "true"); // Simpan flag penanda
          setExiting(true);
          setTimeout(() => {
            setVisible(false);
            onDone();
          }, 700);
        }, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div>
      {visible && (
        <div
          style={{ backgroundImage: "url('/hero/loading%20bg%20(2).png')" }}
          className={`fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-cover bg-center text-ink transition-opacity duration-700 ease-luxury ${exiting ? "opacity-0" : "opacity-100"}`}
        >
          {/* Titik Cahaya Atas */}
          <div className="animate-[reveal-in_600ms_ease-out_both] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,1)]" />

          {/* Garis Vertikal Penunjuk */}
          <div className="my-3 h-[70px] w-px origin-top animate-[loader-line_800ms_cubic-bezier(0.16,1,0.3,1)_300ms_both] bg-gradient-to-b from-white to-transparent opacity-40" />

          {/* Judul Utama Brand */}
          <div className="animate-[reveal-in_800ms_cubic-bezier(0.16,1,0.3,1)_600ms_both] font-display text-[76px] font-semibold leading-none tracking-[0.08em] uppercase text-white sm:text-[90px] md:text-[108px]">
            ACID
          </div>

          <div className="mt-3.5 animate-[reveal-in_600ms_ease-out_900ms_both] text-[12px] font-medium uppercase tracking-[0.28em] text-accent sm:text-sm">
            Creative Digital
          </div>

          {/* Progress Bar */}
<div className="absolute bottom-16 z-10 flex w-[calc(100%-40px)] max-w-[360px] animate-[reveal-in_500ms_ease-out_1100ms_both] flex-col gap-2.5 px-4 sm:w-[380px]">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.28em] text-ink-2/70 sm:text-[11px]">
              <span>Loading Experience</span>
              <span className="tabular-nums">{String(progress).padStart(2, "0")}%</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
              <span
                className="absolute left-0 top-0 h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="pt-2 text-[10px] uppercase tracking-[0.28em] text-ink-2/50">
              INITIALIZING CHAYA KOMET
            </p>
          </div>
                  </div>
      )}
              </div>
  );
}