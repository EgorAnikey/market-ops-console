import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { marketHealth } from "@/domain/health";
import { regionScope } from "@/domain/hierarchy";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { testFormatters as fmt } from "@/test/fixtures";
import { ScatterChart, type ScatterSelection } from "../scatter/ScatterChart";

const all = marketHealth(testIndex, PORTFOLIO_SCOPE, testIndex.latestPeriod);
const europe = marketHealth(testIndex, regionScope("eu"), testIndex.latestPeriod);
const noop = () => undefined;

const meta = {
  title: "Charts/ScatterChart",
  component: ScatterChart,
  args: { health: all, selection: { kind: "focus", ids: [], onChange: noop }, fmt },
  argTypes: { fmt: { control: false }, health: { control: false }, selection: { control: false } },
  render: function Render(args) {
    const [, update] = useArgs();
    const selection: ScatterSelection =
      args.selection.kind === "focus"
        ? { ...args.selection, onChange: (ids) => update({ selection: { ...args.selection, ids } }) }
        : { ...args.selection, onOpen: (id) => update({ selection: { ...args.selection, id } }) };
    return <ScatterChart {...args} selection={selection} />;
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selection: Story = { args: { selection: { kind: "focus", ids: ["de", "fr"], onChange: noop } } };
export const SelectionCurrent: Story = {
  args: { health: europe, selection: { kind: "current", id: "de", onOpen: noop } },
};
export const ShareLabel: Story = { args: { shareLabel: "Share, May 2026" } };
export const Empty: Story = {
  args: {
    health: [],
    empty: <p className="text-sm text-fg-muted">Market share isn&apos;t tracked per product</p>,
  },
};
