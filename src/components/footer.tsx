import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("brand");
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 sm:flex-row sm:items-center sm:justify-between sm:text-start">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover shadow-sm"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">{t("name")}</p>
            <p className="text-xs text-muted-foreground">{t("footer")}</p>
          </div>
        </div>
        <a
          href="https://rebrickable.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {t("rebrickableCredit")}
        </a>
      </div>
    </footer>
  );
}
