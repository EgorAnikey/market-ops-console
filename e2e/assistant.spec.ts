import { expect, test, type Page } from "@playwright/test";

const ask = async (page: Page, question: string) => {
  await page.getByLabel("Ask the assistant").fill(question);
  await page.keyboard.press("Enter");
};

test("streams a cited answer, and a source opens that market and month on the dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await ask(page, "Why did Germany's revenue dip in March?");

  const answer = page.getByRole("article", { name: "Assistant answer" });
  await expect(answer).toContainText("AI-generated");
  await expect(answer).toContainText("High confidence");
  const evidence = answer.getByRole("group", { name: "Evidence from source data" });
  await expect(evidence.getByRole("listitem")).toHaveCount(3);

  await evidence.getByRole("button", { name: /Show Germany, Mar 2026/ }).click();
  await expect(page).toHaveURL(/market=de/);
  await expect(page).toHaveURL(/period=2026-03/);
});

test("says it can't answer instead of inventing a forecast", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Will sales grow next year?" }).click();
  await expect(page.getByText("Can't be answered from this data")).toBeVisible();
  await expect(page.getByRole("article").getByText("Low confidence", { exact: true })).toBeVisible();
});

test("Stop keeps the partial answer and doesn't present it as sourced", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Give me a full portfolio summary" }).click();
  const answer = page.getByRole("article", { name: "Assistant answer" });
  await expect(answer).toContainText("Here's the portfolio");
  await page.getByRole("button", { name: "Stop generating" }).click();

  await expect(answer).toContainText("Stopped: partial answer");
  await expect(answer).not.toContainText("Ask me about any of them");
  await expect(answer.getByRole("group", { name: "Evidence from source data" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Send question" })).toBeVisible();
});

test("a long conversation scrolls inside the panel and never stretches the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?region=eu&market=es", { waitUntil: "networkidle" });
  await page.getByRole("region", { name: "Markets map" }).getByRole("button").first().waitFor();
  const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight);
  const before = await pageHeight();
  const answers = page.getByRole("article", { name: "Assistant answer" });

  for (let i = 0; i < 5; i++) {
    await ask(page, "Why did Germany's revenue dip in March?");
    await expect(answers.nth(i)).toContainText("High confidence");
  }
  expect(await pageHeight()).toBe(before);
});
