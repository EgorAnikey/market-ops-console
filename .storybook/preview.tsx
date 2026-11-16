import type { Preview } from "@storybook/nextjs-vite";
import { TestProviders } from "@/test/TestProviders";
import "@/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    a11y: { test: "error" },
  },
  decorators: [
    (Story) => (
      <TestProviders hasMemory>
        <Story />
      </TestProviders>
    ),
  ],
};

export default preview;
