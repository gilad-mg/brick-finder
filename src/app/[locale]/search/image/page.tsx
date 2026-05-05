import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { UploadZone } from "@/components/upload-zone";

interface ImageSearchPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ImageSearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "imageSearch" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ImageSearchPage({ params }: ImageSearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "imageSearch" });

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>
      </div>
      <UploadZone />
    </section>
  );
}
