import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.tritonsswimgroup.co.uk/sitemap.xml",
    host: "https://www.tritonsswimgroup.co.uk"
  };
}
