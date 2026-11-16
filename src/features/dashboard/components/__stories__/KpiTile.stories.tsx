import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sparkline } from "@/components/charts/Sparkline";
import { timeline } from "@/domain/aggregate";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { KpiTile } from "../KpiTile";

const meta = {
  title: "Dashboard/KpiTile",
  component: KpiTile,
  args: {
    label: "Revenue · May 2026",
    value: "$22.9M",
    delta: { value: 7.3, figure: "+7.3%", samples: ["+888.8%"], label: "vs prior year" },
  },
  argTypes: { visual: { control: false } },
} satisfies Meta<typeof KpiTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Delta: Story = {
  args: { delta: { value: -4.6, figure: "$341.4K", samples: ["$888.8K"], label: "behind plan" } },
};
export const Footnote: Story = { args: { footnote: "103,868 units · prior year $21.3M" } };
export const Visual: Story = {
  args: { visual: <Sparkline values={timeline(testIndex, PORTFOLIO_SCOPE).map((p) => p.actual)} /> },
};
