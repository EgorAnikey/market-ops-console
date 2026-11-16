import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { marketHealth } from "@/domain/health";
import { PORTFOLIO_SCOPE } from "@/domain/scope";
import { testIndex } from "@/test/dataset";
import { testFormatters as fmt } from "@/test/fixtures";
import { DataTable, type Column } from "../DataTable";
import { StatusBadge } from "../StatusBadge";

type Row = ReturnType<typeof marketHealth>[number];

const rows = marketHealth(testIndex, PORTFOLIO_SCOPE, testIndex.latestPeriod);
const columns: Column<Row>[] = [
  {
    id: "name",
    header: "Market",
    rowHeader: true,
    sortValue: (r) => r.market.name,
    cell: (r) => r.market.name,
  },
  {
    id: "revenue",
    header: "Revenue",
    align: "right",
    sortValue: (r) => r.kpis.revenue,
    cell: (r) => fmt.compactCurrency(r.kpis.revenue),
  },
  {
    id: "growth",
    header: "YoY",
    align: "right",
    sortValue: (r) => r.kpis.growthPct,
    cell: (r) => fmt.signedPercent(r.kpis.growthPct),
  },
  { id: "status", header: "Status", cell: (r) => <StatusBadge status={r.kpis.status} /> },
];

const meta = {
  title: "UI/DataTable",
  component: DataTable<Row>,
  args: {
    caption: "Markets by revenue",
    columns,
    rows,
    rowKey: (r) => r.market.id,
    initialSort: { id: "revenue", dir: "desc" },
  },
} satisfies Meta<typeof DataTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Rows: Story = { args: { rows: [] } };
export const InitialSort: Story = { args: { initialSort: { id: "growth", dir: "asc" } } };
