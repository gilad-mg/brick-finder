"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { SearchBar } from "./search-bar";
import { SetCard, SetCardSkeleton } from "./set-card";
import type { RebrickableSearchResponse } from "@/lib/rebrickable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 24;

async function fetchSearch(q: string, page: number): Promise<RebrickableSearchResponse> {
  const params = new URLSearchParams({ q, page: String(page), page_size: String(PAGE_SIZE) });
  const res = await fetch(`/api/search?${params}`);
  if (!res.ok) throw new Error("search failed");
  return (await res.json()) as RebrickableSearchResponse;
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

export function SearchResults() {
  const t = useTranslations("search");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const initialPage = Math.max(1, Number.parseInt(searchParams?.get("page") ?? "1", 10) || 1);
  const [query, setQuery] = React.useState(initialQuery);
  const [page, setPage] = React.useState(initialPage);
  const debouncedQuery = useDebouncedValue(query, 300);

  // Keep URL in sync when query changes
  React.useEffect(() => {
    const trimmed = debouncedQuery.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (page > 1) params.set("page", String(page));
    const url = params.toString() ? `?${params.toString()}` : "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(`${pathname}${url}` as any, { scroll: false });
  }, [debouncedQuery, page, pathname, router]);

  const enabled = debouncedQuery.trim().length > 0;
  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: ["search", debouncedQuery.trim(), page],
    queryFn: () => fetchSearch(debouncedQuery.trim(), page),
    enabled,
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <div className="flex flex-col gap-6">
        <SearchBar
          initialValue={query}
          onSubmit={(q) => {
            setQuery(q);
            setPage(1);
          }}
        />
        <SearchBarLive
          value={query}
          onChange={(v) => {
            setQuery(v);
            setPage(1);
          }}
        />
      </div>

      <div className="mt-8">
        {!enabled && (
          <EmptyPrompt />
        )}

        {enabled && isError && (
          <p className="rounded-2xl border border-accent/40 bg-accent/10 p-6 text-accent">
            {t("empty")}
          </p>
        )}

        {enabled && (isPending || (isFetching && !data)) && <ResultsSkeleton />}

        {enabled && data && (
          <>
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("resultsHeading", { query: debouncedQuery })}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("resultsCount", { count: data.count })}
              </p>
            </div>
            {data.results.length === 0 ? (
              <EmptyResults />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${debouncedQuery}-${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {data.results.map((set, i) => (
                    <SetCard key={set.set_num} set={set} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {data.results.length > 0 && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>{t("previous")}</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t("page", { page })} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || !data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <span>{t("next")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function SearchBarLive({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("search");
  return (
    <input
      type="search"
      inputMode="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("placeholder")}
      aria-label={t("placeholder")}
      className="sr-only"
      tabIndex={-1}
    />
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SetCardSkeleton key={i} />
      ))}
    </div>
  );
}

function EmptyPrompt() {
  const t = useTranslations("search");
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="text-sm text-muted-foreground">{t("placeholder")}</p>
    </div>
  );
}

function EmptyResults() {
  const t = useTranslations("search");
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="text-base font-semibold text-foreground">{t("empty")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("emptyHint")}</p>
    </div>
  );
}
