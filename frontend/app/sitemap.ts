import type { MetadataRoute } from "next";
import { getJSON, SITE } from "@/lib/serverApi";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts: any[] = (await getJSON("/posts", 3600)) || [];
  const pages = ["", "/learn", "/about", "/impact", "/sponsors", "/voices", "/blog", "/volunteer", "/auth/register", "/privacy", "/terms"];
  // Public language landing pages and one page per phrase (built from the published lessons)
  const langs: any[] = (await getJSON("/public/languages", 3600)) || [];
  const learn: { url: string; lastModified: Date }[] = [];
  for (const l of langs.filter(x => x.courses > 0)) {
    learn.push({ url: `${SITE}/learn/${l.slug}`, lastModified: new Date() });
    const slugs: string[] = (await getJSON(`/public/phrases/${l.slug}`, 3600)) || [];
    slugs.forEach(sl => learn.push({ url: `${SITE}/learn/${l.slug}/${sl}`, lastModified: new Date() }));
  }
  return [
    ...pages.map(p => ({ url: SITE + p, lastModified: new Date() })),
    ...learn,
    ...posts.map(x => ({ url: `${SITE}/blog/${x.slug}`, lastModified: new Date(x.publishedAt || Date.now()) })),
  ];
}
