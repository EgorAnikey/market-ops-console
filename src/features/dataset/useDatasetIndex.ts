"use client";

import { useContext } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Dataset } from "@/contracts/dataset";
import { createDatasetIndex, type DatasetIndex } from "@/domain/dataset-index";
import { LiveDatasetContext } from "./LiveDatasetContext";
import { datasetQuery } from "./queries";

const indexes = new WeakMap<Dataset, DatasetIndex>();

function indexOf(dataset: Dataset): DatasetIndex {
  const hit = indexes.get(dataset);
  if (hit) return hit;
  const index = createDatasetIndex(dataset);
  indexes.set(dataset, index);
  return index;
}

export function useDatasetIndex(): DatasetIndex {
  const { data } = useSuspenseQuery(datasetQuery);
  const live = useContext(LiveDatasetContext);
  return indexOf(live ?? data);
}
