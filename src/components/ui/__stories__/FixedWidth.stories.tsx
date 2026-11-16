import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { Button } from "../Button";
import { FixedWidth } from "../FixedWidth";

const meta = {
  title: "UI/FixedWidth",
  component: FixedWidth,
  args: { samples: ["$888.8K"], align: "start", children: "$10.8K" },
  argTypes: { align: { control: "inline-radio", options: ["start", "end"] } },
  parameters: {
    docs: {
      description: {
        component:
          "Reserves the width of the widest value a slot can show, so text after a changing number never moves.",
      },
    },
  },
  render: function Render(args) {
    const [, update] = useArgs();
    const next = () => update({ children: `$${(Math.random() * 400).toFixed(1)}K` });
    return (
      <div className="flex flex-col items-start gap-3 text-sm">
        <p className="num">
          <FixedWidth {...args} /> behind forecast.
        </p>
        <Button onClick={next}>Change the value</Button>
      </div>
    );
  },
} satisfies Meta<typeof FixedWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Align: Story = { args: { align: "end", samples: ["88"], children: "8" } };
