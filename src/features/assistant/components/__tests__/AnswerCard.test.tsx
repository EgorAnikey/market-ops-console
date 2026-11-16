import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import type { AssistantTurn } from "../../lib/chat-state";
import { AnswerCard } from "../AnswerCard";

const base: AssistantTurn = {
  role: "assistant",
  id: "a1",
  questionId: "q1",
  text: "Germany fell sharply in March.",
  status: "done",
  kind: "normal",
  confidence: "high",
  citations: [{ marketId: "de", period: "2026-03", label: "Germany, March dip" }],
  error: null,
};

describe("AnswerCard", () => {
  it("labels AI output, shows confidence in words and cites authoritative values", () => {
    renderWithProviders(<AnswerCard turn={base} onRetry={vi.fn()} />);
    expect(screen.getByText("AI-generated")).toBeInTheDocument();
    expect(screen.getByText("High confidence")).toBeInTheDocument();
    const evidence = screen.getByRole("group", { name: "Evidence from source data" });
    expect(within(evidence).getByText("Germany, March dip")).toBeInTheDocument();
    expect(within(evidence).getByText("Off track")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "source [1]" })).toHaveAttribute("href", "#evidence-a1-1");
  });

  it("flags citations that don't resolve against the dataset", () => {
    renderWithProviders(
      <AnswerCard turn={{ ...base, citations: [{ marketId: "atlantis" }] }} onRetry={vi.fn()} />,
    );
    expect(screen.getByText(/Unverified: market “atlantis” not found/)).toBeInTheDocument();
  });

  it("withholds confidence and sources while streaming", () => {
    renderWithProviders(
      <AnswerCard
        turn={{ ...base, status: "streaming", confidence: null, citations: [] }}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByRole("article")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("High confidence")).not.toBeInTheDocument();
    expect(screen.getByText("Sources attach when the answer completes.")).toBeInTheDocument();
  });
});
