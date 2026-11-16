import type { Status } from "@/contracts/dataset";

export const STATUS_RULE = {
  offTrack: { growthBelowPct: 0, attainmentBelowPct: 90 },
  atRisk: { growthBelowPct: 2, attainmentBelowPct: 100 },
} as const;

export function deriveStatus(growthPct: number | null, attainmentPct: number | null): Status {
  const below = (value: number | null, limit: number) => value !== null && value < limit;
  const { offTrack, atRisk } = STATUS_RULE;
  if (below(growthPct, offTrack.growthBelowPct) || below(attainmentPct, offTrack.attainmentBelowPct)) {
    return "off_track";
  }
  if (below(growthPct, atRisk.growthBelowPct) || below(attainmentPct, atRisk.attainmentBelowPct)) {
    return "at_risk";
  }
  return "on_track";
}

export const needsAttention = (status: Status): boolean => status !== "on_track";

export const STATUS_SEVERITY: Record<Status, number> = { off_track: 2, at_risk: 1, on_track: 0 };
