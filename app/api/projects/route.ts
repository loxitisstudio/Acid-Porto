import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasAdminSession } from "@/lib/adminAuth";

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
  const { data, error } = await getSupabase().from("projects").select("*").order("id", { ascending: false });
  if (error) throw error;
  return data ?? [];
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
    const { error } = await getSupabase().from("projects").insert(project);
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
    const { id, ...updates } = project;
    const { error } = await getSupabase().from("projects").update(updates).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update project." }, { status: 500 });
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