import { expect, test } from "@playwright/test";
import { openStory } from "./story";

test("accordion: single mode keeps one item open", async ({ page }) => {
  await openStory(page, "marketing-accordion--default");
  const items = page.locator("details");
  const summaries = page.locator("details > summary");
  await summaries.nth(0).focus();
  await page.keyboard.press("Enter");
  await expect(items.nth(0)).toHaveAttribute("open", "");
  await summaries.nth(1).focus();
  await page.keyboard.press("Space");
  await expect(items.nth(1)).toHaveAttribute("open", "");
  await expect(items.nth(0)).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(items.nth(1)).not.toHaveAttribute("open", "");
});

test("accordion: multiple mode opens items independently", async ({ page }) => {
  // The story opens the first and last items
  await openStory(page, "marketing-accordion--multiple");
  await page.locator("details > summary").nth(1).click();
  await expect(page.locator("details[open]")).toHaveCount(3);
});

test("faq: the section is labelled by its heading", async ({ page }) => {
  await openStory(page, "marketing-faq--default");
  const section = page.locator("section[aria-labelledby]");
  const id = await section.getAttribute("aria-labelledby");
  await expect(page.locator(`[id="${id}"]`)).toHaveText(/\S/);
});

test("callout: dismiss removes it and moves focus on", async ({ page }) => {
  await openStory(page, "core-callout--with-dismiss");
  await page.evaluate(() => {
    const next = document.createElement("button");
    next.textContent = "Seterusnya";
    document.querySelector("#storybook-root")!.append(next);
  });
  const close = page.getByRole("button", { name: "Tutup" });
  await expect(close).toBeVisible();
  await close.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-ftds-callout-dismissible]")).toHaveCount(0);
  // Focus moves to the next focusable element, not lost on <body>
  await expect(page.getByRole("button", { name: "Seterusnya" })).toBeFocused();
});
