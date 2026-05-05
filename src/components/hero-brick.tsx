"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const HeroBrick3D = dynamic(() => import("./hero-brick-3d"), {
  ssr: false,
  loading: () => <BrickFallback animated />,
});

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function BrickFallback({ animated = false }: { animated?: boolean }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Image
        src="/logo-clean.png"
        alt=""
        width={320}
        height={320}
        priority
        className={`h-48 w-48 sm:h-64 sm:w-64 object-contain ${animated ? "animate-pulse" : ""}`}
      />
    </div>
  );
}

export function HeroBrick() {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const [isNarrow, setIsNarrow] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const useFallback = reduced;

  return (
    <div ref={containerRef} className="relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
      {useFallback || !inView ? (
        <BrickFallback />
      ) : (
        <HeroBrick3D interactive={!isNarrow} />
      )}
    </div>
  );
}
