import { createFormatters } from "@/lib/format/formatters";
import { testDataset } from "./dataset";

export const testFormatters = createFormatters("en-US", testDataset.meta.currency);
