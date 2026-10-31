/**
 * Built-in labels of the FTDS Astro components, in Bahasa Melayu and English.
 * Components pick the language from their `lang` prop, then the page's
 * `Astro.currentLocale`, then BM. Change a wording here once for the whole
 * site; add a language by adding a dictionary with the same keys.
 *
 * @example
 * ---
 * import { label, resolveLang } from "@/lib/ftds/i18n";
 * const lang = resolveLang(Astro.props.lang, Astro.currentLocale);
 * ---
 * <a href="#main">{label(lang, "skipToContent")}</a>
 */

const ms = {
  skipToContent: "Langkau ke kandungan utama",
  breadcrumb: "Serbuk roti",
  mastheadTitle: "Laman web rasmi Kerajaan Malaysia",
  mastheadTrigger: "Begini cara mengenalinya",
  mastheadOfficialTitle: "Laman web rasmi menggunakan .gov.my",
  mastheadOfficialBody:
    "Laman web kerajaan Malaysia menggunakan domain .gov.my. Pastikan alamat ini sebelum berkongsi maklumat.",
  mastheadSecureTitle: "Laman web yang selamat menggunakan HTTPS",
  mastheadSecureBody:
    "Cari ikon kunci atau https:// sebagai langkah berjaga-jaga. Kongsi maklumat sensitif hanya di laman web rasmi yang selamat.",
  phaseBannerText:
    "Ini perkhidmatan baharu. Maklum balas anda membantu kami menambah baiknya.",
  footerCopyright: "Hak cipta terpelihara",
  footerNav: "Kaki laman",
  learnMore: "Ketahui lanjut",
  navbarNav: "Navigasi utama",
  navbarMenu: "Menu",
  navbarClose: "Tutup",
  navbarViewAll: "Lihat semua",
  languageSwitcher: "Bahasa",
  carousel: "karusel",
  carouselSlide: "slaid",
  carouselPrevious: "Slaid sebelumnya",
  carouselNext: "Slaid seterusnya",
  carouselPause: "Jeda slaid",
  carouselPlay: "Main slaid",
  /** `{n}` is the slide number. */
  carouselGoTo: "Pergi ke slaid {n}",
  /** `{n}` is the slide number, `{count}` the number of slides. */
  carouselSlideOf: "{n} daripada {count}",
  dismiss: "Tutup",
  faqTitle: "Soalan lazim",
  cookieBannerTitle: "Kuki di laman web ini",
  cookieBannerBody:
    "Kami menggunakan kuki yang perlu untuk laman web ini berfungsi. Kami juga ingin menggunakan kuki analitik untuk memahami cara anda menggunakannya.",
  cookieAccept: "Terima kuki analitik",
  cookieDecline: "Tolak kuki analitik",
  cookieBannerClose: "Tutup sepanduk kuki",
  theme: "Tema",
  themeLight: "Cerah",
  themeDark: "Gelap",
} as const;

export type LabelKey = keyof typeof ms;

const en: Record<LabelKey, string> = {
  skipToContent: "Skip to main content",
  breadcrumb: "Breadcrumb",
  mastheadTitle: "Official website of the Government of Malaysia",
  mastheadTrigger: "Here's how you know",
  mastheadOfficialTitle: "Official websites use .gov.my",
  mastheadOfficialBody:
    "Malaysian government websites use the .gov.my domain. Check the address before you share information.",
  mastheadSecureTitle: "Secure websites use HTTPS",
  mastheadSecureBody:
    "Look for a lock icon or https:// as a precaution. Share sensitive information only on official, secure websites.",
  phaseBannerText: "This is a new service. Your feedback helps us improve it.",
  footerCopyright: "All rights reserved",
  footerNav: "Footer",
  learnMore: "Learn more",
  navbarNav: "Main navigation",
  navbarMenu: "Menu",
  navbarClose: "Close",
  navbarViewAll: "View all",
  languageSwitcher: "Language",
  carousel: "carousel",
  carouselSlide: "slide",
  carouselPrevious: "Previous slide",
  carouselNext: "Next slide",
  carouselPause: "Pause slides",
  carouselPlay: "Play slides",
  carouselGoTo: "Go to slide {n}",
  carouselSlideOf: "{n} of {count}",
  dismiss: "Dismiss",
  faqTitle: "Frequently asked questions",
  cookieBannerTitle: "Cookies on this website",
  cookieBannerBody:
    "We use essential cookies to make this website work. We would also like to use analytics cookies to understand how you use it.",
  cookieAccept: "Accept analytics cookies",
  cookieDecline: "Reject analytics cookies",
  cookieBannerClose: "Close cookie banner",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
};

export const labels = { ms, en } satisfies Record<
  string,
  Record<LabelKey, string>
>;

export type Lang = keyof typeof labels;

export const DEFAULT_LANG: Lang = "ms";

const isLang = (value: unknown): value is Lang =>
  typeof value === "string" && value in labels;

/** The first of `lang` and `locale` FTDS has labels for ("en-MY" counts as "en"), else BM. */
export function resolveLang(lang?: string, locale?: string): Lang {
  for (const candidate of [lang, locale]) {
    const base = candidate?.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }
  return DEFAULT_LANG;
}

/** A built-in label in `lang`. */
export function label(lang: Lang, key: LabelKey): string {
  return labels[lang][key];
}

/**
 * Fill `{name}` placeholders in a label, e.g.
 * `format(label(lang, "carouselSlideOf"), { n: 2, count: 5 })`. Plain
 * enough for client scripts too.
 */
export function format(
  text: string,
  values: Record<string, string | number>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
