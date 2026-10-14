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
  description:
    "Explore ACID's portfolio of cinematic motion graphics, video editing, 3D renders, design, and creative development.",
  applicationName: "ACID",
  authors: [{ name: "ACID" }],
  creator: "ACID",
  publisher: "ACID",
  keywords: [
    "ACID",
    "creative developer",
    "motion designer",
    "motion graphics",
    "video editing",
    "3D rendering",
    "digital portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ACID",
    title: "ACID — Creative Developer & Motion Designer",
    description:
      "Cinematic motion graphics, video editing, 3D renders, design, and interactive digital experiences by ACID.",
    locale: "en_US",
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
    description:
      "Cinematic motion graphics, video editing, 3D renders, design, and interactive digital experiences by ACID.",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${oswald.variable}`}>
      <body>
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
