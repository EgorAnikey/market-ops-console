import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { testFormatters as fmt } from "@/test/fixtures";
import { AnimatedNumber } from "../AnimatedNumber";
import { Button } from "../Button";

const meta = {
  title: "UI/AnimatedNumber",
  component: AnimatedNumber,
  args: { value: 22_900_000, format: fmt.compactCurrency, revision: 0 },
  argTypes: { format: { control: false } },
  parameters: {
    docs: {
      description: { component: "Counts to a new value only when `revision` changes with it (a live tick)." },
    },
  },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Revision: Story = {
  render: function Render(args) {
    const [, update] = useArgs();
    const tick = () =>
      update({
        value: Math.round((args.value ?? 0) * (0.97 + Math.random() * 0.06)),
        revision: args.revision + 1,
      });
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="num text-2xl font-semibold">
          <AnimatedNumber {...args} />
        </p>
        <Button onClick={tick}>Next revision</Button>
      </div>
    );
  },
};
