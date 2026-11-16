import type { DatasetIndex } from "./dataset-index";
import { PORTFOLIO_SCOPE, type Scope } from "./scope";

export type EntityKind = "portfolio" | "region" | "market" | "product";

export interface EntityRef {
  kind: EntityKind;
  id: string;
  name: string;
  scope: Scope;
}

export function regionScope(regionId: string, productId: string | null = null): Scope {
  return { regionId, marketId: null, productId };
}

export function marketScope(index: DatasetIndex, marketId: string, productId: string | null = null): Scope {
  const market = index.marketsById.get(marketId);
  return market ? { regionId: market.regionId, marketId, productId } : PORTFOLIO_SCOPE;
}

export type ChildKind = Exclude<EntityKind, "portfolio">;

export function childKind(scope: Scope): ChildKind {
  return scope.marketId ? "product" : scope.regionId ? "market" : "region";
}

export function childEntities(index: DatasetIndex, scope: Scope): EntityRef[] {
  const kind = childKind(scope);
  if (kind === "product") {
    return index.dataset.products.map((p) => ({
      kind: "product",
      id: p.id,
      name: p.name,
      scope: { ...scope, productId: p.id },
    }));
  }
  if (kind === "market") {
    return (index.marketsByRegion.get(scope.regionId ?? "") ?? []).map((m) => ({
      kind: "market",
      id: m.id,
      name: m.name,
      scope: marketScope(index, m.id, scope.productId),
    }));
  }
  return index.dataset.regions.map((r) => ({
    kind: "region",
    id: r.id,
    name: r.name,
    scope: regionScope(r.id, scope.productId),
  }));
}

export interface Crumb {
  label: string;
  scope: Scope;
  kind: EntityKind;
}

export function breadcrumbs(index: DatasetIndex, scope: Scope): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Portfolio", scope: PORTFOLIO_SCOPE, kind: "portfolio" }];
  const region = scope.regionId ? index.regionsById.get(scope.regionId) : undefined;
  const market = scope.marketId ? index.marketsById.get(scope.marketId) : undefined;
  const product = scope.productId ? index.productsById.get(scope.productId) : undefined;
  if (region) crumbs.push({ label: region.name, scope: regionScope(region.id), kind: "region" });
  if (market) crumbs.push({ label: market.name, scope: marketScope(index, market.id), kind: "market" });
  if (product) crumbs.push({ label: product.name, scope, kind: "product" });
  return crumbs;
}

export function scopeLabel(index: DatasetIndex, scope: Scope): string {
  return breadcrumbs(index, scope)
    .slice(scope.regionId || scope.productId ? 1 : 0)
    .map((c) => c.label)
    .join(" › ");
}

export function sanitizeScope(index: DatasetIndex, scope: Scope): Scope {
  const productId = scope.productId && index.productsById.has(scope.productId) ? scope.productId : null;
  if (scope.marketId && index.marketsById.has(scope.marketId)) {
    return marketScope(index, scope.marketId, productId);
  }
  const regionId = scope.regionId && index.regionsById.has(scope.regionId) ? scope.regionId : null;
  return { regionId, marketId: null, productId };
}
