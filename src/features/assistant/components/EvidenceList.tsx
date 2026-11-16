import { Database } from "lucide-react";
import type { ResolvedCitation } from "@/domain/citations";
import { EvidenceItem } from "./EvidenceItem";

interface EvidenceListProps {
  citations: readonly ResolvedCitation[];
  highlighted: number | null;
  onHover: (n: number | null) => void;
  idPrefix: string;
}

export function EvidenceList({ citations, highlighted, onHover, idPrefix }: EvidenceListProps) {
  const unverified = citations.filter((c) => !c.verified).length;
  return (
    <div
      role="group"
      aria-label="Evidence from source data"
      className="rounded-md border border-fact-border bg-fact-soft/60 p-2"
    >
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-wide text-fact uppercase">
        <Database aria-hidden className="size-3" />
        Source data · {citations.length} {citations.length === 1 ? "record" : "records"}
        {unverified ? (
          <span className="font-medium text-warn normal-case">({unverified} unverified)</span>
        ) : null}
      </h3>
      <ol className="flex flex-col gap-1.5">
        {citations.map((c) => (
          <EvidenceItem
            key={c.n}
            id={`${idPrefix}-${c.n}`}
            citation={c}
            highlighted={highlighted === c.n}
            onHover={onHover}
          />
        ))}
      </ol>
    </div>
  );
}
