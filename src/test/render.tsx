import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import type { UrlUpdateEvent } from "nuqs/adapters/testing";
import { vi } from "vitest";
import type { SessionUser } from "@/contracts/session";
import { createTestQueryClient, TestProviders } from "./TestProviders";

interface Options {
  searchParams?: string;
  user?: SessionUser | null;
}

export function renderWithProviders(ui: ReactElement, { searchParams = "", user }: Options = {}) {
  const queryClient = createTestQueryClient();
  const onUrlUpdate = vi.fn<(e: UrlUpdateEvent) => void>();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders
      queryClient={queryClient}
      searchParams={searchParams}
      user={user}
      onUrlUpdate={onUrlUpdate}
    >
      {children}
    </TestProviders>
  );
  return { ...render(ui, { wrapper }), queryClient, onUrlUpdate };
}

export function sseResponse(events: readonly object[], { open = false } = {}): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const e of events) controller.enqueue(encoder.encode(`data: ${JSON.stringify(e)}\n\n`));
      if (!open) controller.close();
    },
  });
  return new Response(body, { headers: { "Content-Type": "text/event-stream" } });
}
