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
    default: "ACID — Creative Developer & Motion Designer",
    template: "%s | ACID",
  },
  description: "Motion Designer & Creative Developer. Crafting cinematic visuals and interactive experiences.",
  applicationName: "ACID",
  authors: [{ name: "ACID" }],
  creator: "ACID",
  publisher: "ACID",
  keywords: [
    "ACID",
    "motion designer",
    "creative developer",
    "cinematic visuals",
    "interactive experiences",
    "motion graphics portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ACID",
    title: "ACID — Creative Developer & Motion Designer",
    description: "Crafting cinematic visuals and interactive experiences.",
    locale: "id_ID",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ACID — Creative Developer & Motion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACID — Creative Developer & Motion Designer",
    description: "Crafting cinematic visuals and interactive experiences.",
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
