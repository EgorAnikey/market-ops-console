import { HealthHeadline } from "../components/HealthHeadline";
import { KpiTiles } from "../panels/KpiTiles";
import { MapPanel } from "../panels/MapPanel";
import { MoversPanel } from "../panels/MoversPanel";
import { RiskPanel } from "../panels/RiskPanel";
import { TrendPanel } from "../panels/TrendPanel";

export function ExecutiveView() {
  return (
    <div className="flex flex-col gap-3">
      <HealthHeadline />
      <KpiTiles detailed={false} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <MapPanel />
        <RiskPanel />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <TrendPanel />
        <MoversPanel />
      </div>
    </div>
  );
}
