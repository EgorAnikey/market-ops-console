import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type Tone = "neutral" | "ok" | "warn" | "bad" | "ai" | "fact" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-fg-muted border-border",
  ok: "bg-ok-soft text-ok border-ok/30",
  warn: "bg-warn-soft text-warn border-warn/30",
  bad: "bg-bad-soft text-bad border-bad/30",
  ai: "bg-ai-soft text-ai border-ai-border",
  fact: "bg-fact-soft text-fact border-fact-border",
  accent: "bg-accent-soft text-accent border-accent/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
