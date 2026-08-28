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
  const [activeTab, setActiveTab] = useState("Overview");

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

  useEffect(() => {
    if (!project?.gallery?.length && activeTab === "Gallery") {
      setActiveTab("Overview");
    }
  }, [project?.gallery?.length, activeTab]);

  if (!project) return null;

  const hasGallery = Boolean(project.gallery?.length);
  const tabs = hasGallery ? ["Overview", "Gallery"] : ["Overview"];
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

  const renderOverviewContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        {/* ✅ Title lebih kecil di mobile */}
        <h3 id={modalTitleId} className="font-display text-[26px] leading-tight sm:text-[36px]">
          {project.title}
        </h3>
        {/* ✅ Meta info wrap lebih baik di mobile */}
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2 text-[10px] sm:text-[12px] uppercase tracking-[0.08em] sm:tracking-[0.1em] text-ink-2/60">
          <span>{project.year}</span>
          <span className="hidden sm:inline">•</span>
          <span>{project.role}</span>
          <span className="hidden sm:inline">•</span>
          <span>{project.category}</span>
          <span className="hidden sm:inline">•</span>
          <span>{project.software}</span>
        </div>
      </div>

      {/* ✅ Teks sedikit lebih kecil di mobile */}
      <p id={modalDescriptionId} className="text-[13px] leading-[1.75] sm:text-[14.5px] sm:leading-[1.8] text-ink-2">
        {project.desc}
      </p>
    </div>
  );

  const renderGalleryContent = () => (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
      {project.gallery?.map((src) => (
        <div
          key={src}
          className="relative aspect-[4/3] overflow-hidden rounded-[14px] sm:rounded-[18px] border border-line bg-black/5"
        >
          <Image src={src} alt={`${project.title} gallery`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
        </div>
      ))}
    </div>
  );

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
          transition={{ duration: 0.4 }}
          onClick={onClose}
          // ✅ Padding lebih kecil di mobile
          className="fixed inset-0 z-[800] flex items-end sm:items-center justify-center overflow-hidden bg-bg/92 p-0 sm:p-[4vw] backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            // ✅ Mobile: full height, rounded hanya di atas | Desktop: centered dengan rounded semua sisi
            className="grid h-[100dvh] sm:h-[92vh] md:h-[86vh] w-full max-w-[1400px] md:max-w-[96vw] grid-cols-1 overflow-hidden rounded-t-[20px] sm:rounded-t-[20px] md:rounded-[20px] border-t border-line sm:border bg-bg-elev md:grid-cols-2"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescriptionId}
          >
            {/* ✅ Media Container: aspect ratio di mobile, full height di desktop */}
            <div className="relative aspect-[16/9] sm:aspect-auto sm:h-full overflow-hidden bg-black/10">
              {renderMedia()}

              <button
                data-cursor-hover
                onClick={onClose}
                // ✅ Close button lebih kecil di mobile, posisi disesuaikan
                className="absolute right-3 top-3 sm:right-6 sm:top-6 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line-2 bg-bg/80 sm:bg-bg transition-colors hover:bg-glass"
              >
                <span className="text-sm sm:text-base">✕</span>
              </button>
            </div>

            {/* ✅ Content area: scrollable di mobile jika konten panjang */}
            <div className="flex h-auto sm:h-full min-h-0 flex-col overflow-y-auto sm:overflow-hidden p-5 sm:p-9 md:p-[54px]">
              {/* ✅ Tabs */}
              <div className="flex flex-shrink-0 flex-wrap gap-x-5 gap-y-2 sm:gap-x-6 sm:gap-y-3 border-b border-line pb-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      data-cursor-hover
                      className={`relative pb-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.1em] transition-colors ${
                        isActive ? "text-accent" : "text-ink-3 hover:text-ink"
                      }`}
                    >
                      {tab}
                      {isActive && (
                        <motion.span
                          layoutId="activeTabLine"
                          className="absolute bottom-0 left-0 h-[1.5px] w-full bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ✅ Content dengan padding bawah untuk scroll yang nyaman */}
              <div className="mt-4 sm:mt-6 flex-1 overflow-hidden pr-0 pb-4 sm:pb-0">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {activeTab === "Gallery" ? renderGalleryContent() : renderOverviewContent()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}