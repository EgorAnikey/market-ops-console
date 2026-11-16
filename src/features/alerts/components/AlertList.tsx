"use client";

import { useRef } from "react";
import { BellOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { alertsQuery } from "../api";
import { useDeleteAlert } from "../hooks/useAlertMutations";
import { AlertRuleItem } from "./AlertRuleItem";

export function AlertList({ canDelete }: { canDelete: boolean }) {
  const alerts = useQuery(alertsQuery);
  const remove = useDeleteAlert();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const onDelete = (id: string) => {
    headingRef.current?.focus();
    remove.mutate(id);
  };

  return (
    <section aria-labelledby="alert-list-title" className="flex flex-col">
      <h3 ref={headingRef} tabIndex={-1} id="alert-list-title" className="text-sm font-semibold">
        Active alerts{" "}
        {alerts.data ? <span className="num font-normal text-fg-subtle">({alerts.data.length})</span> : null}
      </h3>
      {alerts.isPending ? (
        <div className="mt-3 flex flex-col gap-2" aria-busy="true" aria-label="Loading alerts">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : alerts.isError ? (
        <div role="alert" className="mt-3 flex flex-col items-start gap-2 text-xs text-bad">
          Couldn&apos;t load alerts.{" "}
          <Button size="sm" onClick={() => alerts.refetch()}>
            Retry
          </Button>
        </div>
      ) : alerts.data.length === 0 ? (
        <EmptyState icon={BellOff} title="No alerts yet">
          Create a rule to get flagged when a market crosses a threshold.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-border">
          {alerts.data.map((rule) => (
            <AlertRuleItem key={rule.id} rule={rule} onDelete={canDelete ? onDelete : undefined} />
          ))}
        </ul>
      )}
      {remove.isError ? (
        <p role="alert" className="text-xs text-bad">
          Delete failed; the rule was restored.
        </p>
      ) : null}
    </section>
  );
}
