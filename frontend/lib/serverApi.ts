const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
/** Server-side fetch for public data (blog, sitemap). Returns null if the API is asleep or down. */
export async function getJSON(path: string, revalidate = 300) {
  try {
    const r = await fetch(API + "/api" + path, { next: { revalidate } });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://audioartsafricalanguageacademy.vercel.app";
