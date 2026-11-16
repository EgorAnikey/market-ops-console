import { Ban, CircleStop, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import type { AssistantTurn } from "../lib/chat-state";
import { cn } from "@/lib/cn";

interface Notice {
  Icon: LucideIcon;
  title: string;
  body: string;
  className: string;
}

function noticeFor(turn: AssistantTurn): Notice | null {
  if (turn.status === "error") {
    return {
      Icon: TriangleAlert,
      title: "No answer generated",
      body: turn.error ?? "The assistant failed to respond.",
      className: "border-bad/30 bg-bad-soft text-bad",
    };
  }
  if (turn.status === "stopped") {
    return {
      Icon: CircleStop,
      title: "Stopped: partial answer",
      body: "Generation was stopped, so this text is incomplete and has no verified sources.",
      className: "border-border-strong bg-surface-2 text-fg-muted",
    };
  }
  if (turn.kind === "abstain") {
    return {
      Icon: Ban,
      title: "Can't be answered from this data",
      body: "The assistant declined rather than guess. Nothing here is a forecast.",
      className: "border-border-strong bg-surface-2 text-fg-muted",
    };
  }
  if (turn.kind === "low_confidence") {
    return {
      Icon: Info,
      title: "Directional only",
      body: "The data only partly supports this answer. Check the sources before acting on it.",
      className: "border-warn/30 bg-warn-soft text-warn",
    };
  }
  return null;
}

export function AnswerNotice({ turn }: { turn: AssistantTurn }) {
  const notice = noticeFor(turn);
  if (!notice) return null;
  const { Icon, title, body, className } = notice;
  return (
    <div
      role={turn.status === "error" ? "alert" : undefined}
      className={cn("flex gap-2 rounded-md border px-2.5 py-2", className)}
    >
      <Icon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <p className="text-xs">
        <strong className="font-semibold">{title}.</strong> <span className="text-fg-muted">{body}</span>
      </p>
    </div>
  );
}
