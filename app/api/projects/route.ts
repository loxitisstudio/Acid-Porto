import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasAdminSession } from "@/lib/adminAuth";
import { isValidExternalUrl } from "@/lib/projectUtils";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase belum dikonfigurasi.");
  return createClient(url, key);
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

async function getAllProjects() {
  const { data, error } = await getSupabase().from("projects").select("*");
  if (error) throw error;

  const projects = (data ?? []).map((project) => ({
    ...project,
    externalUrl: project.external_url ?? project.externalUrl ?? "",
    sortOrder: typeof project.sort_order === "number" ? project.sort_order : project.sortOrder ?? undefined,
  }));

  return projects.sort((a, b) => {
    const aSort = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
    const bSort = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;
    if (aSort !== bSort) return aSort - bSort;
    const aId = String(a.id ?? "");
    const bId = String(b.id ?? "");
    return aId < bId ? 1 : aId > bId ? -1 : 0;
  });
}

export async function GET() {
  try {
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return unauthorized();
  try {
    const project = await request.json();
    const payload = { ...project };
    if (typeof payload.externalUrl === "string") {
      payload.external_url = payload.externalUrl;
    }
    if (typeof payload.sortOrder === "number") {
      payload.sort_order = payload.sortOrder;
    } else {
      const projects = await getAllProjects();
      payload.sort_order = projects.reduce(
        (max, item) => (typeof item.sortOrder === "number" ? Math.max(max, item.sortOrder) : max),
        -1
      ) + 1;
    }
    delete payload.externalUrl;
    delete payload.sortOrder;
    const { error } = await getSupabase().from("projects").insert(payload);
    if (error) throw error;
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create project." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return unauthorized();
  try {
    const { project } = await request.json();
    if (!project?.id) return NextResponse.json({ error: "Project ID wajib diisi." }, { status: 400 });
    const { id, externalUrl, sortOrder, ...updates } = project;
    const nextUpdates = { ...updates } as Record<string, unknown>;
    if (typeof externalUrl === "string") {
      nextUpdates.external_url = externalUrl;
    }
    if (typeof sortOrder === "number") {
      nextUpdates.sort_order = sortOrder;
    }
    const { error } = await getSupabase().from("projects").update(nextUpdates).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update project." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return unauthorized();
  try {
    const body = await request.json();

    if (body?.action === "updateExternalUrl") {
      const { projectId, externalUrl } = body;
      if (typeof projectId !== "string" || !projectId || typeof externalUrl !== "string") {
        return NextResponse.json({ error: "Project ID and URL are required." }, { status: 400 });
      }
      if (externalUrl && !isValidExternalUrl(externalUrl)) {
        return NextResponse.json({ error: "Enter a valid HTTPS project URL." }, { status: 400 });
      }

      const { data, error } = await getSupabase()
        .from("projects")
        .update({ external_url: externalUrl })
        .eq("id", projectId)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return NextResponse.json({ error: "Project not found." }, { status: 404 });

      return NextResponse.json({ projects: await getAllProjects() });
    }

    if (body?.action === "reorder") {
      const orders = body.orders;
      if (
        !Array.isArray(orders) ||
        orders.some(
          (item: { id?: unknown; sortOrder?: unknown }) =>
            typeof item?.id !== "string" ||
            !item.id ||
            typeof item.sortOrder !== "number" ||
            !Number.isInteger(item.sortOrder) ||
            item.sortOrder < 0
        )
      ) {
        return NextResponse.json({ error: "A valid project order list is required." }, { status: 400 });
      }

      const ids = orders.map((item: { id: string }) => item.id);
      if (new Set(ids).size !== ids.length) {
        return NextResponse.json({ error: "Project order contains duplicate IDs." }, { status: 400 });
      }

      const supabase = getSupabase();
      const sortOrders = (orders as Array<{ sortOrder: number }>).map((item) => item.sortOrder);
      if (
        new Set(sortOrders).size !== sortOrders.length ||
        sortOrders.some((sortOrder) => sortOrder >= orders.length)
      ) {
        return NextResponse.json({ error: "Project positions must be unique and consecutive." }, { status: 400 });
      }

      const { data: existingProjects, error: listError } = await supabase.from("projects").select("id");
      if (listError) throw listError;
      const submittedIds = new Set(ids);
      if (
        existingProjects.length !== ids.length ||
        existingProjects.some((item) => !submittedIds.has(item.id))
      ) {
        return NextResponse.json({ error: "Project order must include every existing project exactly once." }, { status: 400 });
      }

      for (const item of orders as Array<{ id: string; sortOrder: number }>) {
        const { data, error } = await supabase
          .from("projects")
          .update({ sort_order: item.sortOrder })
          .eq("id", item.id)
          .select("id")
          .maybeSingle();
        if (error) throw error;
        if (!data) return NextResponse.json({ error: `Project not found: ${item.id}` }, { status: 404 });
      }

      return NextResponse.json({ projects: await getAllProjects() });
    }

    return NextResponse.json({ error: "Unsupported project update action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update project metadata." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) return unauthorized();
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const field = searchParams.get("field");
    const index = Number(searchParams.get("index"));
    if (!projectId) return NextResponse.json({ error: "Project ID wajib diisi." }, { status: 400 });

    if (field === "gallery" && Number.isInteger(index) && index >= 0) {
      const { data: project, error: fetchError } = await getSupabase().from("projects").select("gallery").eq("id", projectId).single();
      if (fetchError) throw fetchError;
      const gallery = Array.isArray(project.gallery) ? project.gallery.filter((_: string, itemIndex: number) => itemIndex !== index) : [];
      const { error } = await getSupabase().from("projects").update({ gallery }).eq("id", projectId);
      if (error) throw error;
    } else {
      const { error } = await getSupabase().from("projects").delete().eq("id", projectId);
      if (error) throw error;
    }
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete project." }, { status: 500 });
  }
}