import type { MarketHealth } from "@/domain/health";
import type { Kpis } from "@/domain/kpis";
import type { Scope } from "@/domain/scope";

export interface KpiRow {
  id: string;
  name: string;
  context: string | null;
  scope: Scope;
  kpis: Kpis;
  changePct: number | null;
}

export function healthToRow(h: MarketHealth, regionName: string | null, productId: string | null): KpiRow {
  return {
    id: h.market.id,
    name: h.market.name,
    context: regionName,
    scope: { regionId: h.market.regionId, marketId: h.market.id, productId },
    kpis: h.kpis,
    changePct: h.changePct,
  };
}
