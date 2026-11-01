"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, refresh, setToken } from "./api";

const Ctx = createContext<any>(null);
export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { refresh().then(d => { setUser(d?.user || null); setReady(true); }); }, []);
  const start = (d: any) => { setToken(d.accessToken); setUser(d.user); return d.user; };
  const login = async (email: string, password: string) => start(await api("/auth/login", { body: { email, password } }));
  const register = async (name: string, email: string, password: string) => start(await api("/auth/register", { body: { name, email, password } }));
  const logout = async () => { await api("/auth/logout", { method: "POST", body: {} }).catch(() => {}); setToken(null); setUser(null); };
  return <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);

/** Redirects to login when signed out, or home when a non-admin opens an admin page. */
export function useRequire(role?: "admin") {
  const a = useAuth(); const router = useRouter();
  useEffect(() => {
    if (!a.ready) return;
    if (!a.user) router.replace("/auth/login");
    else if (role === "admin" && a.user.role !== "admin") router.replace("/courses");
  }, [a.ready, a.user]);
  return { ...a, ok: a.ready && !!a.user && (!role || a.user.role === role) };
}
