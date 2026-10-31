import { expect, test } from "@playwright/test";
import { listStories, openStory } from "./story";

// Page templates are whole pages: one h1, one main landmark, and a skip link
// (where the page has one) that lands on it
for (const story of listStories().filter((s) =>
  s.title.startsWith("Marketing/Templates/"),
)) {
  test(`template: ${story.title} / ${story.name}`, async ({ page }) => {
    await openStory(page, story.id);
    const root = page.locator("#storybook-root");
    await expect(root.locator("h1")).toHaveCount(1);
    await expect(root.getByRole("main")).toHaveCount(1);

    const skip = root.locator('a[href="#main"]');
    if ((await skip.count()) > 0) {
      await expect(root.locator("main#main")).toHaveCount(1);
    }
  });
}
