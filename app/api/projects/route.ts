import { NextResponse } from "next/server";

export async function GET() {
  // Return dummy data/mock data agar build tidak gagal
  const mockProjects = [
    {
      id: "1",
      title: "Project Alpha",
      category: "Web App",
      image: "/hero/cube.webp",
      description: "Sample project description",
    },
  ];

  return NextResponse.json(mockProjects);
}