import { expect, test, type Locator, type Page } from "@playwright/test";

const VIEWS = ["/", "/?view=analyst&region=eu"] as const;

const ready = (page: Page) =>
  page.getByRole("region", { name: "Markets map" }).getByRole("button").first().waitFor();

for (const [width, height] of [
  [320, 640],
  [768, 1024],
  [1280, 800],
] as const) {
  test(`no horizontal page scroll at ${width}px, even with a long alert name (WCAG 1.4.10)`, async ({
    page,
    request,
  }) => {
    await request.post("/api/alerts", {
      data: {
        name: `Quarterly-attainment-watch-for-every-European-market-${Date.now()}`,
        scope: "region:eu",
        match: "any",
        severity: "warning",
        conditions: [{ metric: "forecastAttainmentPct", operator: "lt", threshold: 95 }],
        channels: { inApp: true, email: false },
        recipients: [],
      },
    });
    await page.setViewportSize({ width, height });
    for (const url of VIEWS) {
      await page.goto(url);
      await ready(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), url).toBe(
        0,
      );
    }
  });
}

const emptyBelowScrollingTable = (panel: Locator) =>
  panel.evaluate((card) => {
    const scroller = card.querySelector("table")?.parentElement;
    if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return 0;
    return card.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom;
  });

for (const width of [390, 1280]) {
  test(`switching chart ↔ table never moves a page scrolled to the bottom (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const snapshot = () =>
      page.evaluate(() => `${document.documentElement.scrollHeight}@${Math.round(window.scrollY)}`);
    for (const url of VIEWS) {
      await page.goto(url);
      await ready(page);
      for (const toggle of await page.getByRole("radiogroup", { name: / display$/ }).all()) {
        const title = (await toggle.getAttribute("aria-label"))?.replace(/ display$/, "") ?? "";
        const panel = page.getByRole("region", { name: title, exact: true });
        for (const mode of ["Table", "Chart"]) {
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          const before = await snapshot();
          await toggle.getByRole("radio", { name: mode }).dispatchEvent("click");
          await expect(toggle.getByRole("radio", { name: mode })).toBeChecked();
          expect(await snapshot(), `${url} · ${title} → ${mode}`).toBe(before);
          if (mode === "Table") expect(await emptyBelowScrollingTable(panel), title).toBeLessThan(24);
        }
      }
    }
  });

  test(`nothing shifts the page once the dashboard has rendered (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.addInitScript(() => {
      const heights: number[] = [];
      Object.assign(window, { __heights: heights });
      const tick = () => {
        if (document.querySelector("main h2") && !document.querySelector('[aria-label="Loading console"]')) {
          const h = document.documentElement.scrollHeight;
          if (heights.at(-1) !== h) heights.push(h);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    for (const url of VIEWS) {
      await page.goto(url, { waitUntil: "networkidle" });
      await ready(page);
      await page.waitForTimeout(300);
      const heights = await page.evaluate(() => (window as unknown as { __heights: number[] }).__heights);
      expect(heights, url).toHaveLength(1);
    }
  });
}

test("the compare panel keeps its height as entities come and go", async ({ page }) => {
  await page.goto("/?view=analyst&region=eu");
  const card = page.getByRole("region", { name: "Compare", exact: true });
  await card.scrollIntoViewIfNeeded();
  const height = async () => (await card.boundingBox())?.height;
  const initial = await height();
  const remove = card.getByRole("button", { name: /^Remove / });

  while ((await remove.count()) > 1) {
    await remove.first().click();
    expect(await height()).toBe(initial);
  }
  for (const name of ["United States", "North America", "Australia"]) {
    await card.getByRole("combobox", { name: "Add to comparison" }).click();
    await page.getByRole("option", { name }).click();
    expect(await height()).toBe(initial);
  }
  await card.getByRole("button", { name: "Reset to Europe markets" }).click();
  await expect(remove).toHaveCount(5);
  expect(await height()).toBe(initial);
});
