import { getCollection, type CollectionEntry } from "astro:content";
import { idFromPath, type Locale } from "../content.config";
import { href } from "./url";

export interface NavLink {
  title: string;
  href: string;
  id: string;
}
export interface NavSection {
  title: string;
  links: NavLink[];
}

/** `meta.<locale>.json` files, keyed by the folder they sit in (e.g. `develop`). */
const metas = import.meta.glob<{ title: string; pages: string[] }>(
  "../content/docs/*/meta.*.json",
  { eager: true, import: "default" },
);

function metaFor(folder: string, locale: Locale) {
  return (
    metas[`../content/docs/${folder}/meta.${locale}.json`] ??
    metas[`../content/docs/${folder}/meta.en.json`]
  );
}

/**
 * Sidebar for one top-level folder, in `meta.json` order. `---Title---`
 * entries start a section. Pages not migrated yet are left out, as are
 * sections with nothing in them.
 */
export async function getSidebar(
  folder: string,
  locale: Locale,
): Promise<NavSection[]> {
  const meta = metaFor(folder, locale);
  if (!meta) return [];

  const entries = await getCollection("docs");
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  const sections: NavSection[] = [];
  let current: NavSection = { title: meta.title, links: [] };
  for (const page of meta.pages) {
    const heading = page.match(/^---\s*(.+?)\s*---$/);
    if (heading) {
      if (current.links.length) sections.push(current);
      current = { title: heading[1], links: [] };
      continue;
    }
    const slug = idFromPath(`${folder}/${page.replace(/\/$/, "")}.mdx`).replace(
      /^en\//,
      "",
    );
    const entry: CollectionEntry<"docs"> | undefined =
      byId.get(`${locale}/${slug}`) ?? byId.get(`en/${slug}`);
    if (!entry) continue;
    current.links.push({
      title: entry.data.title,
      id: slug,
      href: href(`/docs/${slug}`, locale),
    });
  }
  if (current.links.length) sections.push(current);
  return sections;
}
