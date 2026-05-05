"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-cursor-pointer], summary, label[for]';
const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="file"]), textarea, [contenteditable="true"]';

export function CustomCursor() {
  const [enabled, setEnabled] = React.useState(false);
  const [hoveringInteractive, setHoveringInteractive] = React.useState(false);
  const [overText, setOverText] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const stiffness = reduced ? 1000 : 300;
  const damping = reduced ? 50 : 30;

  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const ringSpringX = useSpring(ringX, { stiffness, damping });
  const ringSpringY = useSpring(ringY, { stiffness, damping });

  const studX = useMotionValue(0);
  const studY = useMotionValue(0);

  React.useEffect(() => {
    const fineMq = window.matchMedia("(pointer: fine)");
    const wideMq = window.matchMedia("(min-width: 1024px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnabled(fineMq.matches && wideMq.matches);
      setReduced(reducedMq.matches);
    };
    update();
    fineMq.addEventListener("change", update);
    wideMq.addEventListener("change", update);
    reducedMq.addEventListener("change", update);
    return () => {
      fineMq.removeEventListener("change", update);
      wideMq.removeEventListener("change", update);
      reducedMq.removeEventListener("change", update);
    };
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      studX.set(e.clientX);
      studY.set(e.clientY);
      setVisible(true);

      const target = e.target as Element | null;
      if (!target) return;
      const interactive = Boolean(target.closest(INTERACTIVE_SELECTOR));
      const text = Boolean(target.closest(TEXT_INPUT_SELECTOR));
      setHoveringInteractive(interactive);
      setOverText(text);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, ringX, ringY, studX, studY]);

  if (!enabled || overText || !visible) return null;

  return (
    <>
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ x: ringSpringX, y: ringSpringY }}
          className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/80 mix-blend-difference transition-[width,height,opacity] duration-150 ease-out"
          data-state={hoveringInteractive ? "expanded" : "default"}
        >
          <span
            className={`block rounded-full ${hoveringInteractive ? "h-10 w-10" : "h-6 w-6"}`}
            style={{
              boxShadow: "inset 0 0 0 2px currentColor",
            }}
          />
        </motion.div>
      )}
      <motion.div
        aria-hidden
        style={{ x: studX, y: studY }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <span
          className={`block rounded-full bg-accent transition-opacity duration-150 ${
            hoveringInteractive ? "opacity-0" : "opacity-90"
          }`}
          style={{ width: 6, height: 6 }}
        />
      </motion.div>
    </>
  );
}
