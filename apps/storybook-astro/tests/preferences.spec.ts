import { expect, test } from "@playwright/test";
import { openStory } from "./story";

test("cookie banner: decline is stored, announced and remembered", async ({
  page,
}) => {
  await openStory(page, "core-cookie-banner--default");
  const banner = page.getByRole("dialog");
  await expect(banner).toBeVisible();
  await page.evaluate(() =>
    document.addEventListener("ftds:cookie-consent", (e) => {
      (window as any).consent = (e as CustomEvent).detail.value;
    }),
  );
  await page.getByRole("button", { name: /Tolak/ }).click();
  expect(await page.evaluate(() => (window as any).consent)).toBe("declined");
  await expect(banner).toBeHidden();
  expect(
    await page.evaluate(() => localStorage.getItem("ftds-cookie-consent")),
  ).toBe("declined");
  await openStory(page, "core-cookie-banner--default");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("cookie banner: Escape hides it without saving a choice", async ({
  page,
}) => {
  await openStory(page, "core-cookie-banner--english");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: /Accept/ }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  expect(
    await page.evaluate(() => localStorage.getItem("ftds-cookie-consent-en")),
  ).toBeNull();
});

test("theme switch: toggles the theme and remembers it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await openStory(page, "core-theme-switch--english");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: /Theme/ });
  await expect(toggle).toBeVisible();
  await expect(html).not.toHaveClass(/\bdark\b/);
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(html).toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem("ftds-theme"))).toBe(
    "dark",
  );
  await openStory(page, "core-theme-switch--english");
  await expect(html).toHaveClass(/\bdark\b/);
});

test("theme switch: follows the system until a choice is saved", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openStory(page, "core-theme-switch--default");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
});
