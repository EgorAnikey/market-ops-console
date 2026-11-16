import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
      <Icon aria-hidden className="size-6 text-fg-subtle" />
      <p className="text-sm font-medium text-fg">{title}</p>
      {children ? <div className="max-w-sm text-xs text-fg-subtle">{children}</div> : null}
    </div>
  );
}
