import { expect, test } from "@playwright/test";
import { openStory } from "./story";

test("tabs: arrow keys, Home and End move and activate", async ({ page }) => {
  await openStory(page, "core-tabs--default");
  const tabs = page.getByRole("tab");
  // The underline sits under the active tab from the start
  await expect(page.locator("[data-ftds-tabs-indicator]")).toHaveAttribute(
    "style",
    /--active-tab-width: [1-9]\d*px/,
  );
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveText(/Tiga dokumen/);
  await page.keyboard.press("End");
  await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.last()).toBeFocused();
});

test("tabs: manual activation waits for Enter", async ({ page }) => {
  await openStory(page, "core-tabs--manual-activation");
  const tabs = page.getByRole("tab");
  await tabs.nth(1).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
});

test("tabs: only the active panel shows, no-JS labels hidden", async ({
  page,
}) => {
  await openStory(page, "core-tabs--default");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.locator("[data-ftds-tabs-label]:visible")).toHaveCount(0);
});
