import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Inter, Heebo } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans-he",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = locale === "he";

  return (
    <html
      lang={locale === "he" ? "he-IL" : "en"}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${inter.variable} ${heebo.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers isRtl={isRtl}>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
