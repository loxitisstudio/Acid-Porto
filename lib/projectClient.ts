import { type Project } from "@/lib/data";

const PROJECTS_API = "/api/projects";

async function parseProjectsResponse(response: Response): Promise<Project[]> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Project request failed");
  }

  if (Array.isArray(payload.projects)) {
    return payload.projects as Project[];
  }

  if (payload.project) {
    return [payload.project as Project];
  }

  return [];
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(PROJECTS_API, { cache: "no-store" });
  return parseProjectsResponse(response);
}

export async function createProject(project: Project): Promise<Project[]> {
  const response = await fetch(PROJECTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });

  return parseProjectsResponse(response);
}

export async function updateProject(project: Project): Promise<Project[]> {
  const response = await fetch(PROJECTS_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project }),
  });

  return parseProjectsResponse(response);
}

export async function deleteProject(projectId: string): Promise<Project[]> {
  const response = await fetch(`${PROJECTS_API}?projectId=${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  });

  return parseProjectsResponse(response);
}

// lib/projectclient.ts
// ... kode yang sudah ada tetap dipertahankan ...

// === TAMBAHKAN INI ===

export interface ExtractResult {
  success: boolean;
  type: string;
  mp4Url: string | null;
  message: string;
  error?: string;
}

/**
 * Kirim URL ke API extract, dapatkan MP4 URL kembali
 */
export async function extractVideoUrl(url: string): Promise<ExtractResult> {
  try {
    const response = await fetch("/api/extract-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data: ExtractResult = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      type: "error",
      mp4Url: null,
      message: "Gagal menghubungi server",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deteksi tipe URL dari sisi client (untuk UI feedback cepat)
 */
export function detectUrlTypeClient(url: string): {
  type: string;
  label: string;
  icon: string;
  color: string;
} {
  if (/instagram\.com\/(p|reel|reels|tv)\//.test(url)) {
    return { type: "instagram", label: "Instagram Post/Reel", icon: "fa-brands fa-instagram", color: "#E1306C" };
  }
  if (/\.mp4(\?|$)/.test(url)) {
    return { type: "direct_mp4", label: "Direct MP4", icon: "fa-solid fa-file-video", color: "#2ecc71" };
  }
  if (/youtube\.com|youtu\.be/.test(url)) {
    return { type: "youtube", label: "YouTube", icon: "fa-brands fa-youtube", color: "#FF0000" };
  }
  if (/tiktok\.com/.test(url)) {
    return { type: "tiktok", label: "TikTok", icon: "fa-brands fa-tiktok", color: "#00f2ea" };
  }
  return { type: "unknown", label: "URL tidak dikenali", icon: "fa-solid fa-link", color: "#7a7a8e" };
}