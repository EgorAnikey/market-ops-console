import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { regionScope } from "@/domain/hierarchy";
import { growthMatrix } from "@/domain/matrix";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { testFormatters as fmt } from "@/test/fixtures";
import { HeatMap } from "../HeatMap";

const meta = {
  title: "Charts/HeatMap",
  component: HeatMap,
  args: {
    rows: growthMatrix(testIndex, PORTFOLIO_SCOPE),
    periods: testIndex.periods,
    selectedPeriod: testIndex.latestPeriod,
    selectedMarketId: null,
    fmt,
    onSelect: () => undefined,
  },
  argTypes: { fmt: { control: false }, rows: { control: false }, periods: { control: false } },
  render: function Render(args) {
    const [, update] = useArgs();
    return (
      <HeatMap
        {...args}
        onSelect={(selectedMarketId, selectedPeriod) => update({ selectedMarketId, selectedPeriod })}
      />
    );
  },
} satisfies Meta<typeof HeatMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Rows: Story = { args: { rows: growthMatrix(testIndex, regionScope("eu")) } };
export const SelectedMarketId: Story = { args: { selectedMarketId: "de" } };
export const SelectedPeriod: Story = { args: { selectedPeriod: "2026-03" } };
