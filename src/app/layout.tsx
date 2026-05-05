import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brick Finder",
  description: "Find any LEGO set, fast.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://brick-finder.vercel.app"),
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
