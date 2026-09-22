"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const About = dynamic(() => import("@/components/About"), {
  loading: () => <SectionFallback minHeight="42rem" />,
});
const Skills = dynamic(() => import("@/components/Skills"), {
  loading: () => <SectionFallback minHeight="32rem" />,
});
const Portfolio = dynamic(() => import("@/components/Portfolio"), {
  loading: () => <SectionFallback minHeight="48rem" />,
});
const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <SectionFallback minHeight="42rem" />,
});
const Pricing = dynamic(() => import("@/components/Pricing"), {
  loading: () => <SectionFallback minHeight="36rem" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <SectionFallback minHeight="52rem" />,
});

function SectionFallback({ minHeight }: { minHeight: string }) {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse bg-bg/40"
      style={{ minHeight }}
    />
  );
}

function LazySection({
  children,
  minHeight,
}: {
  children: React.ReactNode;
  minHeight: string;
}) {
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
    <div ref={sectionRef} style={{ minHeight: shouldRender ? undefined : minHeight }}>
      {shouldRender ? children : <SectionFallback minHeight={minHeight} />}
    </div>
  );
}

export default function BelowFold() {
  return (
    <>
      <LazySection minHeight="42rem"><About /></LazySection>
      <LazySection minHeight="32rem"><Skills /></LazySection>
      <LazySection minHeight="48rem"><Portfolio /></LazySection>
      <LazySection minHeight="42rem"><Services /></LazySection>
      <LazySection minHeight="36rem"><Pricing /></LazySection>
      <LazySection minHeight="52rem"><Footer /></LazySection>
    </>
  );
}