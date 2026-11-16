import { MessageSquareText } from "lucide-react";

export const SUGGESTED_QUESTIONS = [
  "Which markets are at risk this quarter, and why?",
  "Why did Germany's revenue dip in March 2026?",
  "Compare APAC and Europe on growth and forecast attainment",
  "What's driving the portfolio's forecast miss?",
  "Give me a full portfolio summary",
  "Will sales grow next year?",
] as const;

export function SuggestedQuestions({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-3 p-1">
      <div>
        <p className="text-sm font-medium text-fg">Ask about performance</p>
        <p className="mt-0.5 text-xs text-fg-subtle">
          Answers are AI-generated from this console&apos;s dataset and cite the records they rely on.
        </p>
      </div>
      <ul className="flex flex-col gap-1.5">
        {SUGGESTED_QUESTIONS.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onPick(q)}
              className="touch-target flex w-full items-start gap-2 rounded-md border border-border bg-surface px-2.5 py-2 text-left text-xs text-fg hover:border-accent hover:bg-accent-soft"
            >
              <MessageSquareText aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fg-subtle" />
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
