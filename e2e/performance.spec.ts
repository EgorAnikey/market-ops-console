import { expect, test } from "@playwright/test";

const FIRST_LOAD_JS_BUDGET_KB = { "/": 330, "/?view=analyst": 375 } as const;

for (const [url, budget] of Object.entries(FIRST_LOAD_JS_BUDGET_KB)) {
  test(`first load of ${url} stays within ${budget} KB of compressed JavaScript`, async ({ page }) => {
    const sizes: Promise<number>[] = [];
    page.on("requestfinished", (request) => {
      if (request.resourceType() === "script") sizes.push(request.sizes().then((s) => s.responseBodySize));
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.getByRole("region", { name: "Markets map" }).getByRole("button").first().waitFor();

    const kb = (await Promise.all(sizes)).reduce((sum, bytes) => sum + bytes, 0) / 1024;
    test
      .info()
      .annotations.push({ type: "first-load JS", description: `${kb.toFixed(1)} KB of ${budget} KB` });
    expect(kb).toBeLessThanOrEqual(budget);
  });
}
