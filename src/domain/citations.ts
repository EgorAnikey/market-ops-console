import type { Citation } from "@/contracts/chat";
import type { Period } from "@/contracts/dataset";
import { isKnownPeriod, type DatasetIndex } from "./dataset-index";
import { marketScope, regionScope, scopeLabel } from "./hierarchy";
import { computeKpis, type Kpis } from "./kpis";
import { PORTFOLIO_SCOPE, type Scope } from "./scope";

export interface ResolvedCitation {
  n: number;
  label: string;
  scope: Scope;
  scopeName: string;
  period: Period;
  kpis: Kpis | null;
  verified: boolean;
  unresolved: string[];
  mentions: string[];
}

export function resolveCitation(index: DatasetIndex, citation: Citation, n: number): ResolvedCitation {
  const unresolved: string[] = [];
  const market = citation.marketId ? index.marketsById.get(citation.marketId) : undefined;
  const region = citation.regionId ? index.regionsById.get(citation.regionId) : undefined;
  const product = citation.productId ? index.productsById.get(citation.productId) : undefined;
  if (citation.marketId && !market) unresolved.push(`market “${citation.marketId}”`);
  if (citation.regionId && !region) unresolved.push(`region “${citation.regionId}”`);
  if (citation.productId && !product) unresolved.push(`product “${citation.productId}”`);
  const periodOk = !citation.period || isKnownPeriod(index, citation.period);
  if (!periodOk) unresolved.push(`period “${citation.period}”`);

  const productId = product?.id ?? null;
  let scope: Scope = { ...PORTFOLIO_SCOPE, productId };
  if (market) scope = marketScope(index, market.id, productId);
  else if (region) scope = regionScope(region.id, productId);

  const period = citation.period && periodOk ? citation.period : index.latestPeriod;
  const verified = unresolved.length === 0;
  const scopeName = scopeLabel(index, scope);
  return {
    n,
    label: citation.label ?? scopeName,
    scope,
    scopeName,
    period,
    kpis: verified ? computeKpis(index, scope, period) : null,
    verified,
    unresolved,
    mentions: [market?.name, region?.name, product?.name].filter((s): s is string => Boolean(s)),
  };
}

export function resolveCitations(index: DatasetIndex, citations: readonly Citation[]): ResolvedCitation[] {
  return citations.map((c, i) => resolveCitation(index, c, i + 1));
}
