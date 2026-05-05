"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SetCardSkeleton } from "./set-card";
import { SetCard } from "./set-card";
import { getSaved, removeSaved, SAVED_CHANGED_EVENT } from "@/lib/saved";
import type { RebrickableSet } from "@/lib/rebrickable";
import { AnimatedNumber } from "./animated-number";

async function fetchSets(ids: string[]): Promise<RebrickableSet[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({ ids: ids.join(",") });
  const res = await fetch(`/api/sets?${params}`);
  if (!res.ok) throw new Error("failed");
  const data = (await res.json()) as { results: RebrickableSet[] };
  return data.results;
}

export function MyBricksList() {
  const t = useTranslations("myBricks");
  const tSet = useTranslations("set");
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydration: read localStorage on mount */
  React.useEffect(() => {
    setSavedIds(getSaved());
    setHydrated(true);
    const handler = () => setSavedIds(getSaved());
    window.addEventListener(SAVED_CHANGED_EVENT, handler);
    return () => window.removeEventListener(SAVED_CHANGED_EVENT, handler);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-bricks", savedIds.join(",")],
    queryFn: () => fetchSets(savedIds),
    enabled: hydrated,
  });

  const ordered = React.useMemo(() => {
    if (!data) return [] as RebrickableSet[];
    const map = new Map(data.map((s) => [s.set_num, s] as const));
    return savedIds.map((id) => map.get(id)).filter((s): s is RebrickableSet => Boolean(s));
  }, [data, savedIds]);

  const handleRemove = (set: RebrickableSet) => {
    removeSaved(set.set_num);
    toast(tSet("removedToast", { name: set.name }));
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("heading")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("subheading", { count: savedIds.length })}
          </p>
        </div>
        {savedIds.length > 0 && (
          <div className="rounded-2xl border border-border bg-card px-4 py-2 text-3xl font-bold tabular-nums text-primary">
            <AnimatedNumber value={savedIds.length} />
          </div>
        )}
      </div>

      {!hydrated || isPending ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: Math.max(savedIds.length, 4) }).map((_, i) => (
            <SetCardSkeleton key={i} />
          ))}
        </div>
      ) : savedIds.length === 0 ? (
        <EmptyState />
      ) : isError ? (
        <p className="rounded-2xl border border-accent/40 bg-accent/10 p-6 text-accent">
          {t("loadError")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence>
            {ordered.map((set, i) => (
              <motion.div
                key={set.set_num}
                layout
                initial={{ opacity: 0, y: -30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                  type: "spring",
                  stiffness: 220,
                  damping: 22,
                }}
                className="relative"
              >
                <SetCard set={set} index={i} />
                <button
                  type="button"
                  onClick={() => handleRemove(set)}
                  className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-accent shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
                  aria-label={`${t("remove")} ${set.name}`}
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  {t("remove")}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  const t = useTranslations("myBricks");
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Heart className="h-9 w-9" />
      </motion.div>
      <p className="text-lg font-semibold text-foreground">{t("empty")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("emptyHint")}</p>
      <Button asChild size="lg" className="mt-6">
        <Link href="/search">{t("emptyCta")}</Link>
      </Button>
    </div>
  );
}
