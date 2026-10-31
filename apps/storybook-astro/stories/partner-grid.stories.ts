import PartnerGrid from "@/components/blocks/partner-grid.astro";
import { agencies } from "./_logo";

export default {
  title: "Marketing/Partner Grid",
  component: PartnerGrid,
};

export const Default = {
  args: {
    title: "Agensi di bawah kementerian",
    description: "Agensi yang melaksanakan dasar kewangan negara.",
    partners: agencies.slice(0, 3),
  },
};
export const FourColumnsWell = {
  args: {
    title: "Rakan kerjasama",
    columns: 4,
    tone: "well",
    partners: agencies,
  },
};
export const WithoutLogos = {
  args: {
    title: "Agensi di bawah kementerian",
    partners: agencies.map(({ logo: _logo, ...p }) => p).slice(0, 3),
  },
};
export const English = {
  args: {
    lang: "en",
    title: "Agencies under the ministry",
    partners: agencies
      .slice(0, 3)
      .map((p) => ({ ...p, description: undefined })),
  },
};
