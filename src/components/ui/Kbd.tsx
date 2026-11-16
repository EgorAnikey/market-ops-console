import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border-strong bg-surface-2 px-1 font-mono text-[0.6875rem] text-fg-muted">
      {children}
    </kbd>
  );
}
