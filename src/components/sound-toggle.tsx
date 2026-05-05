"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSoundFx } from "./sound-provider";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const t = useTranslations("sound");
  const { enabled, toggle, reduced, play } = useSoundFx();

  if (reduced) return null;

  return (
    <button
      type="button"
      onClick={() => {
        // Play first if turning on so the user hears feedback after the toggle
        const wasEnabled = enabled;
        toggle();
        if (!wasEnabled) {
          // Defer play until next tick (after enabled is true)
          setTimeout(() => play("click"), 30);
        }
      }}
      aria-label={t("toggle")}
      title={enabled ? t("on") : t("off")}
      aria-pressed={enabled}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.span
            key="on"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="flex"
          >
            <Volume2 className="h-4 w-4" aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            className="flex"
          >
            <VolumeX className="h-4 w-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
