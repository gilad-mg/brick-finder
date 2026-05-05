import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink, FileText } from "lucide-react";
import { getSet, getSetAlternates, getTheme } from "@/lib/rebrickable";
import { SetGallery } from "@/components/set-gallery";
import { SaveButton } from "@/components/save-button";
import { AnimatedNumber } from "@/components/animated-number";
import { Button } from "@/components/ui/button";

interface SetPageProps {
  params: Promise<{ locale: string; setNum: string }>;
}

function normalizeSetNum(input: string): string {
  return input.includes("-") ? input : `${input}-1`;
}

export async function generateMetadata({ params }: SetPageProps): Promise<Metadata> {
  const { setNum: raw, locale } = await params;
  const setNum = normalizeSetNum(decodeURIComponent(raw));
  const set = await getSet(setNum);
  if (!set) {
    const t = await getTranslations({ locale, namespace: "set" });
    return { title: t("notFound") };
  }
  return {
    title: `${set.name} (${set.set_num})`,
    description: `${set.name} · ${set.year} · ${set.num_parts} parts`,
    openGraph: {
      title: `${set.name} (${set.set_num})`,
      images: set.set_img_url ? [{ url: set.set_img_url, width: 1200, height: 1200 }] : [],
    },
  };
}

export default async function SetPage({ params }: SetPageProps) {
  const { setNum: raw, locale } = await params;
  setRequestLocale(locale);
  const setNum = normalizeSetNum(decodeURIComponent(raw));

  const set = await getSet(setNum);
  if (!set) notFound();

  const [alternates, theme] = await Promise.all([
    getSetAlternates(setNum),
    getTheme(set.theme_id),
  ]);

  const t = await getTranslations({ locale, namespace: "set" });

  const images = [
    ...(set.set_img_url ? [{ url: set.set_img_url, alt: set.name }] : []),
    ...alternates
      .filter((a) => Boolean(a.set_img_url))
      .map((a) => ({ url: a.set_img_url!, alt: `${set.name} alternate` })),
  ];

  const baseSetNum = set.set_num.split("-")[0] ?? set.set_num;
  const instructionsUrl = `https://www.lego.com/en-us/service/buildinginstructions/search/?q=${encodeURIComponent(baseSetNum)}`;
  const rebrickableUrl = `https://rebrickable.com/sets/${encodeURIComponent(set.set_num)}/`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <SetGallery images={images} />

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-mono font-semibold text-primary">#{set.set_num}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {set.name}
            </h1>
            {theme && (
              <p className="mt-2 text-sm text-muted-foreground">
                {t("theme")}: <span className="text-foreground">{theme.name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-5 sm:grid-cols-3">
            <Stat label={t("parts")}>
              <AnimatedNumber value={set.num_parts} />
            </Stat>
            <Stat label={t("year")}>
              <AnimatedNumber value={set.year} />
            </Stat>
            <Stat label="ID">
              <span className="font-mono">{set.set_num}</span>
            </Stat>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SaveButton setNum={set.set_num} setName={set.name} size="lg" />
            <Button asChild variant="primary" size="lg">
              <a href={instructionsUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
                {t("buildInstructions")}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={rebrickableUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {t("viewOnRebrickable")}
              </a>
            </Button>
          </div>

          <div className="mt-4 rounded-3xl border border-dashed border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">{t("priceComparison")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("priceComparisonSoon")}</p>
          </div>

          <Link
            href={`/${locale}/search`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-foreground">{children}</span>
    </div>
  );
}
