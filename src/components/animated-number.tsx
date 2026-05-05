"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring, useTransform, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { formatNumber } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 0.8, className }: AnimatedNumberProps) {
  const locale = useLocale();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 18, duration: duration * 1000 });
  const display = useTransform(spring, (latest) => formatNumber(Math.round(latest), locale));

  React.useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  return <motion.span ref={ref} className={className}>{display}</motion.span>;
}
