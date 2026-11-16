import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { Button } from "../Button";
import { Dialog } from "../Dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  args: {
    open: false,
    title: "Top risks · May 2026",
    onClose: () => undefined,
    children: <p className="py-2 text-sm">Germany, Spain, Italy, United Kingdom, Brazil, France</p>,
  },
  render: function Render(args) {
    const [, update] = useArgs();
    return (
      <>
        <Button onClick={() => update({ open: true })}>Open</Button>
        <Dialog {...args} onClose={() => update({ open: false })} />
      </>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { open: true } };
