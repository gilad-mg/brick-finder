"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6">
      <motion.div
        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
        className="text-6xl"
        aria-hidden
      >
        🧱
      </motion.div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-base text-muted-foreground">{t("subtitle")}</p>
      <Button asChild size="lg">
        <Link href="/">{t("cta")}</Link>
      </Button>
    </div>
  );
}
