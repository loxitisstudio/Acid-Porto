"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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
          setVisible(false);
          setTimeout(onDone, 700);
        }, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundImage: "url('/hero/loading%20bg%20(2).png')" }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-cover bg-center text-ink"
        >
          {/* Titik Cahaya Atas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,1)]"
          />
          
          {/* Garis Vertikal Penunjuk */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 70 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="my-3 w-px bg-gradient-to-b from-white to-transparent opacity-40"
          />
          
          {/* Judul Utama Brand Besar Sesuai Gambar */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="font-display text-[76px] font-semibold leading-none tracking-[0.08em] uppercase text-white sm:text-[90px] md:text-[108px]"
          >
            ACID
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-3.5 text-[12px] font-medium uppercase tracking-[0.28em] text-accent sm:text-sm"
          >
            Creative Digital
          </motion.div>

          {/* Progress Bar Kontainer (Diletakkan di bagian bawah layar secara absolut) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="absolute bottom-16 flex w-[calc(100%-40px)] max-w-[360px] flex-col gap-2.5 px-4 z-10 sm:w-[380px]"
          >
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.28em] text-ink-2/70 sm:text-[11px]">
              <span>Loading Experience</span>
              <span className="tabular-nums">{String(progress).padStart(2, "0")}%</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.span
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.15 }}
                className="absolute left-0 top-0 h-full rounded-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="pt-2 text-[10px] uppercase tracking-[0.28em] text-ink-2/50">
              INITIALIZING CHAYA KOMET
            </p>
          </motion.div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}