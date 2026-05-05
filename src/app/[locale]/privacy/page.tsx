import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-base text-muted-foreground">{t("intro")}</p>

      <div className="mt-10 space-y-8">
        <Section heading={t("storage")} body={t("storageDetail")} />
        <Section heading={t("saved")} body={t("savedDetail")} />
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        {t("credits")}{" "}
        <a
          href="https://rebrickable.com/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          Rebrickable
        </a>{" "}
        ·{" "}
        <a
          href="https://brickognize.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          Brickognize
        </a>
      </p>
    </section>
  );
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
