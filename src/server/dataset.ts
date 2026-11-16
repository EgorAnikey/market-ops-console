import "server-only";
import raw from "@data/data.json";
import { datasetSchema, type Dataset } from "@/contracts/dataset";

export const dataset: Dataset = datasetSchema.parse(raw);

export function getDataset(): Dataset {
  return dataset;
}
