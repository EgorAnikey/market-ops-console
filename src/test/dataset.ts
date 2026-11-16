import raw from "@data/data.json";
import { datasetSchema } from "@/contracts/dataset";
import { createDatasetIndex } from "@/domain/dataset-index";

export const testDataset = datasetSchema.parse(raw);
export const testIndex = createDatasetIndex(testDataset);
