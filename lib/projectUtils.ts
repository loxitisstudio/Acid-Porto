import type { Project } from "@/lib/data";

export function normalizeProject(project: Partial<Project> = {}) {
  const values = project as Record<string, unknown>;
  const source = {
    ...project,
    externalUrl:
      typeof values.externalUrl === "string"
        ? values.externalUrl.trim()
        : typeof values.external_url === "string"
          ? values.external_url.trim()
          : "",
    sortOrder:
      typeof values.sortOrder === "number"
        ? values.sortOrder
        : typeof values.sort_order === "number"
          ? values.sort_order
          : undefined,
  } as Project;

  if (!source.gallery) source.gallery = [];
  if (Array.isArray(source.gallery)) {
    source.gallery = source.gallery.filter((url) => typeof url === "string" && url.trim().length > 0);
  }

  return source;
}

export function normalizeProjects(projects: Array<Partial<Project>> = []) {
  return [...projects]
    .map((project) => normalizeProject(project))
    .sort((a, b) => {
      const aOrder = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return String(a.title || "").localeCompare(String(b.title || ""));
    });
}

export function sanitizeProjectForDb(project: Project) {
  const next = { ...project } as Record<string, unknown>;
  if (typeof next.externalUrl === "string") {
    next.external_url = next.externalUrl.trim();
    delete next.externalUrl;
  }
  if (typeof next.sortOrder === "number") {
    next.sort_order = next.sortOrder;
    delete next.sortOrder;
  }
  if (typeof next.gallery === "undefined") next.gallery = [];
  return next;
}

export function isValidExternalUrl(value: string | null | undefined) {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && !!parsed.hostname && parsed.origin !== "null";
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(value: string | null | undefined) {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
