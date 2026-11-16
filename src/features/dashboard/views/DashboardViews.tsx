"use client";

import dynamic from "next/dynamic";
import { ConsoleSkeleton } from "@/features/shell/ConsoleSkeleton";
import { useDashboardState } from "../state/useDashboardState";
import { ExecutiveView } from "./ExecutiveView";

const AnalystView = dynamic(() => import("./AnalystView").then((m) => m.AnalystView), {
  loading: () => <ConsoleSkeleton />,
});

export function DashboardViews() {
  const { view } = useDashboardState();
  return view === "analyst" ? <AnalystView /> : <ExecutiveView />;
}
