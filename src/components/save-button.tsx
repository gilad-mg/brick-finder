"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { isSaved, toggleSaved, SAVED_CHANGED_EVENT } from "@/lib/saved";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  setNum: string;
  setName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SaveButton({ setNum, setName, size = "md", className }: SaveButtonProps) {
  const t = useTranslations("set");
  const [saved, setSaved] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydration: read localStorage on mount */
  React.useEffect(() => {
    setMounted(true);
    setSaved(isSaved(setNum));
    const handler = () => setSaved(isSaved(setNum));
    window.addEventListener(SAVED_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SAVED_CHANGED_EVENT, handler);
  }, [setNum]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleSaved(setNum);
    setSaved(result.saved);
    if (result.saved) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const origin = {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        };
        void confetti({
          particleCount: 60,
          spread: 65,
          startVelocity: 38,
          origin,
          colors: ["#1E5FA8", "#3B82F6", "#D6232A", "#EF4444", "#FBBF24"],
          scalar: 0.85,
          ticks: 140,
        });
        if (result.list.length === 10) {
          window.setTimeout(() => {
            void confetti({
              particleCount: 180,
              spread: 100,
              origin: { y: 0.6 },
              colors: ["#1E5FA8", "#D6232A", "#FBBF24", "#22C55E"],
            });
          }, 220);
        }
      }
      toast.success(t("savedToast", { name: setName }));
    } else {
      toast(t("removedToast", { name: setName }));
    }
  };

  const dimensions: Record<NonNullable<SaveButtonProps["size"]>, string> = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-12 px-5",
  };
  const iconSize: Record<NonNullable<SaveButtonProps["size"]>, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-5 w-5",
  };
  const isLg = size === "lg";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? t("unsave") : t("save")}
      title={saved ? t("unsave") : t("save")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-accent/50 hover:shadow-md active:scale-95",
        dimensions[size],
        saved && "border-accent/60 bg-accent/10",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={saved ? "filled" : "outline"}
          initial={mounted ? { scale: 0.6, rotate: -10 } : false}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.6 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          className="flex"
        >
          <Heart
            className={cn(iconSize[size], saved ? "fill-accent text-accent" : "text-muted-foreground")}
            aria-hidden
          />
        </motion.span>
      </AnimatePresence>
      {isLg && (
        <span className="text-sm font-semibold">{saved ? t("saved") : t("save")}</span>
      )}
    </button>
  );
}
