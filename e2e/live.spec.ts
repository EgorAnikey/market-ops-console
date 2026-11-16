import { expect, test } from "@playwright/test";

test("live mode updates the month in progress without touching what the reader selected", async ({
  page,
}) => {
  await page.goto("/?view=analyst&region=eu&focus=de,fr");
  const kpis = page.getByRole("region", { name: "Key metrics" });
  await kpis.waitFor();
  const before = await kpis.textContent();

  await page.getByRole("button", { name: "Live" }).click();
  await expect(page.getByRole("button", { name: "Live" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/^Updated /)).toBeVisible();
  await expect.poll(() => kpis.textContent(), { timeout: 10_000 }).not.toBe(before);

  const url = new URL(page.url());
  expect(url.searchParams.get("region")).toBe("eu");
  expect(url.searchParams.get("focus")).toBe("de,fr");
  expect(url.searchParams.get("live")).toBe("true");
  await expect(page.getByText(/^Focused: Germany, France/)).toBeVisible();
});
