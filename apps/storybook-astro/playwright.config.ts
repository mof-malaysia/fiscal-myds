import { defineConfig } from "@playwright/test";

/**
 * Accessibility and keyboard tests for the FTDS Astro components, run against
 * the static Storybook build (`pnpm build` first): the same pre-rendered
 * HTML and bundled scripts that get published.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://127.0.0.1:6009" },
  webServer: {
    command: "python3 -m http.server 6009 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:6009/index.json",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "ignore",
  },
});
