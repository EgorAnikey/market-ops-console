import { memo } from "react";
import { Crosshair } from "lucide-react";
import type { UserTurn } from "../lib/chat-state";

function UserBubbleView({ turn, contextLabel }: { turn: UserTurn; contextLabel: string | null }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="max-w-[90%] rounded-lg rounded-br-sm bg-accent px-3 py-2 text-[0.8125rem] whitespace-pre-wrap text-on-accent">
        <span className="sr-only">You asked: </span>
        {turn.text}
      </p>
      {contextLabel ? (
        <p className="flex items-center gap-1 text-[0.6875rem] text-fg-subtle">
          <Crosshair aria-hidden className="size-3" /> Asked while viewing {contextLabel}
        </p>
      ) : null}
    </div>
  );
}

export const UserBubble = memo(UserBubbleView);
