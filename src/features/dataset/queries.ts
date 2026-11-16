import { queryOptions } from "@tanstack/react-query";
import type { Dataset } from "@/contracts/dataset";

export const datasetQueryKey = ["dataset"] as const;

export const datasetQuery = queryOptions({
  queryKey: datasetQueryKey,
  queryFn: (): Promise<Dataset> =>
    Promise.reject(new Error("Dataset missing from the query cache: seed it on the server.")),
  staleTime: Infinity,
  gcTime: Infinity,
});
