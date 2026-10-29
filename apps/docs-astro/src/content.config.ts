import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const locales = ["en", "ms"] as const;
export type Locale = (typeof locales)[number];

/**
 * Files keep the Fumadocs layout: `(group)` folders are left out of the URL
 * and `foo.ms.mdx` is the Malay sibling of `foo.mdx`. The id is
 * `<locale>/<slug>`, e.g. `en/develop/button`.
 */
export function idFromPath(entry: string): string {
  const parts = entry
    .replace(/\.mdx?$/, "")
    .split("/")
    .filter((part) => !/^\(.+\)$/.test(part));
  let file = parts.pop()!;
  let locale: Locale = "en";
  if (file.endsWith(".ms")) {
    locale = "ms";
    file = file.slice(0, -".ms".length);
  }
  if (file !== "index") parts.push(file);
  return [locale, ...parts].join("/");
}

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/docs",
    generateId: ({ entry }) => idFromPath(entry),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    source: z.url().optional(),
  }),
});

export const collections = { docs };
