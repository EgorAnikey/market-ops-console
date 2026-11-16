export interface Scope {
  regionId: string | null;
  marketId: string | null;
  productId: string | null;
}

export type ScopeLevel = "portfolio" | "region" | "market" | "product";

export const PORTFOLIO_SCOPE: Scope = Object.freeze({ regionId: null, marketId: null, productId: null });

export function scopeLevel(scope: Scope): ScopeLevel {
  if (scope.productId) return "product";
  if (scope.marketId) return "market";
  if (scope.regionId) return "region";
  return "portfolio";
}

export function scopeKey(scope: Scope): string {
  return [scope.regionId ?? "*", scope.marketId ?? "*", scope.productId ?? "*"].join("/");
}

export function isSameScope(a: Scope, b: Scope): boolean {
  return scopeKey(a) === scopeKey(b);
}
