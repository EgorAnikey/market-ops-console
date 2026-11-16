import { composeStory, setProjectAnnotations, type Meta, type StoryObj } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import preview from "../../.storybook/preview";

setProjectAnnotations(preview);

type StoryModule = { default: Meta } & Record<string, StoryObj>;
const modules = import.meta.glob<StoryModule>("../**/__stories__/*.stories.tsx", { eager: true });

describe.each(Object.entries(modules))("%s", (_, { default: meta, ...stories }) => {
  it.each(Object.entries(stories))("%s renders", (_, story) => {
    const Story = composeStory(story, meta);
    const { container } = render(<Story />);
    expect(container.childElementCount).toBeGreaterThan(0);
  });
});
