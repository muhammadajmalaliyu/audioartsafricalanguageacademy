import type { MetadataRoute } from "next";
import { SITE } from "@/lib/serverApi";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/courses", "/lessons", "/progress", "/languages"] }], sitemap: `${SITE}/sitemap.xml` };
}
