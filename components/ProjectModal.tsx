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

  // Referensi untuk sinkronisasi video dan audio terpisah
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!project) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Hanya kunci scroll tanpa mengganggu posisi layar atau body
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
      // Kembalikan pengaturan overflow saat modal ditutup
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

  // Handler sinkronisasi pemutaran media
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
    <div className="space-y-6">
      <div>
        <h3 id={modalTitleId} className="font-display text-[36px]">
          {project.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-4 text-[12px] uppercase tracking-[0.1em] text-ink-2/60">
          <span>{project.year}</span>
          <span>{project.role}</span>
          <span>{project.category}</span>
          <span>{project.software}</span>
        </div>
      </div>

      <p id={modalDescriptionId} className="text-[14.5px] leading-[1.8] text-ink-2">
        {project.desc}
      </p>
    </div>
  );

  const renderGalleryContent = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {project.gallery?.map((src) => (
        <div
          key={src}
          className="relative min-h-[180px] overflow-hidden rounded-[18px] border border-line bg-black/5"
        >
          <Image src={src} alt={`${project.title} gallery`} fill className="object-cover" />
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
          className="h-full w-full rounded-t-[20px] object-cover"
        />
      );
    }

    if (previewType === "direct") {
      return (
        <div className="relative h-full w-full flex items-center justify-center bg-black">
          {/* Video Utama (dimute agar suaranya tidak tabrakan/kosong) */}
          <video
            ref={videoRef}
            src={embedUrl ?? ""}
            controls
            muted
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeking={handleSeeking}
            className="h-full w-full object-cover"
          />

          {/* Audio Terpisah (jika ada data audioUrl di database) */}
          {project.audioUrl && (
            <audio
              ref={audioRef}
              src={project.audioUrl}
              preload="auto"
            />
          )}
        </div>
      );
    }

    if (project.thumbnail) {
      return (
        <div className="relative h-full w-full">
          <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
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
          className="fixed inset-0 z-[800] flex items-center justify-center overflow-hidden bg-bg/92 p-[4vw] backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="grid h-[92vh] max-h-[92vh] w-full max-w-[1400px] md:max-w-[96vw] grid-cols-1 overflow-hidden rounded-[20px] border border-line bg-bg-elev md:h-[86vh] md:grid-cols-2"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescriptionId}
          >
            <div className="relative h-[260px] overflow-hidden bg-black/10 md:h-full">
              {renderMedia()}

              <button
                data-cursor-hover
                onClick={onClose}
                className="absolute right-6 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-line-2 bg-bg transition-colors hover:bg-glass"
              >
                ✕
              </button>
            </div>

            <div className="flex h-full min-h-[260px] flex-col overflow-hidden p-9 md:p-[54px]">
              <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      data-cursor-hover
                      className={`relative pb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
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

              <div className="mt-6 flex-1 overflow-hidden pr-0">
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