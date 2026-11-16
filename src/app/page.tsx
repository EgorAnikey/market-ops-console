import { Suspense } from "react";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { alertsQueryKey } from "@/features/alerts/api";
import { datasetQueryKey } from "@/features/dataset/queries";
import { Console } from "@/features/shell/Console";
import { ConsoleSkeleton } from "@/features/shell/ConsoleSkeleton";
import { alertStore } from "@/server/alerts/store";
import { getSession } from "@/server/auth/session";
import { getDataset } from "@/server/dataset";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function currentUrl(params: Record<string, string | string[] | undefined>): string {
  const query = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      value === undefined ? [] : (Array.isArray(value) ? value : [value]).map((v) => [key, v]),
    ),
  ).toString();
  return query ? `/?${query}` : "/";
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  if (!(await getSession())) redirect(`/signin?returnTo=${encodeURIComponent(currentUrl(params))}`);
  const queryClient = new QueryClient();
  queryClient.setQueryData(datasetQueryKey, getDataset());
  queryClient.setQueryData(alertsQueryKey, alertStore.list());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ConsoleSkeleton />}>
        <Console />
      </Suspense>
    </HydrationBoundary>
  );
}
