import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { timeline } from "@/domain/aggregate";
import { marketScope } from "@/domain/hierarchy";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { Sparkline } from "../Sparkline";

const actuals = (scope = PORTFOLIO_SCOPE) => timeline(testIndex, scope).map((p) => p.actual);

const meta = {
  title: "Charts/Sparkline",
  component: Sparkline,
  args: { values: actuals() },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Values: Story = { args: { values: actuals(marketScope(testIndex, "de")) } };
export const HighlightIndex: Story = { args: { highlightIndex: 12 } };
