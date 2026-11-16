"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || typeof dialog.showModal !== "function") return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto max-h-[85dvh] w-[min(32rem,calc(100vw-2rem))] flex-col rounded-[var(--radius-card)] border border-border bg-surface p-0 text-fg shadow-pop backdrop:bg-black/50 open:flex"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 id={titleId} className="text-sm font-semibold">
          {title}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X aria-hidden className="size-4" />
        </Button>
      </div>
      <div className="relative overflow-y-auto px-4 py-2">{children}</div>
    </dialog>
  );
}
