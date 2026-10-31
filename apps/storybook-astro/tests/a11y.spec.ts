import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { listStories, openStory } from "./story";

// Every story passes axe (WCAG 2.2 AA), as rendered and after its scripts ran
for (const story of listStories()) {
  test(`a11y: ${story.title} / ${story.name}`, async ({ page }) => {
    await openStory(page, story.id);
    const { violations } = await new AxeBuilder({ page })
      .include("#storybook-root")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`),
    ).toEqual([]);
  });
}
