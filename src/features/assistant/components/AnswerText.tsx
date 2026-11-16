import { Fragment, useMemo } from "react";
import type { ResolvedCitation } from "@/domain/citations";
import { annotate } from "../lib/annotate";

interface AnswerTextProps {
  text: string;
  citations: readonly ResolvedCitation[];
  streaming: boolean;
  onRefHover: (n: number | null) => void;
  idPrefix: string;
}

export function AnswerText({ text, citations, streaming, onRefHover, idPrefix }: AnswerTextProps) {
  const paragraphs = useMemo(
    () => text.split(/\n{2,}/).map((p) => annotate(p, citations)),
    [text, citations],
  );

  return (
    <div className="flex flex-col gap-2 text-[0.8125rem] leading-relaxed text-fg">
      {paragraphs.map((segments, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {segments.map((s, j) =>
            s.type === "text" ? (
              <Fragment key={j}>{s.text}</Fragment>
            ) : (
              <span
                key={j}
                onMouseEnter={() => onRefHover(s.refs[0] ?? null)}
                onMouseLeave={() => onRefHover(null)}
              >
                <span className="underline decoration-fact/50 decoration-dotted underline-offset-2">
                  {s.text}
                </span>
                {s.refs.map((n) => (
                  <a
                    key={n}
                    href={`#${idPrefix}-${n}`}
                    onFocus={() => onRefHover(n)}
                    onBlur={() => onRefHover(null)}
                    className="num ml-0.5 align-super text-[0.625rem] font-semibold text-fact hover:underline"
                  >
                    <span className="sr-only">source </span>[{n}]
                  </a>
                ))}
              </span>
            ),
          )}
          {streaming && i === paragraphs.length - 1 ? (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-ai [animation:caret-blink_1s_steps(1)_infinite]"
            />
          ) : null}
        </p>
      ))}
    </div>
  );
}
