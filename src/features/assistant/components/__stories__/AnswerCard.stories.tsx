import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import raw from "@data/fixtures.json";
import { fixturesFileSchema } from "@/contracts/chat";
import type { AssistantTurn } from "../../lib/chat-state";
import { AnswerCard } from "../AnswerCard";

const { fixtures } = fixturesFileSchema.parse(raw);

const answer = (id: string, overrides: Partial<AssistantTurn> = {}): AssistantTurn => {
  const f = fixtures.find((x) => x.id === id) ?? fixtures[0]!;
  return {
    role: "assistant",
    id: `story-${id}`,
    questionId: "q",
    text: f.answer.text,
    status: f.kind === "error" ? "error" : "done",
    kind: f.kind,
    confidence: f.answer.confidence,
    citations: f.answer.citations,
    error: f.error ?? null,
    ...overrides,
  };
};

const meta = {
  title: "Assistant/AnswerCard",
  component: AnswerCard,
  args: { turn: answer("germany-dip"), onRetry: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Every answer state from the stream contract, using the starter pack's fixtures. AI text is violet; evidence resolved against the dataset is teal.",
      },
    },
  },
} satisfies Meta<typeof AnswerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ConfidenceMedium: Story = { args: { turn: answer("apac-vs-europe") } };
export const ConfidenceLow: Story = { args: { turn: answer("forecast-miss") } };
export const KindAbstain: Story = { args: { turn: answer("next-year") } };
const streaming: Partial<AssistantTurn> = { kind: null, citations: [], confidence: null };
export const StatusStreaming: Story = {
  args: {
    turn: answer("at-risk", {
      ...streaming,
      status: "streaming",
      text: "Three markets stand out as at risk. Germany is",
    }),
  },
};
export const StatusStreamingNoText: Story = {
  args: { turn: answer("at-risk", { ...streaming, status: "streaming", text: "" }) },
};
export const StatusStopped: Story = {
  args: {
    turn: answer("summary-long", {
      ...streaming,
      status: "stopped",
      text: "Here's the portfolio at a glance.",
    }),
  },
};
export const StatusError: Story = {
  args: {
    turn: answer("error", { status: "error", text: "", error: "The assistant is unavailable (503)." }),
  },
};
export const Citations: Story = {
  args: {
    turn: answer("germany-dip", {
      citations: [
        { marketId: "de", period: "2026-03", label: "Germany, March dip" },
        { marketId: "zz", label: "A market not in the data" },
      ],
    }),
  },
};
