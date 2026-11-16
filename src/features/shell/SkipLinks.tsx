"use client";

import { useAssistantActions } from "@/features/assistant/AssistantProvider";

const linkClass =
  "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:shadow-pop";

export function SkipLinks() {
  const { focusComposer } = useAssistantActions();
  return (
    <nav aria-label="Skip links">
      <a href="#main" className={linkClass}>
        Skip to dashboard
      </a>
      <a
        href="#assistant-input"
        className={linkClass}
        onClick={(e) => {
          e.preventDefault();
          focusComposer();
        }}
      >
        Skip to assistant
      </a>
    </nav>
  );
}
