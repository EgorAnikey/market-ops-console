import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import {
  alertRuleSchema,
  SIMULATE_FAILURE_HEADER,
  type AlertRule,
  type AlertRulePayload,
} from "@/contracts/alerts";
import { HttpError, fetchJson } from "@/lib/http";

export type ClientAlertRule = AlertRule & { optimistic?: true };

export const alertsQueryKey = ["alerts"] as const;

export const alertsQuery = queryOptions({
  queryKey: alertsQueryKey,
  queryFn: (): Promise<ClientAlertRule[]> => fetchJson("/api/alerts", z.array(alertRuleSchema)),
});

export function createAlert(payload: AlertRulePayload, simulateFailure: boolean): Promise<AlertRule> {
  return fetchJson("/api/alerts", alertRuleSchema, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: simulateFailure ? { [SIMULATE_FAILURE_HEADER]: "1" } : {},
  });
}

export async function deleteAlert(id: string): Promise<void> {
  const res = await fetch(`/api/alerts/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new HttpError(res.status, "Could not delete the rule.");
}
