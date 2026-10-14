import type { Metadata } from "next";
import { Space_Grotesk, Inter, Oswald } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import { Syne, JetBrains_Mono } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-mono",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://loxitis-studio.vercel.app"),
  title: {
    default: "௹ Tυαɳ Mυԃα Eʅ — Creator, Developer & System Architect",
    template: "%s | Tuan Muda El",
  },
  description:
    "Selamat datang di portfolio Tuan Muda El. Creator, Developer & System Architect yang mengubah kompleksitas abstrak menjadi sistem terukur. Eksplorasi project, artikel, dan pengalaman profesional.",
  applicationName: "Tuan Muda El",
  authors: [{ name: "Tuan Muda El" }],
  creator: "Tuan Muda El",
  publisher: "Tuan Muda El",
  keywords: [
    "Tuan Muda El",
    "portfolio developer",
    "system architect indonesia",
    "software engineer portfolio",
    "web developer jakarta",
    "creative developer",
    "fullstack developer indonesia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tuan Muda El",
    title: "௹ Tυαɳ Mυԃα Eʅ — Portfolio & Creative Works",
    description:
      "Eksplorasi karya kreatif, proyek teknologi, dan pemikiran mendalam tentang system architecture dan software engineering.",
    locale: "id_ID",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Tuan Muda El - Home Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "௹ Tυαɳ Mυԃα Eʅ — Portfolio",
    description: "Creator, Developer & System Architect. Explore my works →",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${oswald.variable}`}>
      <body>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
