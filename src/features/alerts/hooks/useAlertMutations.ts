"use client";

import { useMutation } from "@tanstack/react-query";
import type { AlertRulePayload } from "@/contracts/alerts";
import { reportError } from "@/lib/observability";
import { alertsQueryKey, createAlert, deleteAlert, type ClientAlertRule } from "../api";
import { useOptimisticList } from "./useOptimisticList";

interface CreateVars {
  payload: AlertRulePayload;
  simulateFailure: boolean;
}

export function useCreateAlert() {
  const list = useOptimisticList<ClientAlertRule>(alertsQueryKey);
  return useMutation({
    mutationFn: ({ payload, simulateFailure }: CreateVars) => createAlert(payload, simulateFailure),
    onMutate: ({ payload }) => {
      const temp: ClientAlertRule = {
        ...payload,
        id: `temp-${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
        optimistic: true,
      };
      return list.apply((rules) => [temp, ...rules]);
    },
    onError: (error, _vars, snapshot) => {
      list.rollback(snapshot);
      reportError(error, { feature: "alerts.create" });
    },
    onSettled: list.settle,
  });
}

export function useDeleteAlert() {
  const list = useOptimisticList<ClientAlertRule>(alertsQueryKey);
  return useMutation({
    mutationFn: deleteAlert,
    onMutate: (id: string) => list.apply((rules) => rules.filter((r) => r.id !== id)),
    onError: (error, _id, snapshot) => {
      list.rollback(snapshot);
      reportError(error, { feature: "alerts.delete" });
    },
    onSettled: list.settle,
  });
}
