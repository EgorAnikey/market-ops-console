"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter, type UrlUpdateEvent } from "nuqs/adapters/testing";
import { datasetQueryKey } from "@/features/dataset/queries";
import { LiveProvider } from "@/features/live/LiveProvider";
import { LocaleProvider } from "@/features/locale/LocaleProvider";
import type { Locale } from "@/features/locale/locales";
import type { SessionUser } from "@/contracts/session";
import { SessionProvider } from "@/features/session/SessionProvider";
import { testDataset } from "./dataset";

export const TEST_ANALYST: SessionUser = {
  id: "dana",
  name: "Dana Reyes",
  email: "dana.reyes@example.com",
  role: "analyst",
};

export function createTestQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  queryClient.setQueryData(datasetQueryKey, testDataset);
  return queryClient;
}

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  searchParams?: string;
  locale?: Locale;
  hasMemory?: boolean;
  user?: SessionUser | null;
  onUrlUpdate?: (event: UrlUpdateEvent) => void;
}

export function TestProviders(props: TestProvidersProps) {
  const { children, searchParams = "", locale, hasMemory = false, user = TEST_ANALYST, onUrlUpdate } = props;
  const [ownClient] = useState(createTestQueryClient);
  return (
    <QueryClientProvider client={props.queryClient ?? ownClient}>
      <NuqsTestingAdapter searchParams={searchParams} hasMemory={hasMemory} onUrlUpdate={onUrlUpdate}>
        <LocaleProvider initialLocale={locale}>
          <SessionProvider user={user}>
            <LiveProvider>{children}</LiveProvider>
          </SessionProvider>
        </LocaleProvider>
      </NuqsTestingAdapter>
    </QueryClientProvider>
  );
}
