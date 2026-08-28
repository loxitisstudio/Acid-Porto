"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "@/components/ProjectModal";
import ConstellationCanvas from "@/components/ConstellationCanvas";
import { projects as initialProjects, type Project } from "@/lib/data";
import { getProjects } from "@/lib/projectClient";

const categories = [
  "ALL WORKS",
  "MOTION GRAPHICS",
  "VIDEO EDITING",
  "DESIGN",
  "3D RENDER",
  "ROBLOX DEVELOPMENT",
];

export default function AllProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [active, setActive] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL WORKS");

  useEffect(() => {
    async function loadProjects() {
      try {
        const fresh = await getProjects();
        setProjects(fresh.length ? fresh : initialProjects);
      } catch {
        setProjects(initialProjects);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "ALL WORKS") return true;
    return project.category.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <main className="relative min-h-screen w-full bg-bg text-ink px-6 md:px-14 py-16 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <ConstellationCanvas />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Navigation Back Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-accent"
          >
            ← BACK TO HOME
          </Link>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-[0.95] tracking-tight">
            ALL <span className="text-accent">PROJECTS</span>
          </h1>
        </div>

        {/* Filter Categories */}
        <div className="mb-12 flex flex-wrap gap-2 border-b border-line/30 pb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-all ${
                  isSelected
                    ? "bg-accent/10 border border-accent text-accent font-bold"
                    : "border border-line bg-glass text-ink/50 hover:border-line-2 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid All Projects */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.button
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActive(project)}
                className="group relative block w-full overflow-hidden rounded-xl border border-line bg-glass text-left transition-all hover:border-accent/50 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg">
                  {project.thumbnail || project.gallery?.[0] ? (
                    <Image
  src={project.thumbnail ?? project.gallery![0]}
  alt={project.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/>
                  ) : (
                    <div className="absolute inset-0" style={{ background: project.gradient }} />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-base group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono uppercase text-ink-3">
                    <span>{project.category}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </main>
  );
}