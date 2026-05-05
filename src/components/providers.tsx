"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

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
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}
