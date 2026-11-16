import { expect, test } from "@playwright/test";

test.describe("signed out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("SSO sign-in returns you to the exact link you opened, and sign-out ends the session", async ({
    page,
  }) => {
    await page.goto("/?view=analyst&region=eu&market=de");
    await expect(page).toHaveURL(/\/signin\?returnTo=/);
    await page.getByRole("button", { name: /Dana Reyes/ }).click();

    await expect(page).toHaveURL(/\/\?view=analyst&region=eu&market=de$/);
    await expect(
      page.getByRole("navigation", { name: "Drill path" }).locator('[aria-current="page"]'),
    ).toHaveText("Germany");

    await page.getByRole("button", { name: /^Sign out Dana Reyes/ }).click();
    await expect(page).toHaveURL(/\/signin$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/signin/);
  });

  test("the data APIs refuse anyone who isn't signed in", async ({ request }) => {
    expect(
      (await request.post("/api/chat", { data: { question: "Which markets are at risk?" } })).status(),
    ).toBe(401);
    expect((await request.get("/api/live")).status()).toBe(401);
    expect((await request.get("/api/alerts")).status()).toBe(401);
    expect((await request.get("/api/health")).status()).toBe(200);
  });
});

test.describe("signed in as a viewer", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("sees alert rules read-only, and the API refuses changes too", async ({ page, baseURL }) => {
    await page.context().addCookies([{ name: "mo.session", value: "sam", url: baseURL ?? "" }]);
    await page.goto("/?view=analyst");
    await expect(page.getByText("Alert rules are read-only for you")).toBeVisible();
    await expect(page.getByLabel("Rule name")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Delete alert/ })).toHaveCount(0);

    const create = await page.request.post("/api/alerts", {
      data: {
        name: "Sneaky rule",
        scope: "portfolio",
        match: "any",
        severity: "warning",
        conditions: [{ metric: "growthPct", operator: "lt", threshold: 0 }],
        channels: { inApp: true, email: false },
        recipients: [],
      },
    });
    expect(create.status()).toBe(403);
    expect((await page.request.delete("/api/alerts/seed-eu-attainment")).status()).toBe(403);
  });
});
