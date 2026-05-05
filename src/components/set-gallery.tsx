"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SetGalleryProps {
  images: { url: string; alt: string }[];
}

export function SetGallery({ images }: SetGalleryProps) {
  const t = useTranslations("set");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  const onKey = React.useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen || images.length === 0) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    },
    [images.length, lightboxOpen],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-3xl border border-border bg-muted" />
    );
  }

  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl"
        aria-label={t("imageGallery", { index: activeIndex + 1, total: images.length })}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.url}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            <Image
              src={active.url}
              alt={active.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </motion.div>
        </AnimatePresence>
      </button>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={t("imageGallery", { index: i + 1, total: images.length })}
              aria-pressed={i === activeIndex}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-card transition-all",
                i === activeIndex
                  ? "border-primary shadow-md"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Image src={img.url} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-card p-2 text-foreground shadow"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-card p-2 shadow"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-card p-2 shadow"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            <motion.div
              key={active.url}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative h-[80vh] w-[90vw] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.url} alt={active.alt} fill className="object-contain" sizes="90vw" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
