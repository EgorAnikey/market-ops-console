import type { SVGProps } from "react";
import type { Status } from "@/contracts/dataset";
import { STATUS_COLOR } from "@/lib/viz/color";

interface StatusMarkerProps extends Omit<SVGProps<SVGPathElement>, "d"> {
  status: Status;
  cx: number;
  cy: number;
  r: number;
}

export function markerPath(status: Status, cx: number, cy: number, r: number): string {
  if (status === "at_risk") {
    const h = r * 1.15;
    return `M${cx},${cy - h} L${cx + h},${cy + h * 0.8} L${cx - h},${cy + h * 0.8} Z`;
  }
  if (status === "off_track") {
    const d = r * 1.25;
    return `M${cx},${cy - d} L${cx + d},${cy} L${cx},${cy + d} L${cx - d},${cy} Z`;
  }
  return `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`;
}

export function StatusMarker({ status, cx, cy, r, ...props }: StatusMarkerProps) {
  return <path d={markerPath(status, cx, cy, r)} fill={STATUS_COLOR[status]} {...props} />;
}
