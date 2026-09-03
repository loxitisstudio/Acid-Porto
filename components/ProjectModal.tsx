"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/lib/data";

function isVideoUrl(url: string) {
  return /\.(mp4|mov|webm)(\?.*)?$/i.test(url);
}

function isYouTubeUrl(url: string) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/i.test(url);
}

function isVimeoUrl(url: string) {
  return /(?:vimeo\.com\/)/i.test(url);
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url, "https://example.com");
    const host = parsed.hostname;

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
    }

    if (host.includes("youtube.com")) {
      const searchId = parsed.searchParams.get("v");
      if (searchId) {
        return `https://www.youtube.com/embed/${searchId}?rel=0&modestbranding=1`;
      }

      const paths = parsed.pathname.split("/").filter(Boolean);
      if (paths[0] === "shorts" && paths[1]) {
        return `https://www.youtube.com/embed/${paths[1]}?rel=0&modestbranding=1`;
      }
    }
  } catch (error) {
    return url;
  }

  return url;
}

function getVimeoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url, "https://example.com");
    const segments = parsed.pathname.split("/").filter(Boolean);
    const id = segments.pop();
    if (id && /^\d+$/.test(id)) {
      return `https://player.vimeo.com/video/${id}`;
    }
  } catch (error) {
    return url;
  }

  return url;
}

function getVideoSourceType(url: string) {
  if (!url) return null;
  if (isYouTubeUrl(url)) return "youtube";
  if (isVimeoUrl(url)) return "vimeo";
  if (isVideoUrl(url)) return "direct";
  return null;
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!project) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const modalTitleId = "project-modal-title";
  const modalDescriptionId = "project-modal-description";
  const previewUrl = (project.previewVideo || project.videoUrl)?.trim();
  const previewType = previewUrl ? getVideoSourceType(previewUrl) : null;
  const embedUrl =
    previewType === "youtube"
      ? getYouTubeEmbedUrl(previewUrl!)
      : previewType === "vimeo"
      ? getVimeoEmbedUrl(previewUrl!)
      : previewUrl;

  const handlePlay = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
      audioRef.current.play().catch(() => {});
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSeeking = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  const renderMedia = () => {
    if (previewType === "youtube" || previewType === "vimeo") {
      return (
        <iframe
          src={embedUrl}
          title={project.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full object-cover"
        />
      );
    }

    if (previewType === "direct") {
      return (
        <div className="relative h-full w-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={embedUrl ?? ""}
            controls
            muted
            playsInline
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeking={handleSeeking}
            className="h-full w-full object-cover"
          />
          {project.audioUrl && (
            <audio ref={audioRef} src={project.audioUrl} preload="auto" />
          )}
        </div>
      );
    }

    if (project.thumbnail) {
      return (
        <div className="relative h-full w-full">
          <Image src={project.thumbnail} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      );
    }

    return <div className="absolute inset-0" style={{ background: project.gradient }} />;
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[800] flex items-end sm:items-center justify-center overflow-hidden bg-black/80 p-0 sm:p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="grid h-[92vh] sm:h-[84vh] w-full max-w-[1250px] grid-cols-1 overflow-hidden rounded-t-[24px] sm:rounded-[24px] border border-zinc-800/80 bg-zinc-950 md:grid-cols-12 shadow-2xl"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescriptionId}
          >
            {/* ✅ Sisi Kiri: Media / Video (Lebih luas, misal 7 kolom dari 12) */}
            <div className="relative md:col-span-7 h-[50vh] sm:h-[60vh] md:h-full overflow-hidden bg-black flex items-center justify-center">
              {renderMedia()}
              
              <button
                data-cursor-hover
                onClick={onClose}
                className="absolute left-4 top-4 z-25 flex md:hidden h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors"
              >
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* ✅ Sisi Kanan: Informasi Project (Clean & Minimalist tanpa Tab berlebihan) */}
            <div className="relative md:col-span-5 flex flex-col justify-between h-full p-6 sm:p-8 md:p-10 overflow-y-auto bg-zinc-950">
              {/* Tombol Close Desktop */}
              <div className="hidden md:flex justify-end">
                <button
                  data-cursor-hover
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  <span className="text-sm">✕</span>
                </button>
              </div>

              {/* Konten Utama */}
              <div className="space-y-6 my-auto py-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{project.role}</span>
                    <span>•</span>
                    <span className="text-zinc-200">{project.category}</span>
                  </div>
                  <h3 id={modalTitleId} className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
                    {project.title}
                  </h3>
                </div>

                <p id={modalDescriptionId} className="text-sm sm:text-[15px] leading-relaxed text-zinc-400">
                  {project.desc}
                </p>

                {project.software && (
                  <div className="pt-2 border-t border-zinc-900">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Tools Used
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                      {project.software}
                    </p>
                  </div>
                )}
              </div>

              {/* Bagian bawah opsional (bisa dikosongkan atau ditaruh link eksternal jika ada) */}
              <div className="pt-4 border-t border-zinc-900/60 text-[11px] text-zinc-400 font-mono flex justify-between items-center">
                <span>LOXITIS STUDIO</span>
                <span>PROJECT REVEAL</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}