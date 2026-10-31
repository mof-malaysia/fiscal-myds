import { cva } from "class-variance-authority";

/**
 * Classes for the cookie banner panel, shared by the React and Astro
 * components so both stacks render the same. Edit here, not in the
 * component. The registry installs this file as
 * components/ui/cookie-banner.variants.ts.
 *
 * No open / close animation here: React adds its own on Base UI's
 * `data-open` / `data-closed`; the Astro banner just shows.
 */
export const cookie_content_cva = cva([
  "bg-bg-white p-4.5 shadow-card border-otl-gray-200 fixed bottom-0 right-0 z-banner max-w-[500px]",
  "space-y-1 rounded-lg border outline-none",
  "sm:mb-4 sm:mr-4 sm:p-6",
]);
