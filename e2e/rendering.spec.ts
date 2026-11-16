import { expect, test } from "@playwright/test";

test("a chosen number format is rendered by the server after a reload, with no hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await page.getByRole("combobox", { name: "Number and date format" }).click();
  await page.getByRole("option", { name: "Deutsch" }).click();
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("Mio.");

  const html = await (await page.request.get("/")).text();
  expect(html).toContain("Mio.");
  await page.reload();
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("Mio.");
  expect(errors.filter((e) => /hydrat/i.test(e))).toEqual([]);
});

for (const [label, width, query] of [
  ["desktop", 1440, ""],
  ["live mode on load", 1440, "&live=true"],
] as const) {
  test(`server HTML is hydrated, not thrown away (${label})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/?view=analyst&region=eu&market=de${query}`, { waitUntil: "commit" });
    const table = await page.waitForSelector("table caption");
    await page.waitForLoadState("load");
    await page.waitForTimeout(1500);
    expect(await table.evaluate((n) => n.isConnected)).toBe(true);
  });
}
