const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
/** Server-side fetch for public data (blog, sitemap). Returns null if the API is asleep or down. */
export async function getJSON(path: string, revalidate = 300) {
  try {
    const r = await fetch(API + "/api" + path, { next: { revalidate } });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://audioartsafricalanguageacademy.vercel.app";

/** ISO language codes used in structured data (Google). */
export const LANG_CODES: Record<string, string> = { hausa: "ha", yoruba: "yo", igbo: "ig", ibibio: "ibb" };

/** Like getJSON, but: 404 -> null (page not found); network error/timeout/5xx -> throws, so Next never caches a wrong 404. */
export async function getPublic(path: string, revalidate = 3600): Promise<any | null> {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 9000);
  try {
    const r = await fetch(API + "/api" + path, { next: { revalidate }, signal: ctl.signal });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("API " + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
