"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { projects as initialProjects, Project } from "@/lib/data";
import { createProject, deleteProject, getProjects, updateProject, uploadToCloudinary } from "@/lib/projectClient";
import MediaUpload from "@/components/MediaUpload";

const categories = [
  "MOTION GRAPHICS",
  "VIDEO EDITING",
  "DESIGN",
  "3D RENDER",
  "ROBLOX DEVELOPMENT",
];

const tabs = ["General", "Media", "Content", "Settings"] as const;

type Tab = (typeof tabs)[number];

type Message = string | null;

const createProjectTemplate = (): Project => ({
  id: `new-project-${Date.now()}`,
  title: "New Project",
  category: categories[0],
  year: "2026",
  role: "Role",
  software: "Software",
  desc: "",
  gradient: "linear-gradient(160deg, #141414, #050505)",
  thumbnail: "",
  previewVideo: "",
  gallery: [],
  concept: "",
  process: "",
  behindScenes: "",
  result: "",
});

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [extractStatus, setExtractStatus] = useState<{ type: "idle" | "extracting" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [authChecked, setAuthChecked] = useState(false);

  const current = projects[selectedIndex];

  const getYouTubeId = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host.includes("youtu.be")) {
        return parsed.pathname.slice(1) || null;
      }
      if (host.includes("youtube.com")) {
        const id = parsed.searchParams.get("v");
        if (id) return id;
        const match = parsed.pathname.match(/\/embed\/([^/?]+)/);
        if (match) return match[1];
        const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
        if (shortsMatch) return shortsMatch[1];
      }
    } catch {
      return null;
    }
    return null;
  };

  const getVimeoId = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (!host.includes("vimeo.com")) return null;
      const match = parsed.pathname.match(/\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const isDirectVideoUrl = (url: string) => /\.(mp4|mov|webm)(?:\?|$)/i.test(url);

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((project): project is Project => Boolean(project?.title))
        .filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [projects, searchQuery]
  );

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await sessionResponse.json();
        if (!session.authenticated) {
          router.replace("/login");
          return;
        }

        const fresh = await getProjects();
        setProjects(fresh);
        setSelectedIndex(0);
        setMessage("Loaded latest project data.");
      } catch (error) {
        setMessage("Unable to load projects.");
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  const selectProject = (index: number) => {
    setSelectedIndex(index);
    setActiveTab("General");
    setMessage(null);
  };

  const addProject = async () => {
    const template = createProjectTemplate();
    try {
      setSaving(true);
      const updated = await createProject(template);
      setProjects(updated);
      const nextIndex = updated.findIndex((item: Project) => item.id === template.id);
      setSelectedIndex(nextIndex >= 0 ? nextIndex : 0);
      setMessage("New project created.");
    } catch (error) {
      setMessage("Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  const updateProjectField = (key: keyof Project, value: string | string[] | undefined) => {
    if (!current) return;
    const updated: Project = { ...current, [key]: value };
    setProjects((prev) => prev.map((item, index) => (index === selectedIndex ? updated : item)));
  };

  const removeProject = async () => {
    if (!current) return;
    const confirmDelete = window.confirm("Delete this project? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      setSaving(true);
      const remaining = await deleteProject(current.id);
      setProjects(remaining);
      setSelectedIndex(0);
      setMessage("Project deleted.");
    } catch (error) {
      setMessage("Failed to delete project.");
    } finally {
      setSaving(false);
    }
  };

  const saveToApi = async () => {
    if (!current) return;
    try {
      setSaving(true);
      const updated = await updateProject(current);
      setProjects(updated);
      setMessage("Project saved successfully.");
    } catch (error) {
      setMessage("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const refreshFromApi = async () => {
    try {
      setLoading(true);
      const fresh = await getProjects();
      setProjects(fresh);
      setSelectedIndex(0);
      setMessage("Data refreshed.");
    } catch (error) {
      setMessage("Refresh failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  type UploadOptions = { action?: "append" | "replace"; replaceIndex?: number };
  const uploadMedia = async (
    files: File | FileList | null,
    field: "thumbnail" | "gallery",
    options: UploadOptions = { action: "append" }
  ) => {
    if (!files || !current) return;

    const fileArray = files instanceof File ? [files] : Array.from(files);
    if (!fileArray.length) return;

    try {
      setSaving(true);
      const uploadedUrls = await Promise.all(fileArray.map(uploadToCloudinary));
      const updated: Project = {
        ...current,
        [field]: field === "gallery"
          ? options.action === "replace" && typeof options.replaceIndex === "number"
            ? (current.gallery ?? []).map((url, index) => index === options.replaceIndex ? uploadedUrls[0] : url)
            : [...(current.gallery ?? []), ...uploadedUrls]
          : uploadedUrls[0],
      };
      const projectsFromApi = await updateProject(updated);
      setProjects(projectsFromApi);
      setMessage("Media uploaded successfully.");
    } catch (error) {
      setMessage("Media upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const extractVideo = async (url: string) => {
    const isInstagram = /instagram\.com\/(p|reel|reels|tv)\//.test(url);
    const isMp4 = /\.(mp4|mov|webm)(?:\?|$)/i.test(url);

    if (isMp4) {
      updateProjectField("previewVideo", url);
      setExtractStatus({ type: "success", message: "Direct MP4 terdeteksi" });
      setTimeout(() => setExtractStatus({ type: "idle", message: "" }), 3000);
      return;
    }

    if (!isInstagram) {
      setExtractStatus({ type: "error", message: "Hanya link Instagram yang bisa auto-extract" });
      setTimeout(() => setExtractStatus({ type: "idle", message: "" }), 4000);
      return;
    }

    setExtractStatus({ type: "extracting", message: "Mengekstrak video Instagram..." });

        try {
      const res = await fetch("/api/extract-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (data.needsManual && data.toolUrl) {
        window.open(data.toolUrl, "_blank");
        setExtractStatus({
          type: "error",
          message: "Tab baru terbuka — download videonya, lalu paste URL MP4-nya di kolom ini",
        });
      } else if (data.success && data.mp4Url) {
        updateProjectField("previewVideo", data.mp4Url);
        setExtractStatus({ type: "success", message: "Video berhasil di-extract!" });
      } else {
        setExtractStatus({ type: "error", message: data.message || "Gagal extract" });
      }
    } catch {
      setExtractStatus({ type: "error", message: "Gagal menghubungi server" });
    }

    setTimeout(() => setExtractStatus({ type: "idle", message: "" }), 4000);
  };

  const handleVideoPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted) {
      // Jangan update field dulu, biar extract yang ngisi
      e.preventDefault();
      extractVideo(pasted);
    }
  };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !current) return;

    setExtractStatus({ type: "extracting", message: `Mengupload ${file.name}...` });

    try {
      const url = await uploadToCloudinary(file);
      const projectsFromApi = await updateProject({ ...current, previewVideo: url });
      setProjects(projectsFromApi);
      setExtractStatus({ type: "success", message: `${file.name} berhasil diupload!` });
    } catch {
      setExtractStatus({ type: "error", message: "Upload gagal" });
    }

    // Reset input biar bisa upload file yang sama lagi
    e.target.value = "";
  };

  const handleVideoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      extractVideo((e.target as HTMLInputElement).value);
    }
  };

  const deleteGalleryImage = async (index: number) => {
    if (!current) return;
    const ok = window.confirm("Delete this gallery image? This will remove the file permanently.");
    if (!ok) return;
    try {
      setSaving(true);
      const resp = await fetch(`/api/projects?projectId=${encodeURIComponent(current.id)}&field=gallery&index=${index}`, { method: "DELETE" });
      const payload = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error((payload as { error?: string }).error || "Delete failed");
      const updated = (payload as { project?: Project; projects?: Project[] }).project ?? (payload as { project?: Project; projects?: Project[] }).projects?.[0];
      if (!updated) {
        throw new Error("No project returned from server");
      }
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setMessage("Gallery image deleted.");
    } catch (e) {
      setMessage("Failed to delete image.");
    } finally {
      setSaving(false);
    }
  };

  const status = current ? (current.thumbnail || current.previewVideo ? "Published" : "Draft") : "Draft";
  const lastUpdated = current ? new Date().toLocaleDateString() : "-";

  if (!authChecked) return <div className="flex min-h-screen items-center justify-center bg-[#04080f] text-sm text-slate-400">Checking session...</div>;

  return (
    <div className="flex items-center justify-center bg-[#04080f] text-white" style={{ height: '100vh', padding: '18px 0' }}>
      <div className="w-full max-w-[1200px] mx-auto flex h-[calc(100vh-48px)] overflow-hidden rounded-lg border border-slate-800 bg-[#07121b]">
        {/* Sidebar */}
        <div style={{ width: 272 }} className="hidden lg:flex flex-col border-r border-slate-800 bg-[#06111b]">
          <div className="px-4 py-3 flex flex-col gap-2 border-b border-slate-800">
            <div>
              <div className="text-xs uppercase text-cyan-300/70">ACID</div>
              <h1 className="mt-1 text-lg font-semibold">Admin</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={addProject} className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1.5 text-sm font-semibold text-cyan-100">New</button>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="flex-1 rounded-md border border-slate-700 bg-[#0b1724] px-2 py-1.5 text-sm text-white outline-none" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="text-sm text-slate-400">Loading projects…</div>
            ) : filteredProjects.length ? (
              <div className="space-y-2">
                {filteredProjects.map((project, index) => {
                  const sel = index === selectedIndex;
                  return (
                    <button key={project.id} onClick={() => selectProject(index)} className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${sel ? 'bg-cyan-400/10 border border-cyan-400/20' : 'bg-[#08121f] border border-slate-800'}`}>
                      <div className="h-9 w-9 rounded-sm bg-slate-900 overflow-hidden flex items-center justify-center">
                        {project.thumbnail ? <img src={project.thumbnail} alt="" className="h-full w-full object-cover" /> : <div className="text-[10px] text-slate-500">No</div>}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{project.title}</div>
                        <div className="truncate text-xs text-slate-400">{project.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-400">No projects.</div>
            )}
          </div>
          <div className="px-3 py-2 border-t border-slate-800 text-xs text-slate-400">Projects</div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#07121b]">
            <div>
              <p className="text-xs text-slate-500">Portfolio dashboard</p>
              <h2 className="text-lg font-semibold">Project editor</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={refreshFromApi} className="rounded-md border border-slate-700 px-2 py-1.5 text-sm">Discard</button>
              <button onClick={logout} className="rounded-md border border-slate-700 px-2 py-1.5 text-sm">Logout</button>
              <button onClick={saveToApi} disabled={!projects.length || saving} className="rounded-md border border-cyan-400 bg-cyan-400/10 px-3 py-1.5 text-sm font-semibold">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {current ? (
              <div className="space-y-3">
                <div className="rounded-md border border-slate-800 bg-[#091822] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{current.title}</h3>
                        <span className="text-xs text-slate-300">{status}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">ID: {current.id} • Updated: {lastUpdated}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tabs.map((t) => <button key={t} onClick={() => setActiveTab(t)} className={`rounded-md px-2 py-1 text-sm ${activeTab===t? 'bg-cyan-400 text-black':'bg-[#061418] text-slate-300'}`}>{t}</button>)}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-slate-800 bg-[#091822] p-4">
                  {activeTab === 'General' && (
                    <div className="grid gap-3">
                      <div className="grid lg:grid-cols-2 gap-3">
                        <label className="text-sm">
                          <div className="text-slate-300 text-xs">Title</div>
                          <input value={current.title} onChange={(e) => updateProjectField('title', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="text-sm">
                            <div className="text-slate-300 text-xs">Status</div>
                            <input value={status} readOnly className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm text-slate-300" />
                          </label>
                          <label className="text-sm">
                            <div className="text-slate-300 text-xs">Slug</div>
                            <input value={current.id} readOnly className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm text-slate-300" />
                          </label>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-3">
                        <label className="text-sm">
                          <div className="text-slate-300 text-xs">Category</div>
                          <select value={current.category} onChange={(e) => updateProjectField('category', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </label>
                        <label className="text-sm">
                          <div className="text-slate-300 text-xs">Gradient</div>
                          <input value={current.gradient} onChange={(e) => updateProjectField('gradient', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm" />
                        </label>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-3">
                        <label className="text-sm">
                          <div className="text-slate-300 text-xs">Year</div>
                          <input value={current.year} onChange={(e) => updateProjectField('year', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm" />
                        </label>
                        <label className="text-sm">
                          <div className="text-slate-300 text-xs">Role</div>
                          <input value={current.role} onChange={(e) => updateProjectField('role', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm" />
                        </label>
                      </div>

                      <label className="text-sm">
                        <div className="text-slate-300 text-xs">Description</div>
                        <textarea value={current.desc} onChange={(e) => updateProjectField('desc', e.target.value)} rows={4} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm" />
                      </label>
                    </div>
                  )}

                  {activeTab === 'Media' && (
                    <div className="grid gap-3">
                      <div className="grid lg:grid-cols-2 gap-3">
                        <div>
                          <MediaUpload
                            label="Thumbnail"
                            hint="Upload a thumbnail image for the project tile."
                            currentMedia={current.thumbnail}
                            accept=".png,.jpg,.jpeg,.webp,.gif"
                            buttonLabel="Replace thumbnail"
                            onUpload={(files: FileList | null) => uploadMedia(files, "thumbnail", { action: "replace" })}
                          />
                        </div>

                        <div className="rounded-xl border border-slate-800 bg-[#07131d] p-3">
                          <div className="mb-2">
                            <div className="text-sm font-semibold text-slate-100">Preview Video URL</div>
                            <div className="text-xs text-slate-400">Use a public URL for YouTube, Vimeo, MP4, MOV, WebM, Cloudinary, Supabase, or other video sources.</div>
                          </div>

                                                    <div className="flex gap-2">
                            <input
                              value={current.previewVideo ?? ""}
                              onChange={(e) => updateProjectField("previewVideo", e.target.value)}
                              onPaste={handleVideoPaste}
                              onKeyDown={handleVideoKeyDown}
                              placeholder="Paste link Instagram atau URL MP4..."
                              className="flex-1 rounded-md border border-slate-700 bg-[#06141f] px-3 py-2 text-sm text-white outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => extractVideo(current.previewVideo ?? "")}
                              disabled={extractStatus.type === "extracting" || !current.previewVideo}
                              className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap hover:bg-cyan-400/20 transition-colors"
                            >
                              {extractStatus.type === "extracting" ? (
                                <span className="w-3.5 h-3.5 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              )}
                              Extract
                            </button>
                          </div>

                          {extractStatus.type !== "idle" && (
                            <div className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium ${
                              extractStatus.type === "extracting"
                                ? "bg-blue-500/10 border border-blue-500/20 text-blue-300"
                                : extractStatus.type === "success"
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                                : "bg-red-500/10 border border-red-500/20 text-red-300"
                            }`}>
                              {extractStatus.type === "extracting" && (
                                <span className="w-3 h-3 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin" />
                              )}
                              {extractStatus.type === "success" && <span>✓</span>}
                              {extractStatus.type === "error" && <span>✕</span>}
                              {extractStatus.message}
                            </div>
                          )}

                                                    {/* Upload video file langsung */}
                          <div className="mt-3 flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-[#06141f] px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-[#0a1c2a] transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                              Upload video file
                              <input
                                type="file"
                                accept=".mp4,.mov,.webm,video/*"
                                className="hidden"
                                onChange={handleVideoUpload}
                              />
                            </label>
                            <span className="text-xs text-slate-500">Download dari IG, lalu upload di sini</span>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                            {current.previewVideo ? (
                              getYouTubeId(current.previewVideo) ? (
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeId(current.previewVideo)}?rel=0&showinfo=0`}
                                  title="YouTube preview"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="h-48 w-full"
                                />
                              ) : getVimeoId(current.previewVideo) ? (
                                <iframe
                                  src={`https://player.vimeo.com/video/${getVimeoId(current.previewVideo)}`}
                                  title="Vimeo preview"
                                  allow="fullscreen; picture-in-picture"
                                  className="h-48 w-full"
                                />
                              ) : isDirectVideoUrl(current.previewVideo) ? (
                                <video src={current.previewVideo} controls className="h-48 w-full object-cover" />
                              ) : (
                                <div className="p-4 text-sm text-slate-300">
                                  <div className="mb-2">Preview URL saved. Unable to render a live preview for this URL format.</div>
                                  <a href={current.previewVideo} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                                    Open video URL
                                  </a>
                                </div>
                              )
                            ) : (
                              <div className="flex h-48 items-center justify-center text-sm text-slate-500">Enter a video URL to preview it here.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-slate-100">Gallery</div>
                          <label className="rounded-md border px-2 py-1 text-sm">
                            <input type="file" accept="image/*" multiple onChange={(e) => uploadMedia(e.target.files, 'gallery')} className="hidden" />Upload
                          </label>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {(current.gallery ?? []).map((p, i) => {
                            const inputId = `${current.id}-replace-${i}`;
                            return (
                              <div key={`${p}-${i}`} className="group relative rounded-xl overflow-hidden bg-slate-950 h-28">
                                <img src={p} className="w-full h-full object-cover" />

                                <input id={inputId} type="file" accept="image/*" className="hidden" onChange={(e) => uploadMedia(e.target.files, 'gallery', { action: 'replace', replaceIndex: i })} />

                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <label htmlFor={inputId} className="rounded-xl border border-slate-700 bg-[#0b1824] px-3 py-1 text-sm text-white cursor-pointer">Replace</label>
                                  <button onClick={() => deleteGalleryImage(i)} className="rounded-xl border border-red-500 px-3 py-1 text-sm text-red-300">Delete</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Content' && (
                    <div className="grid gap-3">
                      <label className="text-sm"><div className="text-xs text-slate-300">Concept</div><textarea value={current.concept ?? ''} onChange={(e)=>updateProjectField('concept', e.target.value)} rows={4} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm"/></label>
                      <label className="text-sm"><div className="text-xs text-slate-300">Process</div><textarea value={current.process ?? ''} onChange={(e)=>updateProjectField('process', e.target.value)} rows={4} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm"/></label>
                    </div>
                  )}

                  {activeTab === 'Settings' && (
                    <div className="grid gap-3">
                      <label className="text-sm"><div className="text-xs text-slate-300">Project ID</div><input value={current.id} onChange={(e)=>updateProjectField('id', e.target.value)} className="w-full mt-1 rounded-md border border-slate-700 bg-[#06141f] px-2 py-1 text-sm"/></label>
                      <div className="rounded-md border border-slate-800 p-3 text-sm text-slate-400">SEO: <div className="text-slate-100 truncate">{current.title} — /{current.id}</div></div>
                      <div className="pt-1"><button onClick={removeProject} className="rounded-md border border-red-500 px-3 py-1 text-sm text-red-300">Delete Project</button></div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-400">Select a project to edit.</div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-800 bg-[#07121b] flex items-center justify-between">
            <div className="text-sm text-slate-400">Last saved: <span className="text-slate-100">{message || 'No recent changes'}</span></div>
            <div className="flex gap-2"><button onClick={removeProject} className="rounded-md border border-red-500 px-2 py-1 text-sm text-red-300">Delete</button><button onClick={saveToApi} disabled={!projects.length || saving} className="rounded-md border border-cyan-400 px-3 py-1 text-sm">{saving ? 'Saving…' : 'Save Changes'}</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
