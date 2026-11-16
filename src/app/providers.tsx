"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { LocaleProvider } from "@/features/locale/LocaleProvider";
import type { Locale } from "@/features/locale/locales";
import type { SessionUser } from "@/contracts/session";
import { SessionProvider } from "@/features/session/SessionProvider";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
      mutations: { retry: 0 },
    },
  });
}

interface ProvidersProps {
  locale: Locale;
  session: SessionUser | null;
  children: ReactNode;
}

export function Providers({ locale, session, children }: ProvidersProps) {
  const [queryClient] = useState(makeQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <LocaleProvider initialLocale={locale}>
          <SessionProvider user={session}>{children}</SessionProvider>
        </LocaleProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}
