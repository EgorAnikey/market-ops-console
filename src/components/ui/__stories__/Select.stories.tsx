import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useArgs } from "storybook/preview-api";
import { Select, type SelectItem } from "../Select";

const PERIODS: SelectItem[] = [
  { value: "2026-05", label: "May 2026 (latest)" },
  { value: "2026-04", label: "Apr 2026" },
  { value: "2026-03", label: "Mar 2026" },
];

const SCOPES: SelectItem[] = [
  { value: "portfolio", label: "Whole portfolio" },
  {
    label: "Regions",
    options: [
      { value: "region:eu", label: "Europe" },
      { value: "region:apac", label: "APAC" },
    ],
  },
  {
    label: "Markets",
    options: [
      { value: "market:de", label: "Germany" },
      { value: "market:jp", label: "Japan" },
    ],
  },
];

const meta = {
  title: "UI/Select",
  component: Select<string>,
  args: { "aria-label": "Period", value: "2026-05", options: PERIODS, onChange: () => undefined, size: "md" },
  argTypes: { size: { control: "inline-radio", options: ["sm", "md"] } },
  render: function Render(args) {
    const [, update] = useArgs();
    return <Select {...args} onChange={(value) => update({ value })} />;
  },
} satisfies Meta<typeof Select<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Options: Story = { args: { "aria-label": "Applies to", value: "portfolio", options: SCOPES } };
export const Placeholder: Story = { args: { value: null, placeholder: "+ Add…", className: "w-32" } };
export const Size: Story = { args: { size: "sm" } };
export const Invalid: Story = { args: { "aria-invalid": true } };
export const Disabled: Story = { args: { disabled: true } };
