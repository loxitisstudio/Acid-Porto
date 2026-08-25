import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        "bg-elev": "#0A0A0C",
        ink: "#FFFFFF",
        "ink-2": "#8A8A8A",
        "ink-3": "#54545A",
        accent: "#00D9FF",
        "accent-dim": "rgba(0,217,255,0.12)",
        line: "rgba(255,255,255,0.06)",
        "line-2": "rgba(255,255,255,0.12)",
        glass: "rgba(255,255,255,0.03)",
        "glass-2": "rgba(255,255,255,0.05)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        brandbe: ["var(--font-display)", "sans-serif"], // Alias untuk teks ACID
      },
      fontSize: {
        hero: "clamp(90px, 17vw, 300px)",
        display: "clamp(38px, 5.4vw, 72px)",
        "display-lg": "clamp(34px, 4.6vw, 64px)",
      },
      letterSpacing: {
        widest2: "0.28em",
        widest3: "0.5em",
      },
      boxShadow: {
        glass: "0 30px 90px -24px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 120px -20px rgba(0,217,255,0.35)",
      },
      backdropBlur: {
        xs: "6px",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(.16,1,.3,1)",
        soft: "cubic-bezier(.22,1,.36,1)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.8s infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;