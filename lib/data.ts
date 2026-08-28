// ─── SKILLS REMOVED ─────────────────────────────────────────
// The old Skill type and skills array have been removed.
// Tool information is now embedded in each Service entry below.

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  role: string;
  software: string;
  desc: string;
  gradient: string;
  thumbnail?: string;
  previewVideo?: string;
  videoUrl?: string;
  audioUrl?: string;
  gallery?: string[];
  concept?: string;
  process?: string;
  behindScenes?: string;
  result?: string;
};

export const projects: Project[] = [
  {
    id: "chasing-you",
    title: "The Art of Chasing You",
    category: "MOTION GRAPHICS",
    year: "2026",
    role: "Visual Artist",
    software: "After Effects",
    desc: "A cinematic visual journey exploring minimalist geometry, atmospheric depth, and motion rhythm.",
    gradient: "linear-gradient(160deg, #141414, #050505)",
    thumbnail: "/media/Screenshot 2025-07-17 185203.png",
    previewVideo: "/media/the art of chasing you_1.mp4",
    gallery: ["/media/Screenshot 2025-07-17 185203.png"],
    concept: "Framing movement with a minimal palette, the concept blends glassy shapes and atmospheric depth to create a cinematic visual rhythm.",
    process: "The project was built through rapid animation tests, layered particle systems, and a strict approach to light and timing.",
    behindScenes: "Multiple passes of glow, blur, and noise were combined to preserve motion energy while keeping the image clean and refined.",
    result: "A polished motion identity piece that feels premium, immersive, and poised for brand showcase use.",
  },
  {
    id: "Design-Portfolio",
    title: "UI Game",
    category: "DESIGN",
    year: "2025",
    role: "UI/UX & 3D Designer",
    software: "Blender, Photoshop",
    desc: "A stylized game interface concept combining tactical layout, immersion, and clean visual hierarchy.",
    gradient: "linear-gradient(160deg, #141414, #050505)",
    thumbnail: "/media/UI_Game.png",
    gallery: [
      "/media/UI_Game.png",
    ],
    concept: "The concept focuses on immersive gaming HUD and menu structures, using dark styling and sharp accents to elevate player interaction.",
    process: "Development included layout prototyping, UI asset texturing, and final polish in Photoshop.",
    behindScenes: "Balanced visual density with readability to ensure the interface feels functional yet atmospheric.",
    result: "A clean, production-ready game UI presentation that communicates high design fidelity.",
  },
  {
    id: "Modeling3D",
    title: "Modeling 3D",
    category: "3D RENDER",
    year: "2024",
    role: "3D Artist",
    software: "Blender, Octane",
    desc: "A study in depth and material — black glass and volumetric fog rendered to feel physically present rather than simulated.",
    gradient: "radial-gradient(circle at 40% 60%, #063a4a, #050b0d 70%)",
    thumbnail: "/media/Screenshot 2025-07-22 231939.png",
    gallery: [
      "/media/Screenshot 2025-07-17 185402.png",
    ],
    concept: "This piece explores reflective surfaces and layered volume, balancing heavy shadow with crisp highlights.",
    process: "A workflow of blockout, lighting refinement, and atmospheric compositing produced the finished mood.",
    behindScenes: "The scene relied on low-noise renders, artist-driven shading, and subtle post effects for a cinematic finish.",
    result: "A striking render showcase built to feel both tactile and otherworldly in equal measure.",
  },
  {
    id: "Roblox Map",
    title: "Universitas RAB",
    category: "ROBLOX DEVELOPMENT",
    year: "2025",
    role: "3D Designer & Developer",
    software: "Roblox Studio, Blender",
    desc: "A detailed campus map and architectural build created for immersive roleplay and community engagement in Roblox.",
    gradient: "linear-gradient(160deg, #1a1a1a, #050505)",
    thumbnail: "/media/Screenshot 2025-08-11 213320.png",
    gallery: [
      "/media/Screenshot 2025-08-10 234453.png",
    ],
    concept: "Designed to replicate a modern university environment with optimized geometry and structured zoning for gameplay flow.",
    process: "Modeled structural assets in Blender and assembled the map within Roblox Studio with optimized lighting and zoning.",
    behindScenes: "Focused on polygon optimization and asset streaming to ensure high performance without sacrificing visual quality.",
    result: "A fully realized, expansive virtual campus environment tailored for community roleplay.",
  },
  {
    id: "roblox-clip",
    title: "Roblox Clip",
    category: "ROBLOX DEVELOPMENT",
    year: "2026",
    role: "Creative Editor",
    software: "CapCut, After Effects, Blender, Roblox Studio",
    desc: "A cinematic Roblox clip edited for social sharing, blending gameplay footage with motion graphics and color polish.",
    gradient: "linear-gradient(160deg, #08112a, #040207)",
    previewVideo: "/media/Roblox clip.mp4",
    gallery: [
      "/media/Screenshot 2025-07-17 185402.png",
      "/media/Screenshot 2025-08-10 234428.png",
    ],
    concept: "To create a fast-paced Roblox trailer that feels premium while keeping the gameplay front and center.",
    process: "Footage was assembled in CapCut, then motion-enhanced in After Effects and composited with Blender assets for depth.",
    behindScenes: "The clip uses layered transitions, CG elements, and color grading to elevate Roblox gameplay into a branded short.",
    result: "A polished Roblox showcase video ready for reels, ads, and creator portfolio display.",
  },
  {
    id: "ae-video-1",
    title: "AE Edit 1",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A fast After Effects edit built for rhythmic motion and bold visual impact.",
    gradient: "linear-gradient(160deg, #111827, #0f172a)",
    thumbnail: "/media/gif 1.gif",
    previewVideo: "/media/1.mp4",
    gallery: ["/media/gif 1.gif"],
    concept: "Rhythmic editing with motion graphics accents to elevate visual flow.",
    process: "Produced in After Effects with aggressive timing and animated transitions.",
    behindScenes: "The workflow used frame-perfect edits, animated textures, and expressive pacing.",
    result: "A compact performance piece optimized for social and promos.",
  },
  {
    id: "ae-video-2",
    title: "AE Edit 2",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A dynamic edit that pairs motion type with cinematic push-in movement.",
    gradient: "linear-gradient(160deg, #0d1320, #111827)",
    thumbnail: "/media/gif 2.gif",
    previewVideo: "/media/2.mp4",
    gallery: ["/media/gif 2.gif"],
    concept: "Motion-rich storytelling through animated rhythm and refined color.",
    process: "Built in After Effects with layered motion and stylized transitions.",
    behindScenes: "Color, blur, and motion were tuned to keep the edit feeling premium.",
    result: "A polished edit suitable for reels, promos, and digital showcases.",
  },
  {
    id: "ae-video-3",
    title: "AE Edit 3",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A punchy motion edit designed to emphasize fast cuts and bold graphic energy.",
    gradient: "linear-gradient(160deg, #131924, #0b1220)",
    thumbnail: "/media/gif 3.gif",
    previewVideo: "/media/3.mp4",
    gallery: ["/media/gif 3.gif"],
    concept: "A high-energy edit that uses motion flavor to build visual momentum.",
    process: "Composed with After Effects, using animated masks and motion-driven pacing.",
    behindScenes: "The project leaned on animated assets and sharp rhythm to keep engagement high.",
    result: "A compelling After Effects edit that feels modern and intentional.",
  },
  {
    id: "ae-video-4",
    title: "AE Edit 4",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A sleek, dynamic cut built around visual transitions and motion clarity.",
    gradient: "linear-gradient(160deg, #0d1320, #141e2d)",
    thumbnail: "/media/gif 4.gif",
    previewVideo: "/media/4.mp4",
    gallery: ["/media/gif 4.gif"],
    concept: "Transitions and motion rhythm create a seamless viewing flow.",
    process: "Edited in After Effects with animated comp layers and refined timing.",
    behindScenes: "Each shot was polished to feel cohesive and fluid in the final cut.",
    result: "A sharp After Effects edit perfect for short-format storytelling.",
  },
  {
    id: "ae-video-5",
    title: "AE Edit 5",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A rhythmic edit that blends motion graphics with precise pacing.",
    gradient: "linear-gradient(160deg, #121827, #0f172a)",
    thumbnail: "/media/gif 5.gif",
    previewVideo: "/media/5.mp4",
    gallery: ["/media/gif 5.gif"],
    concept: "Deliberate rhythm and expressive motion create a premium feel.",
    process: "Created in After Effects with animated typography and subtle effects.",
    behindScenes: "The edit process emphasized timing, transitions, and visual texture.",
    result: "A polished motion edit built for attention-grabbing playback.",
  },
  {
    id: "ae-video-6",
    title: "AE Edit 6",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A motion edit focusing on tempo, timed effects, and cinematic polish.",
    gradient: "linear-gradient(160deg, #111827, #0b1220)",
    previewVideo: "/media/6.mp4",
    concept: "A rhythmic edit meant to feel fast, polished, and bold.",
    process: "Built in After Effects with layered timing and animated compositing.",
    behindScenes: "Visual effects and pacing were tuned to maximize motion impact.",
    result: "A standout edit that delivers refined motion storytelling.",
  },
  {
    id: "ae-video-7",
    title: "AE Edit 7",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A visually driven After Effects cut with bold motion accents.",
    gradient: "linear-gradient(160deg, #151d30, #0d1220)",
    thumbnail: "/media/gif 7.gif",
    previewVideo: "/media/7.mp4",
    gallery: ["/media/gif 7.gif"],
    concept: "A motion-first edit with polished energy and graphic rhythm.",
    process: "Produced in After Effects with animated elements and timed transitions.",
    behindScenes: "The visual language was tuned to feel modern and responsive.",
    result: "A compelling short edit built for digital impact.",
  },
  {
    id: "ae-video-8",
    title: "AE Edit 8",
    category: "VIDEO EDITING",
    year: "2025",
    role: "Video Editor",
    software: "After Effects",
    desc: "A concise motion edit with polished speed and visual clarity.",
    gradient: "linear-gradient(160deg, #0f1524, #111827)",
    thumbnail: "/media/gif 8.gif",
    previewVideo: "/media/8.mp4",
    gallery: ["/media/gif 8.gif"],
    concept: "Smooth motion and crisp transitions drive the edit forward.",
    process: "Built in After Effects with expressive timing and layered animation.",
    behindScenes: "The edit was refined to keep energy high across every cut.",
    result: "A sharp video edit ready for reels and digital promotion.",
  },
  {
    id: "cinta",
    title: "Cinta",
    category: "MOTION GRAPHICS",
    year: "2026",
    role: "Motion Designer",
    software: "After Effects",
    desc: "A typography-driven motion short built around poetic timing and expressive visual rhythm.",
    gradient: "linear-gradient(160deg, #1b0712, #050205)",
    previewVideo: "/media/Cinta.mp4",
    gallery: [
      "/media/Screenshot 2025-08-10 234453.png",
    ],
    concept: "To let text become the hero, using motion type to create emotional pacing and visual poetry.",
    process: "Created entirely in After Effects with animated masks, kinetic typography, and carefully timed transitions.",
    behindScenes: "The design relied on custom text rigs, layered vignette effects, and subtle motion blur for a cinematic feel.",
    result: "A polished motion typography piece made to feel intimate, elegant, and memorable.",
  },
  {
    id: "ui-game",
    title: "UI Game Concept",
    category: "DESIGN",
    year: "2026",
    role: "UI & 3D Designer",
    software: "Blender, Photoshop",
    desc: "An immersive game interface visualization blending futuristic iconography and polished layout depth.",
    gradient: "linear-gradient(160deg, #101820, #07090d)",
    thumbnail: "/media/UI_Game.png",
    gallery: [
      "/media/UI_Game.png",
    ],
    concept: "Crafting a clean visual language for gameplay navigation with high-contrast elements.",
    process: "Modeled in Blender and brought to life with color grading and interface typography in Photoshop.",
    behindScenes: "Focused on usability, scaling, and aesthetic continuity across interactive elements.",
    result: "A compelling interface concept suited for modern interactive gaming environments.",
  },
];

// ─── SERVICES (unified — capability + tools) ─────────────────

export type Service = {
  num: string;
  name: string;
  desc: string;
  tools: string[];
};

export const services = [
  {
    num: "01",
    name: "Motion Graphics",
    desc: "Dynamic animations and visual effects built to move a story forward, frame by frame.",
    tools: ["After Effects", "Figma", "Illustator"],
  },
  {
    num: "02",
    name: "Video Editing",
    desc: "Professional cuts and colour that bring pacing, rhythm, and clarity to raw footage.",
    tools: ["After Effects", "CapCut", "Premiere Pro", "Blender"],
  },
  {
    num: "03",
    name: "UI / UX Design",
    desc: "Clean, human-first interfaces that convert attention into action.",
    tools: ["Figma", "Illustrator"],
  },
  {
    num: "04",
    name: "Roblox Development",
    desc: "Games and experiences built for scale, with systems players actually enjoy.",
    tools: ["Roblox Studio", "Blender", "VS Code"],
  },
  {
    num: "05",
    name: "Web Development",
    desc: "Modern, fast, and responsive web applications crafted with high performance code.",
    tools: ["VS Code", "Figma"],
  },
];

export type PricingTier = {
  tier: string;
  fixed: string;
  hourly: string;
  features: string[];
  featured?: boolean;
  cta: string;
};

export const pricing: PricingTier[] = [
  {
    tier: "Basic",
    fixed: "Let's Talk",
    hourly: "",
    features: ["Up to 1 minute", "1 revision", "Standard quality", "3–5 day delivery"],
    cta: "Contact Me",
  },
  {
    tier: "Standard",
    fixed: "Let's Talk",
    hourly: "",
    features: ["Up to 3 minutes", "2 revisions", "High quality", "5–7 day delivery"],
    featured: true,
    cta: "Contact Me",
  },
  {
    tier: "Premium",
    fixed: "Let's Talk",
    hourly: "",
    features: ["Custom duration", "Unlimited revisions", "Premium quality", "Priority development"],
    cta: "Contact Me",
  },
];

export type TimelineItem = {
  year: string;
  role: string;
};

export const timeline: TimelineItem[] = [
  { year: "2024", role: "Freelance, full time — building brand experiences for studios and founders worldwide." },
  { year: "2022", role: "Creative Developer — motion-driven web builds for design-led agencies." },
  { year: "2021", role: "Motion Designer — broadcast and social campaigns across three continents." },
  { year: "2020", role: "Visual Designer — first studio role, first award shortlist." },
];

export type StatItem = {
  value: number;
  label: string;
};

export const stats: StatItem[] = [
  { value: 5, label: "Years Experience" },
  { value: 50, label: "Projects Completed" },
  { value: 30, label: "Happy Clients" },
];

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];