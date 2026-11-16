import type { PeriodPoint } from "@/domain/aggregate";
import type { Formatters } from "@/lib/format/formatters";
import { SERIES } from "./time-series-meta";

export function TimeSeriesTooltip({
  point,
  fmt,
  note,
}: {
  point: PeriodPoint;
  fmt: Formatters;
  note: string | undefined;
}) {
  return (
    <>
      <p className="mb-1 font-semibold">{fmt.periodLong(point.period)}</p>
      {SERIES.map((s) => (
        <p key={s.key} className="num flex justify-between gap-3">
          <span className="text-fg-muted">{s.label}</span>
          {fmt.compactCurrency(point[s.key])}
        </p>
      ))}
      {note ? <p className="mt-1 max-w-48 text-bad">{note}</p> : null}
    </>
  );
}
