import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`)).toEqual([]);
}

const mapReady = (page: Page) =>
  page.getByRole("region", { name: "Markets map" }).getByRole("button").first().waitFor();

for (const scheme of ["light", "dark"] as const) {
  test(`both views pass WCAG 2.2 AA in the ${scheme} theme, charts and tables alike`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await mapReady(page);
    await expectNoViolations(page);

    await page.goto("/?view=analyst&region=eu");
    await mapReady(page);
    await expectNoViolations(page);
    for (const toggle of await page.getByRole("radio", { name: "Table" }).all()) await toggle.click();
    await expectNoViolations(page);
  });
}

test("cited, abstained and failed answers pass WCAG 2.2 AA", async ({ page }) => {
  await page.goto("/");
  const ask = async (q: string, done: string) => {
    await page.getByLabel("Ask the assistant").fill(q);
    await page.keyboard.press("Enter");
    await page.getByText(done).last().waitFor();
  };
  await ask("Why did Germany's revenue dip in March?", "Source data · 3 records");
  await ask("Will sales grow next year?", "Can't be answered from this data");
  await ask("force error", "No answer generated");
  await expectNoViolations(page);
});

test("a keyboard-only user can drill in from the map and step through months", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Germany: YoY growth/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/market=de/);

  const slider = page.getByRole("slider", { name: /Germany revenue over time/ });
  await slider.focus();
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/period=2026-03/);
  await expect(slider).toHaveAttribute("aria-valuetext", /March 2026/);
});

test("drilling never drops focus and announces the new location", async ({ page }) => {
  await page.goto("/?region=eu&market=de");
  await page.getByRole("navigation", { name: "Drill path" }).getByRole("button", { name: "Europe" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('[aria-current="page"]')).toBeFocused();
  await expect(page.getByRole("status").filter({ hasText: "Showing Europe" })).toContainText(
    "Europe, May 2026",
  );
  await expect(page).toHaveTitle(/^Europe, May 2026 · Market Ops/);
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the assistant drawer is a real modal: focus moves in, Escape closes it and returns focus", async ({
    page,
  }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Ask", exact: true });
    await open.click();
    await expect(page.getByRole("dialog", { name: /Assistant/ })).toHaveAttribute("aria-modal", "true");
    await expect(page.getByLabel("Ask the assistant")).toBeFocused();
    expect(await page.locator("#main").evaluate((el) => el.closest("[inert]") !== null)).toBe(true);
    await expectNoViolations(page);

    await page.keyboard.press("Escape");
    await expect(page.getByLabel("Ask the assistant")).toBeHidden();
    await expect(open).toBeFocused();
  });
});
