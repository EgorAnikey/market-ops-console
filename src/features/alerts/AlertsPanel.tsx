"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ROLE_LABEL } from "@/domain/permissions";
import { useSession } from "@/features/session/SessionProvider";
import { AlertForm } from "./components/AlertForm";
import { AlertList } from "./components/AlertList";
import { ReadOnlyNotice } from "./components/ReadOnlyNotice";

export function AlertsPanel({ className }: { className?: string }) {
  const { user, can } = useSession();
  const canWrite = can("alerts:write");
  return (
    <Card className={className}>
      <CardHeader
        title="Threshold alerts"
        description="Get flagged when a market crosses a growth, attainment or share threshold."
      />
      <CardBody className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <ErrorBoundary name="Alert form">
          {canWrite ? <AlertForm /> : <ReadOnlyNotice role={user ? ROLE_LABEL[user.role] : "guest"} />}
        </ErrorBoundary>
        <ErrorBoundary name="Alert list">
          <AlertList canDelete={canWrite} />
        </ErrorBoundary>
      </CardBody>
    </Card>
  );
}
