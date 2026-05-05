"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Magnetic } from "./magnetic";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialValue?: string;
  autoFocus?: boolean;
  onSubmit?: (q: string) => void;
  size?: "default" | "hero";
  className?: string;
}

export function SearchBar({
  initialValue = "",
  autoFocus = false,
  onSubmit,
  size = "default",
  className,
}: SearchBarProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const examples = React.useMemo(
    () => (t.raw("rotatingExamples") as string[]) ?? [],
    [t],
  );
  const [value, setValue] = React.useState(initialValue);
  const [exampleIndex, setExampleIndex] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const showRotation = !value && examples.length > 0;

  React.useEffect(() => {
    if (!showRotation) {
      return;
    }
    const target = examples[exampleIndex] ?? "";
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) {
        window.clearInterval(tick);
      }
    }, 70);
    const next = window.setTimeout(() => {
      setExampleIndex((idx) => (idx + 1) % examples.length);
    }, 3000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(next);
    };
  }, [exampleIndex, examples, showRotation]);

  React.useEffect(() => {
    if (!showRotation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset rotation typing when user starts typing
      setTyped("");
    }
  }, [showRotation]);

  const handle = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    if (onSubmit) {
      onSubmit(trimmed);
      return;
    }
    router.push({ pathname: "/search", query: { q: trimmed } });
  };

  const placeholder = value ? t("placeholder") : typed || t("placeholder");
  const heroSizing = size === "hero";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handle(value);
      }}
      className={cn(
        "relative w-full",
        heroSizing && "max-w-2xl",
        className,
      )}
      role="search"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        whileHover={{ scale: heroSizing ? 1.005 : 1 }}
        className={cn(
          "glass relative flex items-center gap-2 rounded-2xl shadow-md transition-all focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary",
          heroSizing ? "p-2" : "p-1.5",
        )}
      >
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
            heroSizing && "h-12 w-12",
          )}
          aria-hidden
        >
          <Search className="h-5 w-5" />
        </span>
        <Input
          type="search"
          inputMode="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={t("placeholder")}
          className={cn(
            "h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-transparent",
            heroSizing && "h-14 text-lg",
          )}
        />
        {heroSizing ? (
          <Magnetic radius={70} strength={0.22}>
            <button
              type="submit"
              aria-label={t("submit")}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-md transition-[background-color,box-shadow] hover:bg-primary/90 hover:shadow-lg active:scale-95",
                "h-12",
              )}
            >
              <span className="hidden sm:inline">{t("submit")}</span>
              <Search className="h-4 w-4 sm:hidden" />
            </button>
          </Magnetic>
        ) : (
          <button
            type="submit"
            aria-label={t("submit")}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-95",
              "h-10 px-3",
            )}
          >
            <span className="hidden sm:inline">{t("submit")}</span>
            <Search className="h-4 w-4 sm:hidden" />
          </button>
        )}
      </motion.div>
    </form>
  );
}
