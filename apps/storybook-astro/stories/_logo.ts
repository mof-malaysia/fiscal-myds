/** Placeholder logo as an inline SVG data URI, so stories need no assets. */
export const logo = (text: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48" viewBox="0 0 160 48"><rect width="160" height="48" rx="8" fill="#2563eb"/><text x="80" y="30" font-family="sans-serif" font-size="18" font-weight="600" fill="#fff" text-anchor="middle">${text}</text></svg>`,
  )}`;

/** Example data and placeholders shared with the page templates. */
export {
  agencies,
  brand,
  helpline,
  jataNegara,
  leadership,
  news,
  offices,
  placeholder,
} from "../../../packages/astro/src/templates/site";
