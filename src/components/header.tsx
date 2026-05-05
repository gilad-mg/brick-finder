"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tBrand = useTranslations("brand");
  const { scrollY } = useScroll();
  const blurAmount = useTransform(scrollY, [0, 80], [8, 18]);
  const bg = useTransform(scrollY, [0, 80], ["rgb(var(--card) / 0.5)", "rgb(var(--card) / 0.85)"]);
  const border = useTransform(scrollY, [0, 80], ["rgb(var(--border) / 0)", "rgb(var(--border) / 0.7)"]);

  return (
    <motion.header
      style={{
        backdropFilter: useTransform(blurAmount, (b) => `blur(${b}px) saturate(140%)`),
        backgroundColor: bg,
        borderBottomColor: border,
      }}
      className="sticky top-0 z-40 w-full border-b transition-shadow"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-md focus:bg-primary focus:px-3 focus:py-1 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          aria-label={tBrand("name")}
        >
          <motion.span
            whileHover={{ rotate: -8, scale: 1.05 }}
            whileTap={{ rotate: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="relative flex h-9 w-9 items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              className="h-9 w-9 rounded-full object-cover shadow-sm"
              priority
            />
          </motion.span>
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            {tBrand("name")}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label={t("home")}>
          <NavLink href="/search" icon={<Search className="h-4 w-4" />}>
            {t("search")}
          </NavLink>
          <NavLink href="/my-bricks" icon={<Heart className="h-4 w-4" />}>
            {t("myBricks")}
          </NavLink>
          <span className="mx-1 hidden h-6 w-px bg-border sm:inline-block" aria-hidden />
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: "/search" | "/my-bricks";
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}
