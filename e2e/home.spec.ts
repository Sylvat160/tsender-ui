import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("TSENDER");
});

test("shows connect wallet prompt when not connected", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Connect your wallet")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /connect wallet/i }),
  ).toBeVisible();
});
