import NewsArticle from "../../../../packages/astro/src/templates/news-article.astro";

// Same title as the other news template: Storybook lists both stories together
export default {
  title: "Marketing/Templates/News",
  component: NewsArticle,
  tags: ["!autodocs"],
};

/** A reading column with the lead image, the body in Prose, attachments and related news. Source: packages/astro/src/templates/news-article.astro */
export const Article = {};
