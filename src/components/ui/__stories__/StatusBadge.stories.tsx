import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { STATUSES } from "@/contracts/dataset";
import { StatusBadge } from "../StatusBadge";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  args: { status: "on_track" },
  argTypes: { status: { control: "inline-radio", options: STATUSES } },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Status: Story = {
  render: () => (
    <div className="flex gap-2">
      {STATUSES.map((s) => (
        <StatusBadge key={s} status={s} />
      ))}
    </div>
  ),
};
