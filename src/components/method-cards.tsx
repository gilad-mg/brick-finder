"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ImageIcon, LayoutGrid, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function MethodCards({ onActivateText }: { onActivateText?: () => void }) {
  const t = useTranslations("methods");
  const items = [
    {
      key: "text",
      icon: <Search className="h-6 w-6" />,
      title: t("text.title"),
      desc: t("text.desc"),
      cta: t("text.cta"),
      live: true,
      onClick: onActivateText,
    },
    {
      key: "image",
      icon: <ImageIcon className="h-6 w-6" />,
      title: t("image.title"),
      desc: t("image.desc"),
      badge: t("image.badge"),
      live: false,
    },
    {
      key: "theme",
      icon: <LayoutGrid className="h-6 w-6" />,
      title: t("theme.title"),
      desc: t("theme.desc"),
      badge: t("theme.badge"),
      live: false,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{t("subheading")}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <div className="flex items-start justify-between">
              <motion.div
                whileHover={{ rotateY: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                style={{ transformStyle: "preserve-3d" }}
              >
                {m.icon}
              </motion.div>
              {m.badge && (
                <Badge variant="accent" className="bg-accent/10 text-accent">
                  <span className="relative flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    {m.badge}
                  </span>
                </Badge>
              )}
            </div>
            <h3 className="mt-5 text-xl font-semibold text-foreground">{m.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
            {m.live && (
              <button
                type="button"
                onClick={m.onClick}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {m.cta} →
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
