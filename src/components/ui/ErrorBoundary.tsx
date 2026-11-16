"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { reportError } from "@/lib/observability";
import { Button } from "./Button";

interface Props {
  name: string;
  children: ReactNode;
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { boundary: this.props.name, stack: info.componentStack ?? "" });
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        role="alert"
        className="flex flex-col items-start gap-2 rounded-lg border border-bad/30 bg-bad-soft p-4"
      >
        <p className="flex items-center gap-2 text-sm font-medium text-bad">
          <TriangleAlert aria-hidden className="size-4" /> {this.props.name} failed to render
        </p>
        <p className="text-xs text-fg-muted">
          The rest of the console is unaffected. The error has been reported.
        </p>
        <Button size="sm" onClick={() => this.setState({ error: null })}>
          Try again
        </Button>
      </div>
    );
  }
}
