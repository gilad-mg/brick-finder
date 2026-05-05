"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

export function LanguageToggle({ className }: { className?: string }) {
  return (
    <React.Suspense fallback={<LanguageTogglePlaceholder className={className} />}>
      <LanguageToggleInner className={className} />
    </React.Suspense>
  );
}

function LanguageTogglePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-1",
        className,
      )}
      aria-hidden
    >
      <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        ע
      </span>
      <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        EN
      </span>
    </div>
  );
}

function LanguageToggleInner({ className }: { className?: string }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const switchTo = (next: (typeof routing.locales)[number]) => {
    if (next === locale) return;
    if (!pathname) return;
    const segments = pathname.split("/");
    if (segments.length > 1 && routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const newPath = segments.join("/") || `/${next}`;
    const queryString = searchParams?.toString();
    const target = queryString ? `${newPath}?${queryString}` : newPath;
    router.replace(target);
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-border bg-card p-1 text-xs font-semibold uppercase tracking-wider",
        className,
      )}
      role="group"
      aria-label={t("toggle")}
    >
      {(["he", "en"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 px-3 py-1.5 transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {code === "he" ? "ע" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
