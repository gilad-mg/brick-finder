import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MyBricksList } from "@/components/my-bricks-list";

interface MyBricksPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MyBricksPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "myBricks" });
  return {
    title: t("heading"),
    description: t("emptyHint"),
  };
}

export default async function MyBricksPage({ params }: MyBricksPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MyBricksList />;
}
