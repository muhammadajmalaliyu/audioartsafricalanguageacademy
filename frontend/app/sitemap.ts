import type { MetadataRoute } from "next";
import { getJSON, SITE } from "@/lib/serverApi";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts: any[] = (await getJSON("/posts", 3600)) || [];
  const pages = ["", "/about", "/impact", "/sponsors", "/voices", "/blog", "/volunteer", "/auth/register"];
  return [
    ...pages.map(p => ({ url: SITE + p, lastModified: new Date() })),
    ...posts.map(x => ({ url: `${SITE}/blog/${x.slug}`, lastModified: new Date(x.publishedAt || Date.now()) })),
  ];
}
