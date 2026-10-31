import SectionHeading from "@/components/ui/section-heading.astro";

export default {
  title: "Marketing/Section Heading",
  component: SectionHeading,
  parameters: { layout: "padded" },
};

export const Default = {
  args: {
    titleId: "semua-satu-akaun",
    title: "Semua dalam satu akaun",
    description:
      "Satu MyDigital ID untuk setiap bayaran Kementerian Kewangan, daripada saman hingga yuran pembekal.",
  },
};
export const TitleOnly = { args: { title: "Kata pengguna" } };
export const Subsection = {
  args: {
    as: "h3",
    responsive: false,
    title: "Perkhidmatan berkaitan",
    description: "Urusan lain yang mungkin anda perlukan.",
  },
};
