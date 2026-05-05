"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const KONAMI: readonly string[] = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const t = useTranslations("easterEgg");

  React.useEffect(() => {
    let buffer: string[] = [];
    const onKey = async (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = [...buffer, key].slice(-KONAMI.length);
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        buffer = [];
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          const { default: confetti } = await import("canvas-confetti");
          const colors = ["#1E5FA8", "#3B82F6", "#D6232A", "#EF4444", "#FBBF24", "#22C55E"];
          const end = Date.now() + 3000;
          const burst = () => {
            confetti({
              particleCount: 6,
              startVelocity: 35,
              spread: 360,
              ticks: 80,
              origin: { x: Math.random(), y: Math.random() * 0.4 },
              colors,
              scalar: 0.9,
            });
            if (Date.now() < end) {
              window.requestAnimationFrame(burst);
            }
          };
          burst();
        }
        toast.success(t("konami"), { duration: 3500 });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t]);

  return null;
}
