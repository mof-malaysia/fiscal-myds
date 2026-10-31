import type { Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/** Every story in the built Storybook (dist/index.json). */
export function listStories(): { id: string; title: string; name: string }[] {
  const index = JSON.parse(
    fs.readFileSync(
      path.join(import.meta.dirname, "../dist/index.json"),
      "utf-8",
    ),
  );
  return Object.values(index.entries as Record<string, any>).filter(
    (entry) => entry.type === "story",
  );
}

/** Open a story on its own and wait until its scripts have set it up. */
export async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page
    .locator("#storybook-root > *")
    .first()
    .waitFor({ state: "attached" });
  await page.waitForLoadState("networkidle");
}
