"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";
import ProjectModal from "./ProjectModal";
import { projects as initialProjects, type Project } from "@/lib/data";
import { getProjects } from "@/lib/projectClient";

const categories = [
  "ALL WORKS",
  "MOTION GRAPHICS",
  "VIDEO EDITING",
  "DESIGN",
  "3D RENDER",
  "ROBLOX DEVELOPMENT"
];

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [active, setActive] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL WORKS");

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const fresh = await getProjects();
        if (isMounted) {
          setProjects(fresh.length ? fresh : initialProjects);
        }
      } catch {
        if (isMounted) {
          setProjects(initialProjects);
        }
      }
    }

    loadProjects();

    const handleFocus = () => loadProjects();
    const handleVisibilityChange = () => {
      if (!document.hidden) loadProjects();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "ALL WORKS") return true;
    return project.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  // Diubah menjadi 6 project agar pas grid 3 kolom (3 di atas, 3 di bawah)
  const displayedProjects = filteredProjects.slice(0, 6);

  return (
    <section id="work" className="relative w-full py-12 md:py-16 px-6 md:px-14 overflow-hidden bg-bg text-ink">
  <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* BAGIAN ATAS: Judul Section */}
        <div>
          <Reveal>
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-accent mb-2">
              <span>//</span> PORTFOLIO
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.5rem,4vw,4rem)] uppercase leading-none tracking-tight">
              SELECTED <span className="text-accent">WORKS</span>
            </h2>
          </Reveal>
        </div>

        {/* BAGIAN UTAMA: Kiri = Filter Kategori, Kanan = Grid 3 Kolom */}
        <div className="flex flex-col lg:flex-row items-start gap-12 w-full">
          
          {/* SISI KIRI: Kategori Filter (Sticky) */}
<div className="w-full lg:w-[260px] lg:sticky lg:top-32 self-start flex flex-col gap-4 z-10 shrink-0">
  <Reveal delay={0.1}>
    {/* Ubah gap-2.5 menjadi gap-5 atau gap-6 agar jarak antar tombol lebih renggang dan panjang ke bawah */}
    <div className="flex flex-col gap-5 items-start border-l border-line/30 pl-3 py-2">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            data-cursor-hover
            className={`relative pl-4 text-[11px] font-mono uppercase tracking-[0.18em] transition-colors text-left py-1.5 ${
              isSelected 
                ? "text-accent font-bold" 
                : "text-ink-2/50 hover:text-ink"
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId="activeCategoryLine"
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_10px_#00D9FF]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {cat}
          </button>
        );
      })}
    </div>
  </Reveal>
</div>

          {/* SISI KANAN: Grid 3 Kolom (Total 6 Project) */}
          <div className="w-full lg:w-[calc(100%-290px)] relative flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedProjects.map((project, i) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Reveal delay={i * 0.05}>
                      <button
                        data-cursor-hover
                        onClick={() => setActive(project)}
                        className="group relative block w-full overflow-hidden rounded-xl border border-line bg-glass text-left transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_15px_30px_rgba(0,217,255,0.12)]"
                      >
                        {/* Area Gambar (Tetap Landscape 16/9 dengan ukuran kecil) */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg">
                          {project.thumbnail || project.gallery?.[0] ? (
                            <>
                              {(project.thumbnail ?? project.gallery![0]).endsWith(".gif") ? (
                                <img
                                  src={project.thumbnail ?? project.gallery![0]}
                                  alt={project.title}
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                                />
                              ) : (
                                <Image
                                  src={project.thumbnail ?? project.gallery![0]}
                                  alt={project.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              )}
                            </>
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                              className="absolute inset-0 z-0"
                              style={{ background: project.gradient }}
                            />
                          )}

                          {/* Ikon Panah Hover */}
                          <div className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[10px] text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-bg shadow-lg">
                            ↗
                          </div>
                          
                          {project.previewVideo && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
                                ▶
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Area Detail Teks */}
                        <div className="p-3">
                          <h3 className="font-sans font-bold text-white text-sm leading-snug group-hover:text-accent transition-colors duration-300">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-ink-3">
                            <span>{project.category}</span>
                            <span className="text-line">•</span>
                            <span>{project.year}</span>
                          </div>
                        </div>

                      </button>
                    </Reveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Tombol View All Projects */}
            <div className="flex justify-start">
              <Reveal>
                <Link
                  href="/projects"
                  data-cursor-hover
                  className="group inline-flex items-center gap-3 rounded-full border border-line-2 bg-glass px-6 py-3 text-[11px] uppercase tracking-widest2 font-medium text-ink transition-all duration-300 hover:bg-ink hover:text-bg hover:border-ink hover:shadow-glow"
                >
                  VIEW ALL PROJECTS
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </Link>
              </Reveal>
            </div>

          </div>

        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
      
    </section>
  );
}