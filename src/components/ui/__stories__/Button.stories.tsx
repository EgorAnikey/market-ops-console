import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Save alert", variant: "secondary", size: "md", disabled: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "icon"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Variant: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {(["primary", "secondary", "ghost", "danger"] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const Size: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true } };
