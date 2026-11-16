"use client";

import { memo, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useResolvedCitations } from "../hooks/useResolvedCitations";
import type { AssistantTurn } from "../lib/chat-state";
import { AnswerNotice } from "./AnswerNotice";
import { AnswerText } from "./AnswerText";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { EvidenceList } from "./EvidenceList";

interface AnswerCardProps {
  turn: AssistantTurn;
  onRetry: (questionId: string) => void;
}

function AnswerCardView({ turn, onRetry }: AnswerCardProps) {
  const citations = useResolvedCitations(turn.citations);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const evidenceId = `evidence-${turn.id}`;
  const streaming = turn.status === "streaming";
  const waiting = streaming && turn.text.length === 0;
  const canRetry = turn.status === "error" || turn.status === "stopped";
  const unsourced = turn.status === "done" && turn.kind === "normal" && citations.length === 0;

  return (
    <article
      aria-label="Assistant answer"
      aria-busy={streaming}
      className="flex flex-col gap-2.5 rounded-lg border border-ai-border border-l-[3px] border-l-ai bg-ai-soft/50 p-3"
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold tracking-wide text-ai uppercase">
          <Sparkles aria-hidden className="size-3" /> AI-generated
        </span>
        {turn.status === "done" ? <ConfidenceMeter confidence={turn.confidence} /> : null}
        {streaming ? <span className="text-[0.6875rem] text-fg-subtle">Generating…</span> : null}
      </header>

      {waiting ? (
        <p className="text-xs text-fg-subtle">Reading the dataset…</p>
      ) : turn.text ? (
        <AnswerText
          text={turn.text}
          citations={turn.status === "done" ? citations : []}
          streaming={streaming}
          onRefHover={setHighlighted}
          idPrefix={evidenceId}
        />
      ) : null}

      <AnswerNotice turn={turn} />

      {citations.length > 0 ? (
        <EvidenceList
          citations={citations}
          highlighted={highlighted}
          onHover={setHighlighted}
          idPrefix={evidenceId}
        />
      ) : null}
      {unsourced ? (
        <p className="text-[0.6875rem] text-warn">
          No sources were cited, so this answer can&apos;t be verified.
        </p>
      ) : null}
      {streaming ? (
        <p className="text-[0.6875rem] text-fg-subtle">Sources attach when the answer completes.</p>
      ) : null}

      {canRetry ? (
        <Button size="sm" className="self-start" onClick={() => onRetry(turn.questionId)}>
          <RotateCcw aria-hidden className="size-3" /> Retry
        </Button>
      ) : null}
    </article>
  );
}

export const AnswerCard = memo(AnswerCardView);
