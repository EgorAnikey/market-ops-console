import { CircleCheck, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Status } from "@/contracts/dataset";
import { Badge, type Tone } from "./Badge";

export const STATUS_META: Record<Status, { label: string; tone: Tone; Icon: LucideIcon }> = {
  on_track: { label: "On track", tone: "ok", Icon: CircleCheck },
  at_risk: { label: "At risk", tone: "warn", Icon: TriangleAlert },
  off_track: { label: "Off track", tone: "bad", Icon: OctagonAlert },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { label, tone, Icon } = STATUS_META[status];
  return (
    <Badge tone={tone} className={className}>
      <Icon aria-hidden className="size-3" />
      {label}
    </Badge>
  );
}
