# ACID — Personal Branding Portfolio

Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP + Lenis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Dashboard media workflow

The dashboard is available at `/dashboard` after logging in at `/login`. Media uploads go directly from the browser to Cloudinary, then the returned secure URL is stored in Supabase. This avoids sending large video files through a Vercel serverless function.

Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Add the same variables to the Vercel project settings before deploying. Keep `CLOUDINARY_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and admin credentials server-only.

## Architecture

```
app/
  layout.tsx        — fonts (next/font), Cursor + Lenis providers
  page.tsx           — composes sections, gates on Loader
  globals.css        — Tailwind layers + the only non-utility rules (selection, cursor:none)
components/
  SmoothScroll.tsx    — Lenis + GSAP ticker sync
  Cursor.tsx          — dot + spring-trailing ring
  MagneticButton.tsx  — reusable magnetic wrapper (Framer Motion springs)
  Reveal.tsx          — reusable scroll-reveal wrapper (Framer Motion whileInView)
  Loader.tsx
  Navbar.tsx
  Hero.tsx / OrbitCanvas.tsx
  About.tsx
  Skills.tsx
  Portfolio.tsx / ProjectModal.tsx
  Services.tsx
  Pricing.tsx
  Contact.tsx
  Footer.tsx / ConstellationCanvas.tsx
lib/
  data.ts             — all copy/content as typed arrays (skills, projects, services, pricing…)
```

Every section is its own component; all content lives in `lib/data.ts` so copy changes never touch layout code. No inline `style` attributes are used for static design — only Tailwind utility classes (arbitrary values via `[...]` where the design calls for a non-standard number). The few `style={{...}}` you'll find are all dynamic values driven by JS (Framer Motion springs, canvas gradients, live progress widths) — not CSS authored inline.

## Design tokens (tailwind.config.ts)

- `bg` #050505 · `accent` #00D9FF · `ink-2` #8A8A8A · `line` rgba(255,255,255,.06)
- `font-display` = Space Grotesk (headlines), `font-body` = Inter (everything else)
- `hero` / `display` / `display-lg` font sizes are fluid via `clamp()`
=======
# Acid-Porto

