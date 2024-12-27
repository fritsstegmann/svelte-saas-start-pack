import { expect, test } from "@playwright/test";

test("exspect signin to have username and password input", async ({ page }) => {
    await page.goto("/signin");

    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();

    await page.locator("button").click();

    await expect(page.locator(".text-red-500")).toBeVisible();
});
