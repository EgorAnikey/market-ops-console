"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { reportError } from "@/lib/observability";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => reportError(error, { digest: error.digest ?? "" }), [error]);
  return (
    <main className="mx-auto flex max-w-md flex-col items-start gap-3 p-10" role="alert">
      <h1 className="text-lg font-semibold">The console could not load</h1>
      <p className="text-sm text-fg-muted">
        This has been reported. You can retry; your view is preserved in the URL.
      </p>
      <Button variant="primary" onClick={reset}>
        Retry
      </Button>
    </main>
  );
}
