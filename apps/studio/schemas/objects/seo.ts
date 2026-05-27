import { defineType } from "sanity";

// §4.3.11
export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    { name: "metaTitle", type: "localeString", title: "Meta Title" },
    { name: "metaDescription", type: "localeText", title: "Meta Description" },
    { name: "ogImage", type: "image", title: "OG Image" },
    {
      name: "noIndex",
      type: "boolean",
      title: "Hide from search engines",
      initialValue: false,
    },
  ],
  options: { collapsible: true, collapsed: true },
});
