import type { RiskReason } from "@/domain/health";
import type { Formatters } from "@/lib/format/formatters";

export function riskReasonText(reason: RiskReason, fmt: Formatters): string {
  switch (reason.type) {
    case "attainment":
      return `${fmt.percent(reason.value)} of forecast`;
    case "growth":
      return `${fmt.signedPercent(reason.value)} vs prior year`;
    case "anomaly":
      return `${fmt.period(reason.anomaly.period)}: ${reason.anomaly.note}`;
  }
}
