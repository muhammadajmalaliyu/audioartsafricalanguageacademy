const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
let token: string | null = null;
export const setToken = (t: string | null) => { token = t; };

export async function refresh() {
  try {
    const r = await fetch(API + "/api/auth/refresh", { method: "POST", credentials: "include" });
    if (!r.ok) { token = null; return null; }
    const d = await r.json(); token = d.accessToken; return d;
  } catch { return null; }
}

export async function api(path: string, opts: { method?: string; body?: any } = {}) {
  const isForm = typeof FormData !== "undefined" && opts.body instanceof FormData;
  const go = () => fetch(API + "/api" + path, {
    method: opts.method || (opts.body ? "POST" : "GET"), credentials: "include",
    headers: { ...(opts.body && !isForm ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: opts.body ? (isForm ? opts.body : JSON.stringify(opts.body)) : undefined,
  });
  let r = await go();
  if (r.status === 401 && (await refresh())) r = await go();
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Something went wrong");
  return d;
}
