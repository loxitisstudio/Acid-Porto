"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const About = dynamic(() => import("@/components/About"));
const Skills = dynamic(() => import("@/components/Skills"));
const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Services = dynamic(() => import("@/components/Services"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const Footer = dynamic(() => import("@/components/Footer"));

function LazySection({ children, minHeight }: { children: ReactNode; minHeight: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <div
        className={`transition-all duration-700 ease-luxury ${
          loaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        <Navbar />
        <main>
          <Hero />
          <LazySection minHeight="42rem"><About /></LazySection>
          <LazySection minHeight="32rem"><Skills /></LazySection>
          <LazySection minHeight="48rem"><Portfolio /></LazySection>
          <LazySection minHeight="42rem"><Services /></LazySection>
          <LazySection minHeight="36rem"><Pricing /></LazySection>
        </main>
        <LazySection minHeight="52rem"><Footer /></LazySection>
      </div>
    </>
  );
}