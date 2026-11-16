"use client";

import { useMemo } from "react";
import type { Citation } from "@/contracts/chat";
import { resolveCitations } from "@/domain/citations";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";

export function useResolvedCitations(citations: readonly Citation[]) {
  const index = useDatasetIndex();
  return useMemo(() => resolveCitations(index, citations), [index, citations]);
}
