import type { Confidence } from "@/contracts/chat";
import { cn } from "@/lib/cn";

export const CONFIDENCE_META: Record<
  Confidence,
  { label: string; bars: number; tone: string; hint: string }
> = {
  high: { label: "High confidence", bars: 3, tone: "bg-ok", hint: "Directly supported by the cited data." },
  medium: {
    label: "Medium confidence",
    bars: 2,
    tone: "bg-warn",
    hint: "Supported by the data, with some interpretation.",
  },
  low: {
    label: "Low confidence",
    bars: 1,
    tone: "bg-bad",
    hint: "Only partly supported. Treat as directional.",
  },
};

export function ConfidenceMeter({ confidence }: { confidence: Confidence | null }) {
  if (!confidence) {
    return <span className="text-[0.6875rem] text-fg-subtle">Confidence pending…</span>;
  }
  const meta = CONFIDENCE_META[confidence];
  return (
    <span className="inline-flex items-center gap-1.5" title={meta.hint}>
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-1 rounded-sm", i <= meta.bars ? meta.tone : "bg-surface-3")}
            style={{ height: 4 + i * 3 }}
          />
        ))}
      </span>
      <span className="text-[0.6875rem] font-medium text-fg-muted">{meta.label}</span>
      <span className="sr-only">. {meta.hint}</span>
    </span>
  );
}
