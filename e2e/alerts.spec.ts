import { expect, test, type Page } from "@playwright/test";

const openForm = async (page: Page, name: string) => {
  await page.goto("/?view=analyst");
  const nameField = page.getByLabel("Rule name");
  await nameField.scrollIntoViewIfNeeded();
  await expect(nameField).toBeEditable();
  await nameField.fill(name);
  await page.getByRole("combobox", { name: "Applies to" }).click();
  await page.getByRole("option", { name: "Europe" }).click();
  await page.getByRole("combobox", { name: "Severity" }).click();
  await page.getByRole("option", { name: "Critical" }).click();
};

const alertList = (page: Page) => page.getByRole("region", { name: /Active alerts/ });

test("a saved alert shows up at once, is stored as entered, and is still there after a reload", async ({
  page,
}) => {
  const name = `Europe watch ${Date.now()}`;
  await openForm(page, name);
  const saved = page.waitForResponse(
    (r) => r.url().endsWith("/api/alerts") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Save alert" }).click();

  await expect(alertList(page)).toContainText(name);
  await expect(page.getByRole("button", { name: "Saving…" })).toBeVisible();
  expect((await saved).status()).toBe(201);
  expect((await saved).request().postDataJSON()).toMatchObject({
    name,
    scope: "region:eu",
    severity: "critical",
  });

  await page.reload();
  const item = alertList(page).getByRole("listitem").filter({ hasText: name });
  await expect(item).toContainText("critical");
  await expect(item).toContainText(/Triggered by .*Germany/);
});

test("when the server rejects an alert, the list rolls back and the input is kept", async ({ page }) => {
  const name = `Failing watch ${Date.now()}`;
  await openForm(page, name);
  await page.getByLabel("Demo: simulate a server failure").check();
  await page.getByRole("button", { name: "Save alert" }).click();

  await expect(alertList(page)).toContainText(name);
  await expect(page.getByRole("alert").filter({ hasText: "Not saved." })).toBeVisible();
  await expect(alertList(page)).not.toContainText(name);
  await expect(page.getByLabel("Rule name")).toHaveValue(name);
});

test("an invalid rule can't be saved and says which field is wrong", async ({ page }) => {
  await openForm(page, `Duplicate ${Date.now()}`);
  await page.getByRole("combobox", { name: "Condition 1 metric" }).click();
  await page.getByRole("option", { name: "Forecast attainment" }).click();
  let posted = false;
  page.on("request", (r) => r.url().endsWith("/api/alerts") && r.method() === "POST" && (posted = true));
  await page.getByRole("button", { name: "Save alert" }).click();

  await expect(page.getByText("Duplicate condition")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Condition 2 metric" })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(posted).toBe(false);
});
