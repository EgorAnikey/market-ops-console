import { cloneElement, useId, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ControlA11yProps {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | undefined;
  className?: string;
  children: ReactElement<ControlA11yProps>;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-xs font-medium text-fg-muted">
        {label}
      </label>
      {cloneElement(children, { id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error ? (
        <p id={hintId} className="text-[0.6875rem] text-fg-subtle">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[0.6875rem] font-medium text-bad">
      {message}
    </p>
  );
}

export const inputClass =
  "h-8 w-full rounded-md border border-control-border bg-surface px-2.5 text-[0.8125rem] text-fg placeholder:text-fg-subtle hover:border-fg-subtle aria-[invalid=true]:border-bad";
