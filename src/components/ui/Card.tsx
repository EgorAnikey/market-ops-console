import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("rounded-[var(--radius-card)] border border-border bg-surface shadow-card", className)}
      {...props}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, titleId, description, actions, className }: CardHeaderProps) {
  return (
    <header
      className={cn("flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-3.5", className)}
    >
      <div className="min-w-0">
        <h2 id={titleId} className="text-[0.8125rem] font-semibold tracking-tight text-fg">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-xs text-fg-subtle">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 pt-3 pb-4", className)} {...props} />;
}
