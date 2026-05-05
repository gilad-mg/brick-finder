"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface RetailerPanelProps {
  setNum: string; // e.g. "10497-1"
}

interface Retailer {
  key: string;
  label: string;
  subtitle: string;
  href: string;
  brandClass: string;
  iconBg: string;
  Logo: React.FC<{ className?: string }>;
}

const baseSetNum = (n: string): string => n.split("-")[0] ?? n;

export function RetailerPanel({ setNum }: RetailerPanelProps) {
  const t = useTranslations("retailers");
  const base = baseSetNum(setNum);
  const variantNum = setNum.includes("-") ? setNum : `${setNum}-1`;

  const retailers: Retailer[] = [
    {
      key: "lego",
      label: "LEGO.com",
      subtitle: t("lego"),
      href: `https://www.lego.com/en-us/search?q=${encodeURIComponent(base)}`,
      brandClass: "from-[#FFCF00] to-[#FFE066]",
      iconBg: "bg-[#FFCF00] text-[#0E1A2B]",
      Logo: LegoLogo,
    },
    {
      key: "bricklink",
      label: "BrickLink",
      subtitle: t("bricklink"),
      href: `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${encodeURIComponent(variantNum)}`,
      brandClass: "from-[#02538B] to-[#1E5FA8]",
      iconBg: "bg-[#02538B] text-white",
      Logo: BrickLinkLogo,
    },
    {
      key: "ebay",
      label: "eBay",
      subtitle: t("ebay"),
      href: `https://www.ebay.com/sch/i.html?_nkw=lego+${encodeURIComponent(base)}&_sacat=19006`,
      brandClass: "from-[#E53238] to-[#F5AF02]",
      iconBg: "bg-white text-foreground border border-border",
      Logo: EbayLogo,
    },
    {
      key: "amazon",
      label: "Amazon",
      subtitle: t("amazon"),
      href: `https://www.amazon.com/s?k=lego+${encodeURIComponent(base)}`,
      brandClass: "from-[#232F3E] to-[#37475A]",
      iconBg: "bg-[#232F3E] text-[#FF9900]",
      Logo: AmazonLogo,
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{t("heading")}</h2>
        <p className="hidden text-xs text-muted-foreground sm:block">{t("subheading")}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {retailers.map((r) => (
          <motion.a
            key={r.key}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.iconBg}`}
            >
              <r.Logo className="h-5 w-5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">
                {r.label}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{r.subtitle}</span>
            </span>
            <motion.span
              className="text-muted-foreground transition-colors group-hover:text-primary"
              whileHover={{ x: 2, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              aria-hidden
            >
              <ArrowUpRight className="h-4 w-4" />
            </motion.span>
          </motion.a>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}

// Generic neutral retailer marks — not the official trademarked logos.
function LegoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" />
      <circle cx="8" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="16" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function BrickLinkLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="9" width="18" height="9" rx="1" fill="currentColor" />
      <circle cx="7" cy="8" r="1.4" fill="currentColor" />
      <circle cx="12" cy="8" r="1.4" fill="currentColor" />
      <circle cx="17" cy="8" r="1.4" fill="currentColor" />
      <path d="M7 19v2M17 19v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function EbayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#E53238"
      >
        eb
      </text>
      <text
        x="12"
        y="16"
        dx="6"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#0064D2"
      >
        a
      </text>
      <text
        x="12"
        y="16"
        dx="11"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="9"
        fontWeight="800"
        fill="#F5AF02"
      >
        y
      </text>
    </svg>
  );
}

function AmazonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 14c2.5 1.6 6 2.4 9.5 2 2-.2 3.7-.8 5-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17.6 12.5c.9.7 1.5 1.7 1.7 2.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="12"
        y="9.5"
        textAnchor="middle"
        fontFamily="system-ui, sans-serif"
        fontSize="6.5"
        fontWeight="800"
        fill="currentColor"
      >
        amazon
      </text>
    </svg>
  );
}
