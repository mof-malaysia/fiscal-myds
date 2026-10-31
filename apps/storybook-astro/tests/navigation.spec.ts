import { expect, test } from "@playwright/test";
import { openStory } from "./story";

test.describe("navbar on desktop", () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test("current page marked; dropdown opens, arrows move in, Escape returns focus", async ({
    page,
  }) => {
    await openStory(page, "marketing-navbar--standard");
    await expect(page.locator('[aria-current="page"]').first()).toHaveText(
      /Utama/,
    );
    const trigger = page.getByRole("button", { name: "Agensi" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const first = page.getByRole("link", {
      name: "Lembaga Hasil Dalam Negeri",
    });
    await expect(first).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      page.getByRole("link", { name: "Jabatan Kastam Diraja Malaysia" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(first).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("outside click closes the dropdown", async ({ page }) => {
    await openStory(page, "marketing-navbar--standard");
    await page.getByRole("button", { name: "Agensi" }).click();
    const link = page.getByRole("link", { name: "Lembaga Hasil Dalam Negeri" });
    await expect(link).toBeVisible();
    await page.mouse.click(5, 600);
    await expect(link).toBeHidden();
  });
});

test.describe("navbar on mobile", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("menu opens, takes focus, and closes back to the button", async ({
    page,
  }) => {
    await openStory(page, "marketing-navbar--standard");
    const menu = page.locator("[data-ftds-navbar-toggle]");
    await menu.click();
    const panel = page.locator("[data-ftds-navbar-panel]:popover-open");
    await expect(panel).toHaveCount(1);
    await expect(panel.locator(":focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(menu).toBeFocused();
  });
});

const dot = (page: import("@playwright/test").Page, n: number) =>
  page.locator("[data-ftds-carousel-dots] button").nth(n);

test("carousel: next, previous and arrow keys move between slides", async ({
  page,
}) => {
  await openStory(page, "marketing-carousel--default");
  const prev = page.locator("[data-ftds-carousel-prev]");
  const next = page.locator("[data-ftds-carousel-next]");
  await expect(prev).toBeDisabled();
  await next.click();
  await expect(dot(page, 1)).toHaveAttribute("aria-current", "true");
  await expect(prev).toBeEnabled();
  await prev.click();
  await expect(dot(page, 0)).toHaveAttribute("aria-current", "true");
  await page.locator("[data-ftds-carousel-track]").focus();
  await page.keyboard.press("ArrowRight");
  await expect(dot(page, 1)).toHaveAttribute("aria-current", "true");
});

test("carousel: autoplay advances, and pause stops it", async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openStory(page, "marketing-carousel--autoplay");
  // The story advances every 4 s
  await page.clock.runFor(4100);
  await expect(dot(page, 1)).toHaveAttribute("aria-current", "true");
  await page.locator("[data-ftds-carousel-play]").click();
  await page.clock.runFor(8200);
  await expect(dot(page, 1)).toHaveAttribute("aria-current", "true");
});

test("language switcher: links carry hreflang and mark the current one", async ({
  page,
}) => {
  await openStory(page, "core-language-switcher--default");
  const links = page.getByRole("link");
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("hreflang", /^(ms|en)$/);
  }
  await expect(page.locator('[aria-current="true"]')).toHaveCount(1);
});
