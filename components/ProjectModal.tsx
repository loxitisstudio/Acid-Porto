"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
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
  const [selectedGallery, setSelectedGallery] = useState<{ projectId: string; index: number } | null>(null);
  const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({});

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

  if (!project || typeof document === "undefined") return null;

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
  const gallery = project.gallery?.filter((image) => image.trim()) ?? [];
  const selectedGalleryIndex = selectedGallery?.projectId === project.id ? selectedGallery.index : -1;
  const selectedGalleryMedia = selectedGalleryIndex >= 0 ? gallery[selectedGalleryIndex] : undefined;
  const selectedMediaKey = selectedGalleryMedia
    ? `${project.id}:gallery:${selectedGalleryIndex}:${selectedGalleryMedia}`
    : `${project.id}:preview:${previewUrl ?? project.thumbnail ?? ""}`;
  const selectedMediaUrl = selectedGalleryMedia ?? previewUrl ?? project.thumbnail ?? "";
  const selectedMediaType = getVideoSourceType(selectedMediaUrl);
  const selectedMediaEmbedUrl =
    selectedMediaType === "youtube"
      ? getYouTubeEmbedUrl(selectedMediaUrl)
      : selectedMediaType === "vimeo"
        ? getVimeoEmbedUrl(selectedMediaUrl)
        : selectedMediaUrl;

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
    if (failedMedia[selectedMediaKey]) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-950 px-6 text-center text-sm text-zinc-400">
          This media could not be loaded.
        </div>
      );
    }

    if (selectedGalleryMedia && (selectedMediaType === "youtube" || selectedMediaType === "vimeo")) {
      return (
        <iframe
          src={selectedMediaEmbedUrl}
          title={`${project.title} gallery video`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
          className="h-full w-full"
        />
      );
    }

    if (selectedGalleryMedia && selectedMediaType === "direct") {
      return (
        <video
          key={selectedMediaKey}
          ref={videoRef}
          src={selectedMediaEmbedUrl}
          controls
          muted
          playsInline
          onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
          onPlay={handlePlay}
          onPause={handlePause}
          onSeeking={handleSeeking}
          className="h-full w-full bg-black object-contain"
        />
      );
    }

    if (selectedGalleryMedia) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={selectedGalleryMedia}
            alt={`${project.title} gallery image`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
          />
        </div>
      );
    }

    if (previewType === "youtube" || previewType === "vimeo") {
      return (
        <iframe
          src={embedUrl}
          title={project.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
          className="h-full w-full"
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
            onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
            className="h-full w-full object-cover"
          />
          {project.audioUrl && <audio ref={audioRef} src={project.audioUrl} preload="auto" />}
        </div>
      );
    }

    if (project.thumbnail) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setFailedMedia((current) => ({ ...current, [selectedMediaKey]: true }))}
          />
        </div>
      );
    }

    return <div className="absolute inset-0" style={{ background: project.gradient }} />;
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[800] flex h-screen w-screen animate-[modal-fade-in_300ms_ease-out] items-center justify-center overflow-hidden bg-black/80 p-3 backdrop-blur-md sm:p-6"
    >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="grid h-[90vh] max-h-[90vh] w-full max-w-[1250px] animate-[modal-slide-in_400ms_cubic-bezier(0.16,1,0.3,1)] grid-cols-1 grid-rows-[minmax(0,46vh)_minmax(0,1fr)] overflow-hidden rounded-[24px] border border-zinc-800/80 bg-zinc-950 shadow-2xl md:grid-cols-12 md:grid-rows-1"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescriptionId}
          >
            <div className="flex h-[46vh] min-h-0 min-w-0 flex-col overflow-hidden bg-black md:col-span-7 md:h-full">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                {renderMedia()}

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                  <div className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-200 backdrop-blur-sm">
                    {project.category}
                  </div>
                  <button
                    data-cursor-hover
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 text-sm text-zinc-200 backdrop-blur-sm transition-colors hover:bg-white/10"
                    aria-label="Close project modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {gallery.length > 0 && (
                <div className="shrink-0 border-t border-white/10 bg-zinc-950/90 px-4 py-3">
                  <div className="flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-1">
                    {gallery.map((media, index) => {
                      const isSelected = selectedGalleryIndex === index;
                      const mediaType = getVideoSourceType(media);
                      const thumbnailKey = `${project.id}:gallery:${index}:${media}`;
                      const thumbnailEmbedUrl =
                        mediaType === "youtube"
                          ? getYouTubeEmbedUrl(media)
                          : mediaType === "vimeo"
                            ? getVimeoEmbedUrl(media)
                            : media;

                      return (
                        <button
                          key={`${media}-${index}`}
                          type="button"
                          onClick={() => setSelectedGallery({ projectId: project.id, index })}
                          aria-label={`Show gallery media ${index + 1}`}
                          aria-pressed={isSelected}
                          className={`relative aspect-video h-14 w-24 shrink-0 overflow-hidden rounded-lg border bg-zinc-900 transition-colors sm:h-16 sm:w-28 lg:h-[72px] lg:w-32 ${
                            isSelected ? "border-cyan-300 shadow-[0_0_0_1px_rgba(103,232,249,0.35)]" : "border-zinc-700/80 hover:border-zinc-500"
                          }`}
                        >
                          {failedMedia[thumbnailKey] ? (
                            <span className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">Unavailable</span>
                          ) : mediaType === "direct" ? (
                            <video
                              src={media}
                              muted
                              playsInline
                              preload="metadata"
                              onError={() => setFailedMedia((current) => ({ ...current, [thumbnailKey]: true }))}
                              className="h-full w-full object-cover"
                            />
                          ) : mediaType === "youtube" || mediaType === "vimeo" ? (
                            <span className="flex h-full w-full items-center justify-center text-lg text-zinc-200" aria-hidden="true">▶</span>
                          ) : (
                            <Image
                              src={media}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                              onError={() => setFailedMedia((current) => ({ ...current, [thumbnailKey]: true }))}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex h-full min-h-0 min-w-0 w-full flex-col justify-between overflow-x-hidden overflow-y-auto bg-zinc-950 p-6 sm:p-8 md:col-span-5 md:p-9">
              <div className="w-full min-w-0 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      <span>{project.year}</span>
                      <span>•</span>
                      <span>{project.role}</span>
                    </div>
                    <h3 id={modalTitleId} className="break-words text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <p id={modalDescriptionId} className="w-full max-w-full min-w-0 overflow-hidden break-words text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
                  {project.desc}
                </p>

                <div className="w-full max-w-full min-w-0 overflow-hidden break-words rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Project details</p>
                  <div className="w-full min-w-0 space-y-3 overflow-hidden break-words text-sm text-zinc-300">
                    {project.software && (
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Tools</span>
                        <span className="mt-1 block text-zinc-200">{project.software}</span>
                      </div>
                    )}
                    {project.externalUrl && (
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">External link</span>
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex w-full max-w-full min-w-0 items-start gap-2 break-all text-cyan-300 transition-colors hover:text-cyan-200"
                        >
                          <span className="min-w-0 break-all">{project.externalUrl.replace(/^https?:\/\//i, "")}</span>
                          <span aria-hidden="true" className="shrink-0">↗</span>
                        </a>
                      </div>
                    )}
                    {project.collaborators && project.collaborators.length > 0 && (
                      <div>
                        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Collaborators</span>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {project.collaborators.filter((collaborator) => collaborator.name.trim()).map((collaborator, index) => {
                            const hasSafeLink = /^https?:\/\//i.test(collaborator.link);
                            const content = (
                              <>
                                {collaborator.photo ? (
                                  <img src={collaborator.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                                ) : (
                                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                                    {collaborator.name.slice(0, 1).toUpperCase()}
                                  </span>
                                )}
                                <span className="flex min-w-0 flex-col">
                                  <span>{collaborator.name}</span>
                                  {collaborator.role?.trim() && (
                                    <span className="text-[10px] text-zinc-500">{collaborator.role}</span>
                                  )}
                                </span>
                                {hasSafeLink && <span aria-hidden="true" className="text-cyan-300">↗</span>}
                              </>
                            );
                            return hasSafeLink ? (
                              <a
                                key={`${collaborator.name}-${index}`}
                                href={collaborator.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 transition-colors hover:border-cyan-400/50"
                              >
                                {content}
                              </a>
                            ) : (
                              <span key={`${collaborator.name}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200">
                                {content}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {project.concept && (
                  <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Concept</span>
                    <p className="text-sm leading-relaxed text-zinc-300">{project.concept}</p>
                  </div>
                )}

                {project.process && (
                  <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Process</span>
                    <p className="text-sm leading-relaxed text-zinc-300">{project.process}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800 pt-4">
                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-300 hover:bg-cyan-400/20"
                  >
                    View Project
                  </a>
                )}
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  <span>LOXITIS STUDIO</span>
                  <span>PROJECT REVEAL</span>
                </div>
              </div>
            </div>
          </div>
    </div>,
    document.body
  );
}