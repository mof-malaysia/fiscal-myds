import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { LogoCloud } from "@mof-malaysia/myds-react/logo-cloud";

/**
 * ### Overview
 * A quiet row of agency or partner logos, greyed and faded at rest and full
 * colour on hover or focus. Every logo needs `alt` text naming the agency.
 *
 * ### Usage
 * ```tsx
 * <LogoCloud
 *   title="Agencies using this service"
 *   logos={[{ src: "/lhdn.svg", alt: "Lembaga Hasil Dalam Negeri" }]}
 * />
 * ```
 */
const meta: Meta<typeof LogoCloud> = {
  title: "Marketing/Blocks/LogoCloud",
  component: LogoCloud,
  parameters: { layout: "fullscreen" },
};

export default meta;

// Placeholder wordmarks so the story has no external image dependency.
const wordmark = (text: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="48" viewBox="0 0 140 48"><circle cx="22" cy="24" r="14" fill="${color}"/><text x="44" y="30" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#3F3F46">${text}</text></svg>`,
  )}`;

const logos = [
  {
    src: wordmark("LHDN", "#2563EB"),
    alt: "Lembaga Hasil Dalam Negeri",
    href: "#",
  },
  {
    src: wordmark("JKDM", "#15803D"),
    alt: "Jabatan Kastam Diraja Malaysia",
    href: "#",
  },
  {
    src: wordmark("ANM", "#B91C1C"),
    alt: "Jabatan Akauntan Negara Malaysia",
    href: "#",
  },
  { src: wordmark("JPJ", "#A16207"), alt: "Jabatan Pengangkutan Jalan" },
  { src: wordmark("KWAP", "#1D4ED8"), alt: "Kumpulan Wang Persaraan" },
  { src: wordmark("BNM", "#3F3F46"), alt: "Bank Negara Malaysia" },
];

const Standard = () => (
  <LogoCloud title="Agencies using this service" logos={logos} />
);
export const Default = createRender(Standard);

export const WithoutTitle = createRender(() => (
  <LogoCloud aria-label="Partner agencies" logos={logos.slice(0, 4)} />
));

export const FullColour = createRender(() => (
  <LogoCloud title="Agencies using this service" logos={logos} muted={false} />
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Standard />
    </div>
  ),
  "dark",
);
