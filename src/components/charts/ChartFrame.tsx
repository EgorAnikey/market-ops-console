"use client";

import { useId, useState, type ReactNode } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";

type Mode = "chart" | "table";
const MODES = [
  { value: "chart", label: "Chart" },
  { value: "table", label: "Table" },
] as const;

interface ChartFrameProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  legend?: ReactNode;
  table: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartFrame({
  title,
  description,
  actions,
  legend,
  table,
  children,
  className,
}: ChartFrameProps) {
  const [mode, setMode] = useState<Mode>("chart");
  const titleId = useId();

  return (
    <Card aria-labelledby={titleId} className={cn("flex flex-col", className)}>
      <CardHeader
        title={title}
        titleId={titleId}
        description={description}
        actions={
          <>
            {actions}
            <SegmentedControl
              label={`${title} display`}
              options={MODES}
              value={mode}
              onChange={setMode}
              size="sm"
            />
          </>
        }
      />
      <CardBody className="flex flex-1 flex-col">
        <ErrorBoundary name={title}>
          <div className="relative flex-1">
            <div inert={mode === "table"} className={cn(mode === "table" && "invisible")}>
              {children}
              {legend ? <div className="mt-2">{legend}</div> : null}
            </div>
            {mode === "table" ? (
              <div className="absolute inset-0 flex flex-col *:min-h-0 *:flex-1">{table}</div>
            ) : null}
          </div>
        </ErrorBoundary>
      </CardBody>
    </Card>
  );
}
