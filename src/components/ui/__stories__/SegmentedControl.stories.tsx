import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { SegmentedControl } from "../SegmentedControl";

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl<string>,
  args: {
    label: "Audience view",
    value: "executive",
    options: [
      { value: "executive", label: "Executive" },
      { value: "analyst", label: "Analyst" },
    ],
    onChange: () => undefined,
    size: "md",
  },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  render: function Render(args) {
    const [, update] = useArgs();
    return <SegmentedControl {...args} onChange={(value) => update({ value })} />;
  },
} satisfies Meta<typeof SegmentedControl<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Size: Story = { args: { size: "sm" } };
