"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SaveButton } from "./save-button";
import type { RebrickableSet } from "@/lib/rebrickable";
import { formatNumber } from "@/lib/utils";

interface SetCardProps {
  set: RebrickableSet;
  themeName?: string;
  index?: number;
  onRemove?: (setNum: string) => void;
}

export function SetCard({ set, themeName, index = 0 }: SetCardProps) {
  const locale = useLocale();
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index, 8) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        href={{ pathname: "/sets/[setNum]", params: { setNum: set.set_num } } as any}
        className="block h-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm transition-shadow group-hover:shadow-xl"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {set.set_img_url ? (
            <Image
              src={set.set_img_url}
              alt={set.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              loading={index < 4 ? "eager" : "lazy"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              {set.set_num}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute end-3 top-3" onClick={(e) => e.preventDefault()}>
            <SaveButton setNum={set.set_num} setName={set.name} size="sm" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 p-5">
          <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-primary">#{set.set_num}</span>
            <span>·</span>
            <span>{set.year}</span>
            {themeName && (
              <>
                <span>·</span>
                <span className="truncate">{themeName}</span>
              </>
            )}
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
            {set.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatNumber(set.num_parts, locale)} parts
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function SetCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="brick-shimmer aspect-square w-full" />
      <div className="space-y-2 p-5">
        <div className="brick-shimmer h-3 w-1/2 rounded" />
        <div className="brick-shimmer h-4 w-3/4 rounded" />
        <div className="brick-shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
