import { NextResponse } from "next/server";
import { projects as initialProjects, type Project } from "@/lib/data";

const storageKey = "acid-projects";
let memoryProjects: Project[] = [...initialProjects];

function cloneProjects(projects: Project[]): Project[] {
  return projects.map((project) => ({ ...project, gallery: [...(project.gallery ?? [])] }));
}

function readProjects(): Project[] {
  if (typeof process !== "undefined" && process.env[storageKey]) {
    try {
      const parsed = JSON.parse(process.env[storageKey] as string) as Project[];
      if (Array.isArray(parsed)) {
        memoryProjects = cloneProjects(parsed);
        return cloneProjects(parsed);
      }
    } catch {
      // fall back to in-memory store
    }
  }

  return cloneProjects(memoryProjects);
}

function writeProjects(projects: Project[]) {
  const cloned = cloneProjects(projects);
  memoryProjects = cloned;
  if (typeof process !== "undefined") {
    process.env[storageKey] = JSON.stringify(cloned);
  }
}

async function toDataUrl(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

function findProject(projects: Project[], projectId: string) {
  return projects.find((project) => project.id === projectId);
}

export async function GET() {
  return NextResponse.json({ projects: readProjects() });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const projectId = formData.get("projectId")?.toString();
    const field = formData.get("field")?.toString();
    const action = formData.get("action")?.toString();
    const replaceIndexValue = formData.get("replaceIndex")?.toString();
    const replaceIndex = replaceIndexValue ? Number(replaceIndexValue) : undefined;
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (!projectId || !field) {
      return NextResponse.json({ error: "Invalid media payload" }, { status: 400 });
    }

    const projects = readProjects();
    const project = findProject(projects, projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const nextProject: Project = { ...project };

    if (field === "thumbnail") {
      const file = files[0];
      if (file) {
        const dataUrl = await toDataUrl(file);
        nextProject.thumbnail = dataUrl;
      }
    }

    if (field === "gallery") {
      const nextGallery = [...(project.gallery ?? [])];
      const fileUrls = await Promise.all(files.map((file) => toDataUrl(file)));

      if (typeof replaceIndex === "number" && replaceIndex >= 0 && replaceIndex < nextGallery.length) {
        nextGallery[replaceIndex] = fileUrls[0] ?? nextGallery[replaceIndex];
      } else if (action === "replace") {
        nextGallery.splice(0, nextGallery.length, ...(fileUrls.length ? fileUrls : nextGallery));
      } else {
        nextGallery.push(...fileUrls);
      }

      nextProject.gallery = nextGallery;
    }

    const next = projects.map((item) => (item.id === project.id ? nextProject : item));
    writeProjects(next);
    return NextResponse.json({ projects: readProjects(), project: nextProject });
  }

  const body = await request.json().catch(() => null);
  const project = body && typeof body === "object" ? (body as Project) : null;

  if (!project?.id || !project.title) {
    return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
  }

  const projects = readProjects();
  const next = [project, ...projects];
  writeProjects(next);

  return NextResponse.json({ projects: readProjects(), project });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);

  if (Array.isArray(body)) {
    const next = cloneProjects(body as Project[]);
    writeProjects(next);
    return NextResponse.json({ projects: next });
  }

  if (body && typeof body === "object" && "project" in body) {
    const incoming = (body as { project: Project }).project;
    const projects = readProjects();
    const next = projects.map((project) => (project.id === incoming.id ? incoming : project));
    writeProjects(next);
    return NextResponse.json({ projects: cloneProjects(next), project: incoming });
  }

  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const field = url.searchParams.get("field");
  const indexValue = url.searchParams.get("index");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const projects = readProjects();
  const project = findProject(projects, projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (field === "gallery" && indexValue) {
    const index = Number(indexValue);
    const updatedGallery = [...(project.gallery ?? [])];
    if (index >= 0 && index < updatedGallery.length) {
      updatedGallery.splice(index, 1);
      const updatedProject = { ...project, gallery: updatedGallery };
      const next = projects.map((item) => (item.id === project.id ? updatedProject : item));
      writeProjects(next);
      return NextResponse.json({ projects: readProjects(), project: updatedProject });
    }
  }

  const next = projects.filter((item) => item.id !== projectId);
  writeProjects(next);
  return NextResponse.json({ projects: readProjects() });
}
