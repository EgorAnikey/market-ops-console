import { expect, test } from "@playwright/test";

test("clicking a country on the map drills in, and Back walks the path", async ({ page }) => {
  await page.goto("/");
  const crumbs = page.getByRole("navigation", { name: "Drill path" });
  await page.getByRole("button", { name: /^Germany: YoY growth/ }).click();

  await expect(page).toHaveURL(/region=eu&market=de|market=de.*region=eu/);
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText("Germany");
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("1 of 1");

  await page.goBack();
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText("Portfolio");
  await expect(page.getByRole("region", { name: "Key metrics" })).toContainText("of 13");
});

test("a shared link opens the exact view, already in the server HTML", async ({ page, request }) => {
  const url = "/?view=analyst&region=eu&market=de&period=2026-03";
  const html = await (await request.get(url)).text();
  expect(html).toContain('aria-current="page" class="font-semibold text-fg">Germany');
  expect(html).toContain("Breakdown by product");

  await page.goto(url);
  await expect(page.getByRole("radio", { name: "Analyst" })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("combobox", { name: "Period", exact: true })).toHaveText("Mar 2026");
  await expect(page.getByRole("slider", { name: /Germany revenue over time/ })).toHaveAttribute(
    "aria-valuetext",
    /March 2026/,
  );
});

test("picking a period moves the time-series and the radar with it", async ({ page }) => {
  await page.goto("/?view=analyst&region=eu");
  const radar = page.getByRole("region", { name: "Compare", exact: true });
  await radar.getByRole("radio", { name: "Table" }).click();
  const radarBefore = await radar.getByRole("table").textContent();

  await page.getByRole("combobox", { name: "Period", exact: true }).click();
  await page.getByRole("option", { name: "Mar 2026" }).click();

  await expect(page).toHaveURL(/period=2026-03/);
  await expect(page.getByRole("slider", { name: /Europe revenue over time/ })).toHaveAttribute(
    "aria-valuetext",
    /March 2026/,
  );
  await expect.poll(() => radar.getByRole("table").textContent()).not.toBe(radarBefore);
  await expect(radar.getByRole("row", { name: /Germany/ })).toContainText("-31.0%");
});

test("brushing the scatter narrows the breakdown table, and clearing restores it", async ({ page }) => {
  await page.goto("/?view=analyst&region=eu");
  const scatter = page.getByRole("group", { name: /Growth versus market share/ });
  await scatter.scrollIntoViewIfNeeded();
  const box = await scatter.boundingBox();
  if (!box) throw new Error("scatter not laid out");
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.08);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.97, box.y + box.height * 0.85, { steps: 8 });
  await page.mouse.up();

  await expect(page).toHaveURL(/focus=/);
  const breakdown = page.getByRole("table", { name: "KPIs by market" });
  await expect(breakdown).not.toContainText("Germany");
  await expect(page.getByText(/narrowed by scatter selection/)).toBeVisible();

  await page.getByRole("button", { name: "Clear market focus" }).click();
  await expect(breakdown).toContainText("Germany");
});

test("the command palette jumps straight to a market", async ({ page }) => {
  await page.goto("/");
  const search = page.getByPlaceholder("Search markets, regions, products…");
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(search).toBeVisible({ timeout: 1_000 });
  }).toPass();
  await search.fill("japan");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/market=jp/);
});
