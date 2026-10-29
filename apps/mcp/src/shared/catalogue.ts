import type { ModuleExports } from "./check";

/** What scripts/catalogue.ts writes to src/generated/catalogue.json. */
export interface Catalogue {
  /** FTDS release the catalogue was built from, or "main". */
  version: string;
  docsUrl: string;
  /** llms.txt up to the guides: what FTDS is and the rules that matter most. */
  intro: string;
  sections: {
    category: string;
    items: { name: string; title: string; description: string }[];
  }[];
  /** Item name → its llms page (props, examples, rules). */
  pages: Record<string, string>;
  guides: { slug: string; title: string; body: string }[];
  icons: { name: string; export: string; import: string }[];
  modules: ModuleExports;
}
