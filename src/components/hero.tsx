"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SearchBar } from "./search-bar";
import { HeroBrick } from "./hero-brick";

export function Hero() {
  const t = useTranslations("brand");
  const tagline = t("tagline");
  const words = tagline.split(" ");

  return (
    <section className="relative isolate overflow-hidden">
      {/* Soft brand gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(var(--primary)/0.18),transparent_70%)]"
      />
      {/* Floating decorative bricks */}
      <FloatingBricks />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center gap-4"
        >
          <HeroBrick />
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority
            className="h-20 w-20 rounded-full object-cover shadow-lg shadow-primary/30 sm:h-24 sm:w-24"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-48 w-48 blur-3xl bg-primary/20 rounded-full"
          />
        </motion.div>

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.05, ease: "easeOut" }}
              className="inline-block whitespace-pre"
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          {t("name")} · {t("footer")}
        </p>

        <div className="flex w-full max-w-2xl flex-col gap-3">
          <SearchBar size="hero" autoFocus={false} />
          <ImageSearchCta />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground scroll-cue"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
          <span>scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

function ImageSearchCta() {
  const t = useTranslations("imageSearch");
  return (
    <Link
      href="/search/image"
      className="group inline-flex items-center justify-center gap-2 self-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <Camera className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
      <span>{t("title")}</span>
    </Link>
  );
}

function FloatingBricks() {
  // Static positions so SSR matches CSR.
  const studs = React.useMemo(
    () => [
      { left: 6, top: 20, size: 60, color: "var(--primary)", delay: 0 },
      { left: 84, top: 14, size: 80, color: "var(--accent)", delay: 1.2 },
      { left: 16, top: 72, size: 50, color: "var(--accent)", delay: 0.6 },
      { left: 78, top: 68, size: 70, color: "var(--primary)", delay: 1.8 },
      { left: 48, top: 8, size: 36, color: "var(--primary)", delay: 0.3 },
      { left: 92, top: 46, size: 40, color: "var(--primary)", delay: 1.5 },
      { left: 4, top: 50, size: 42, color: "var(--accent)", delay: 0.9 },
    ],
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {studs.map((s, i) => (
        <span
          key={i}
          className="float-decor absolute rounded-full blur-xl"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: `rgb(${s.color} / 0.18)`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
