import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { marketScope, regionScope } from "@/domain/hierarchy";
import { computeKpis } from "@/domain/kpis";
import type { Scope } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { testFormatters as fmt } from "@/test/fixtures";
import { RadarChart } from "../RadarChart";
import type { RadarEntity } from "../radar-model";

const entity = (key: string, name: string, scope: Scope): RadarEntity => ({
  key,
  name,
  scope,
  kpis: computeKpis(testIndex, scope, testIndex.latestPeriod),
});

const regions = testIndex.dataset.regions.map((r) => entity(r.id, r.name, regionScope(r.id)));
const europe = (testIndex.marketsByRegion.get("eu") ?? []).map((m) =>
  entity(m.id, m.name, marketScope(testIndex, m.id)),
);

const meta = {
  title: "Charts/RadarChart",
  component: RadarChart,
  args: { entities: regions, fmt },
  argTypes: { fmt: { control: false }, entities: { control: false } },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Entities: Story = { args: { entities: europe } };
