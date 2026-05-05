import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/hero";
import { MethodCards } from "@/components/method-cards";
import { SetCard, SetCardSkeleton } from "@/components/set-card";
import { FEATURED_SET_IDS } from "@/lib/featured";
import { getSetsByIds } from "@/lib/rebrickable";

interface LandingProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LandingProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brand" });
  return {
    title: t("name"),
    description: t("tagline"),
    openGraph: {
      title: t("name"),
      description: t("tagline"),
      images: [{ url: "/logo.png", width: 1200, height: 1200, alt: t("name") }],
    },
  };
}

export default async function LandingPage({ params }: LandingProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  let sets: Awaited<ReturnType<typeof getSetsByIds>> = [];
  try {
    sets = await getSetsByIds([...FEATURED_SET_IDS]);
  } catch {
    sets = [];
  }

  const t = await getTranslations({ locale, namespace: "featured" });

  return (
    <>
      <Hero />

      <MethodCards />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{t("subheading")}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sets.length === 0
            ? Array.from({ length: 8 }).map((_, i) => <SetCardSkeleton key={i} />)
            : sets.map((set, i) => <SetCard key={set.set_num} set={set} index={i} />)}
        </div>
      </section>
    </>
  );
}
