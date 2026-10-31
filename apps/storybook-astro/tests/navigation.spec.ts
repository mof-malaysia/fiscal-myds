import { expect, test } from "@playwright/test";
import { openStory } from "./story";

test.describe("navbar on desktop", () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test("dropdown opens, arrows move in, Escape returns focus", async ({
    page,
  }) => {
    await openStory(page, "marketing-navbar--standard");
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
    await expect(
      page.getByRole("link", { name: "Lembaga Hasil Dalam Negeri" }),
    ).toBeVisible();
    await page.mouse.click(5, 600);
    await expect(
      page.getByRole("link", { name: "Lembaga Hasil Dalam Negeri" }),
    ).toBeHidden();
  });

  test("the current page is marked", async ({ page }) => {
    await openStory(page, "marketing-navbar--standard");
    await expect(page.locator('[aria-current="page"]').first()).toHaveText(
      /Utama/,
    );
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
    await expect
      .poll(() =>
        page.evaluate(() =>
          document
            .querySelector("[data-ftds-navbar-panel]:popover-open")
            ?.contains(document.activeElement),
        ),
      )
      .toBe(true);
    await page.keyboard.press("Escape");
    await expect(
      page.locator("[data-ftds-navbar-panel]:popover-open"),
    ).toHaveCount(0);
    await expect(menu).toBeFocused();
  });
});

test("carousel: next, previous and arrow keys move between slides", async ({
  page,
}) => {
  await openStory(page, "marketing-carousel--default");
  const prev = page.locator("[data-ftds-carousel-prev]");
  const next = page.locator("[data-ftds-carousel-next]");
  await expect(prev).toBeDisabled();
  const dots = page.locator("[data-ftds-carousel-dots] [aria-current]");
  await next.click();
  await expect(dots).toHaveCount(1);
  const current = () =>
    dots
      .first()
      .evaluate((dot) => [...dot.parentElement!.children].indexOf(dot));
  await expect.poll(current).toBe(1);
  await expect(prev).toBeEnabled();
  await prev.click();
  await expect.poll(current).toBe(0);
  await page.locator("[data-ftds-carousel-track]").focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(current).toBe(1);
});

test("carousel: autoplay has a pause button and stops when paused", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openStory(page, "marketing-carousel--autoplay");
  const play = page.locator("[data-ftds-carousel-play]");
  await expect(play).toBeVisible();
  const label = await play.getAttribute("aria-label");
  await play.click();
  await expect(play).not.toHaveAttribute("aria-label", label ?? "");
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
