"use client";

import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useCallback } from "react";

export interface OptimisticSnapshot<T> {
  previous: T[] | undefined;
}

export function useOptimisticList<T>(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  const apply = useCallback(
    async (update: (list: T[]) => T[]): Promise<OptimisticSnapshot<T>> => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<T[]>(queryKey);
      queryClient.setQueryData<T[]>(queryKey, (list) => update(list ?? []));
      return { previous };
    },
    [queryClient, queryKey],
  );

  const rollback = useCallback(
    (snapshot: OptimisticSnapshot<T> | undefined) => {
      if (snapshot) queryClient.setQueryData(queryKey, snapshot.previous);
    },
    [queryClient, queryKey],
  );

  const settle = useCallback(() => queryClient.invalidateQueries({ queryKey }), [queryClient, queryKey]);

  return { apply, rollback, settle };
}
