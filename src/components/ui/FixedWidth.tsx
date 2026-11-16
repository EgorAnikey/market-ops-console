import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FixedWidthProps {
  samples: readonly string[];
  align?: "start" | "end";
  children: ReactNode;
  className?: string;
}

export function FixedWidth({ samples, align = "start", children, className }: FixedWidthProps) {
  return (
    <span
      className={cn(
        "inline-grid whitespace-nowrap *:col-start-1 *:row-start-1",
        align === "end" ? "justify-items-end" : "justify-items-start",
        className,
      )}
    >
      {samples.map((sample) => (
        <span key={sample} aria-hidden className="invisible">
          {sample}
        </span>
      ))}
      <span>{children}</span>
    </span>
  );
}
