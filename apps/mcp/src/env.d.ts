/** The built preview page, bundled into the Worker as text (wrangler.jsonc rules). */
declare module "*.html" {
  const html: string;
  export default html;
}
