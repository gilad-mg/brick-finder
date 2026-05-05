import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { SearchResults } from "@/components/search-results";
import { SetCardSkeleton } from "@/components/set-card";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  return {
    title: t("search"),
    description: tBrand("tagline"),
  };
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SetCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
