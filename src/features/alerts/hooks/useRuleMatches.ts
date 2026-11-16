"use client";

import { useMemo } from "react";
import type { AlertCondition } from "@/contracts/alerts";
import { evaluateRule } from "@/domain/alerts";
import { useDatasetIndex } from "@/features/dataset/useDatasetIndex";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";

interface Evaluable {
  scope: string;
  match: "any" | "all";
  conditions: readonly Partial<AlertCondition>[];
}

const isComplete = (c: Partial<AlertCondition>): c is AlertCondition =>
  Boolean(c.metric && c.operator) && Number.isFinite(c.threshold);

export function useRuleMatches(rule: Evaluable) {
  const index = useDatasetIndex();
  const { period } = useDashboardState();
  const ruleKey = JSON.stringify({
    scope: rule.scope,
    match: rule.match,
    conditions: rule.conditions.filter(isComplete),
  });
  return useMemo(
    () => evaluateRule(index, JSON.parse(ruleKey) as Evaluable & { conditions: AlertCondition[] }, period),
    [index, ruleKey, period],
  );
}
