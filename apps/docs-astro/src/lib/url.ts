import type { Locale } from "../content.config";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A site path with the base path and, for Malay, the `/ms` prefix. */
export function href(path: string, locale: Locale = "en"): string {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${base}${prefix}${path}`;
}
