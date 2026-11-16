import { AlertsPanel } from "@/features/alerts/AlertsPanel";
import { BreakdownPanel } from "../panels/BreakdownPanel";
import { FactTablePanel } from "../panels/FactTablePanel";
import { HeatmapPanel } from "../panels/HeatmapPanel";
import { KpiTiles } from "../panels/KpiTiles";
import { MapPanel } from "../panels/MapPanel";
import { RadarPanel } from "../panels/RadarPanel";
import { ScatterPanel } from "../panels/ScatterPanel";
import { TrendPanel } from "../panels/TrendPanel";

export function AnalystView() {
  return (
    <div className="flex flex-col gap-3">
      <KpiTiles detailed />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <MapPanel />
        <RadarPanel />
      </div>
      <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
        <TrendPanel />
        <ScatterPanel />
      </div>
      <BreakdownPanel />
      <HeatmapPanel />
      <FactTablePanel />
      <AlertsPanel />
    </div>
  );
}
