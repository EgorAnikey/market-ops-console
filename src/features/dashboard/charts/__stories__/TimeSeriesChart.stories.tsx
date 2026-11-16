import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { timeline } from "@/domain/aggregate";
import { marketScope } from "@/domain/hierarchy";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { testFormatters as fmt } from "@/test/fixtures";
import { TimeSeriesChart } from "../time-series/TimeSeriesChart";

const germany = testIndex.marketsById.get("de");

const meta = {
  title: "Charts/TimeSeriesChart",
  component: TimeSeriesChart,
  args: {
    points: timeline(testIndex, PORTFOLIO_SCOPE),
    selected: testIndex.latestPeriod,
    onSelect: () => undefined,
    anomalies: [],
    fmt,
    entityLabel: "Portfolio",
  },
  argTypes: { fmt: { control: false }, points: { control: false } },
  render: function Render(args) {
    const [, update] = useArgs();
    return <TimeSeriesChart {...args} onSelect={(selected) => update({ selected })} />;
  },
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selected: "2025-09" } };
export const Anomalies: Story = {
  args: {
    points: timeline(testIndex, marketScope(testIndex, "de")),
    entityLabel: "Germany",
    anomalies: (germany?.kpis.anomalies ?? []).map((a) => ({ period: a.period, note: a.note })),
  },
};
