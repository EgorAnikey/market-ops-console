"use client";

import { createContext } from "react";
import type { Dataset } from "@/contracts/dataset";

export const LiveDatasetContext = createContext<Dataset | null>(null);
