"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { Collaborator, Project } from "@/lib/data";

type VideoSource = "direct" | "youtube" | "vimeo";
type SelectedGalleryItem = { projectId: string; index: number } | null;

function getVideoSource(url: string): VideoSource | null {
  if (/\.(mp4|webm)(?:[?#].*)?$/i.test(url)) return "direct";

  try {
    const { hostname, pathname, searchParams } = new URL(url);
    const host = hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
      return "youtube";
    }
    if (host === "vimeo.com" || host === "player.vimeo.com" || host.endsWith(".vimeo.com")) {
      return "vimeo";
    }

    if (host.endsWith("youtube.com") && (searchParams.has("v") || pathname.startsWith("/embed/") || pathname.startsWith("/shorts/"))) {
      return "youtube";
    }
  } catch {
    return null;
  }

  return null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    let id: string | undefined;

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0];
    } else {
      id = parsed.searchParams.get("v") ?? undefined;
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!id && ["embed", "shorts", "live"].includes(segments[0] ?? "")) {
        id = segments[1];
      }
    }

    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1` : null;
  } catch {
    return null;
  }
}

function getVimeoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const id = parsed.pathname.split("/").filter(Boolean).reverse().find((segment) => /^\d+$/.test(segment));
    return id ? `https://player.vimeo.com/video/${id}` : null;
  } catch {
    return null;
  }
}

function getSafeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block break-words text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
      {children}
    </span>
  );
}

function CollaboratorItem({ collaborator }: { collaborator: Collaborator }) {
  const link = getSafeExternalUrl(collaborator.link);
  const details = (
    <>
      {collaborator.photo ? (
        <img
          src={collaborator.photo}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-300"
        >
          {collaborator.name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="flex min-w-0 flex-col break-words">
        <span className="break-words text-zinc-200">{collaborator.name}</span>
        {collaborator.role?.trim() && (
          <span className="break-words text-[10px] text-zinc-500">{collaborator.role}</span>
        )}
      </span>
      {link && <span aria-hidden="true" className="shrink-0 text-cyan-300">↗</span>}
    </>
  );

  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs transition-colors hover:border-cyan-400/50"
    >
      {details}
    </a>
  ) : (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs">
      {details}
    </span>
  );
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
  const galleryBaseRef = useRef<HTMLDivElement>(null);
  const [portalReady, setPortalReady] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<SelectedGalleryItem>(null);
  const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({});
  const gallery = project?.gallery?.filter((item) => item.trim()) ?? [];
  const selectedIndex = project && selectedGallery?.projectId === project.id
    ? selectedGallery.index
    : -1;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!project) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.dispatchEvent(new Event("project-modal:open"));

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
      window.dispatchEvent(new Event("project-modal:close"));
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  useEffect(() => {
    setSelectedGallery(null);
    setFailedMedia({});
  }, [project?.id]);

  if (!project || !portalReady) return null;

  const selectedGalleryUrl = selectedIndex >= 0 ? gallery[selectedIndex] : null;
  const previewUrl = (project.previewVideo || project.videoUrl || "").trim();
  const mediaUrl = selectedGalleryUrl || previewUrl || project.thumbnail || "";
  const mediaType = getVideoSource(mediaUrl);
  const mediaKey = selectedGalleryUrl
    ? `${project.id}:gallery:${selectedIndex}:${mediaUrl}`
    : `${project.id}:preview:${mediaUrl}`;
  const youTubeEmbedUrl = mediaType === "youtube" ? getYouTubeEmbedUrl(mediaUrl) : null;
  const vimeoEmbedUrl = mediaType === "vimeo" ? getVimeoEmbedUrl(mediaUrl) : null;
  const embedUrl = youTubeEmbedUrl ?? vimeoEmbedUrl;

  const syncAudio = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  const renderMedia = () => {
    if (failedMedia[mediaKey]) {
      return (
        <div className="flex aspect-video w-full items-center justify-center bg-zinc-950 px-6 text-center text-sm text-zinc-400">
          This media could not be loaded.
        </div>
      );
    }

    if (embedUrl && (mediaType === "youtube" || mediaType === "vimeo")) {
      return (
        <iframe
          src={embedUrl}
          title={`${project.title} media`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setFailedMedia((current) => ({ ...current, [mediaKey]: true }))}
          className="aspect-video w-full bg-black"
        />
      );
    }

    if (mediaType === "direct") {
      return (
        <div className="relative aspect-video w-full bg-black">
          <video
            key={mediaKey}
            ref={videoRef}
            src={mediaUrl}
            controls
            muted
            playsInline
            onError={() => setFailedMedia((current) => ({ ...current, [mediaKey]: true }))}
            onPlay={() => {
              syncAudio();
              audioRef.current?.play().catch(() => {});
            }}
            onPause={() => audioRef.current?.pause()}
            onSeeking={syncAudio}
            className="h-full w-full object-contain"
          />
          {project.audioUrl && (
            <audio key={`${project.id}:audio`} ref={audioRef} src={project.audioUrl} preload="auto" />
          )}
        </div>
      );
    }

    if (mediaUrl) {
      return (
        <div className="relative aspect-video w-full bg-zinc-950">
          <Image
            src={mediaUrl}
            alt={`${project.title} media`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 60vw"
            onError={() => setFailedMedia((current) => ({ ...current, [mediaKey]: true }))}
          />
        </div>
      );
    }

    return (
      <div
        className="aspect-video w-full bg-zinc-950"
        style={{ background: project.gradient || "#09090b" }}
      />
    );
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/80 p-3 backdrop-blur-sm sm:p-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        aria-describedby="project-modal-description"
        className="relative max-h-[90vh] w-full max-w-[1250px] min-w-0 overflow-y-auto overscroll-contain rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/70 text-sm text-zinc-100 backdrop-blur-sm transition-colors hover:bg-white/10 sm:right-4 sm:top-4"
        >
          ✕
        </button>

        <div className="grid min-w-0 grid-cols-1 md:grid-cols-12">
          <section
            aria-label="Project media"
            className="min-w-0 bg-black md:col-span-7 md:self-start"
          >
            <div ref={galleryBaseRef} className="md:sticky md:top-6">
              <div className="relative min-w-0 overflow-hidden">
                {renderMedia()}
                <span className="absolute bottom-3 left-3 max-w-[calc(100%-5rem)] break-words rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {gallery.length > 0 && (
                <div className="border-t border-white/10 bg-zinc-950/90 px-4 py-3">
                  <div className="flex min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-1">
                    {gallery.map((item, index) => {
                      const key = `${project.id}:gallery:${index}:${item}`;
                      const source = getVideoSource(item);
                      const isSelected = selectedIndex === index;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedGallery({ projectId: project.id, index })}
                          aria-label={`Show gallery item ${index + 1}`}
                          aria-pressed={isSelected}
                          className={`relative aspect-video h-14 w-24 shrink-0 overflow-hidden rounded-lg border bg-zinc-900 transition-colors sm:h-16 sm:w-28 ${
                            isSelected
                              ? "border-cyan-300 shadow-[0_0_0_1px_rgba(103,232,249,0.35)]"
                              : "border-zinc-700/80 hover:border-zinc-500"
                          }`}
                        >
                          {failedMedia[key] ? (
                            <span className="flex h-full w-full items-center justify-center text-[10px] text-zinc-500">
                              Unavailable
                            </span>
                          ) : source === "direct" ? (
                            <video
                              src={item}
                              muted
                              playsInline
                              preload="metadata"
                              onError={() => setFailedMedia((current) => ({ ...current, [key]: true }))}
                              className="h-full w-full object-cover"
                            />
                          ) : source === "youtube" || source === "vimeo" ? (
                            <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-lg text-zinc-200">
                              ▶
                            </span>
                          ) : (
                            <Image
                              src={item}
                              alt=""
                              fill
                              sizes="112px"
                              className="object-cover"
                              onError={() => setFailedMedia((current) => ({ ...current, [key]: true }))}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </section>

          <section
            className="flex min-w-0 flex-col break-words p-5 text-zinc-300 sm:p-8 md:col-span-5"
          >
            <div className="min-w-0 flex-1 space-y-6">
              <header className="min-w-0 pr-10">
                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 break-words text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                  <span className="break-words">{project.year}</span>
                  <span aria-hidden="true">•</span>
                  <span className="break-words">{project.role}</span>
                </div>
                <h2 id="project-modal-title" className="break-words text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
                  {project.title}
                </h2>
              </header>

              <p
                id="project-modal-description"
                className="w-full min-w-0 break-words whitespace-pre-line text-sm leading-relaxed text-zinc-300 sm:text-[15px]"
              >
                {project.desc}
              </p>

              <div className="w-full min-w-0 space-y-4 overflow-hidden break-words rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                <SectionLabel>Project Details</SectionLabel>

                {project.software && (
                  <div className="min-w-0">
                    <SectionLabel>Tools</SectionLabel>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {project.software.split(",").map((tool) => tool.trim()).filter(Boolean).map((tool, index) => (
                        <span
                          key={`${tool}-${index}`}
                          className="max-w-full break-words rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.externalUrl && (
                  <div className="min-w-0">
                    <SectionLabel>External Link</SectionLabel>
                    <a
                      href={getSafeExternalUrl(project.externalUrl) ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex w-full min-w-0 items-start gap-2 break-all text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                      <span className="min-w-0 break-all">
                        {project.externalUrl.replace(/^https?:\/\//i, "")}
                      </span>
                      <span aria-hidden="true" className="shrink-0">↗</span>
                    </a>
                  </div>
                )}

                {project.collaborators?.some((collaborator) => collaborator.name.trim()) && (
                  <div className="min-w-0">
                    <SectionLabel>Collaborators</SectionLabel>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {project.collaborators
                        .filter((collaborator) => collaborator.name.trim())
                        .map((collaborator, index) => (
                          <CollaboratorItem
                            key={`${collaborator.name}-${index}`}
                            collaborator={collaborator}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {project.concept && (
                <div className="min-w-0 space-y-2 border-t border-zinc-800 pt-4">
                  <SectionLabel>Concept</SectionLabel>
                  <p className="break-words whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                    {project.concept}
                  </p>
                </div>
              )}

              {project.process && (
                <div className="min-w-0 space-y-2 border-t border-zinc-800 pt-4">
                  <SectionLabel>Process</SectionLabel>
                  <p className="break-words whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                    {project.process}
                  </p>
                </div>
              )}
            </div>

            <footer className="mt-6 flex min-w-0 flex-col gap-4 border-t border-zinc-800 pt-4">
              {project.externalUrl && getSafeExternalUrl(project.externalUrl) && (
                <a
                  href={getSafeExternalUrl(project.externalUrl)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-300 hover:bg-cyan-400/20"
                >
                  View Project
                </a>
              )}
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 break-words text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                <span>LOXITIS STUDIO</span>
                <span>PROJECT REVEAL</span>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
