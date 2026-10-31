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

/**
 * Open a story on its own and wait until its scripts have set it up: every
 * control marked `data-ftds-requires-js` is shown by `onEach` once setup ran.
 */
export async function openStory(page: Page, id: string, query = "") {
  await page.goto(`/iframe.html?id=${id}&viewMode=story${query}`);
  await page
    .locator("#storybook-root > *")
    .first()
    .waitFor({ state: "attached" });
  // A story whose component threw renders Storybook's error box, which
  // would otherwise pass every check
  const error = page.getByText("Error rendering Astro component");
  if ((await error.count()) > 0) {
    throw new Error(
      `${id} failed to render: ${await page.locator("#storybook-root pre").innerText()}`,
    );
  }
  await page.waitForFunction(
    () =>
      !document.querySelector(
        "#storybook-root [data-ftds-requires-js][hidden]",
      ),
  );
}
