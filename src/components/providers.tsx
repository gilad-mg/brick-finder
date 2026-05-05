"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, domAnimation } from "framer-motion";
import { Toaster } from "sonner";
import { SoundProvider } from "./sound-provider";

const KonamiListener = dynamic(
  () => import("./konami-listener").then((m) => m.KonamiListener),
  { ssr: false },
);
const CustomCursor = dynamic(
  () => import("./custom-cursor").then((m) => m.CustomCursor),
  { ssr: false },
);

interface ProvidersProps {
  children: React.ReactNode;
  isRtl: boolean;
}

export function Providers({ children, isRtl }: ProvidersProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <SoundProvider>
        <QueryClientProvider client={queryClient}>
          <LazyMotion features={domAnimation} strict={false}>
            {children}
            <Toaster
              position={isRtl ? "bottom-left" : "bottom-right"}
              theme="system"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast:
                    "rounded-2xl border border-primary/30 bg-card text-card-foreground shadow-lg",
                },
              }}
            />
            <KonamiListener />
            <CustomCursor />
          </LazyMotion>
        </QueryClientProvider>
      </SoundProvider>
    </ThemeProvider>
  );
}
