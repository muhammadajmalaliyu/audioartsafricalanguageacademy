"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Btn, Card, Err, Input, PasswordInput } from "@/components/ui";

const T: any = { login: "Welcome back", register: "Create your account", forgot: "Reset your password", reset: "Choose a new password" };

export default function Auth() {
  const { mode } = useParams() as { mode: string };
  const { login, register } = useAuth(); const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  async function submit(e: any) {
    e.preventDefault(); setErr(""); setMsg(""); setBusy(true);
    try {
      if (mode === "login") { const u = await login(f.email, f.password); router.push(u.role === "admin" ? "/admin" : "/courses"); }
      else if (mode === "register") { await register(f.name, f.email, f.password); router.push("/courses?welcome=1"); }
      else if (mode === "forgot") { await api("/auth/forgot", { body: { email: f.email } }); setMsg("If that email exists, a reset link has been sent."); }
      else { await api("/auth/reset", { body: { token: new URLSearchParams(location.search).get("token"), password: f.password } }); setMsg("Password updated. Taking you to log in…"); setTimeout(() => router.push("/auth/login"), 2000); }
    } catch (e: any) { setErr(e.message); }
    setBusy(false);
  }
  return (
    <Card className="max-w-md mx-auto mt-6">
      <h1 className="font-display text-2xl font-bold mb-5">{T[mode] || "Account"}</h1>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && <Input placeholder="Full name" value={f.name} onChange={set("name")} required />}
        {mode !== "reset" && <Input type="email" placeholder="Email" value={f.email} onChange={set("email")} required />}
        {mode !== "forgot" && <PasswordInput placeholder={mode === "reset" ? "New password (8+ characters)" : "Password (8+ characters)"} value={f.password} onChange={set("password")} minLength={8} required />}
        <Err m={err} />{msg && <p className="text-emerald-300 text-sm">{msg}</p>}
        <Btn className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in" : mode === "register" ? "Sign up" : "Continue"}</Btn>
      </form>
      <div className="mt-4 text-sm text-white/60 flex justify-between">
        {mode === "login" ? <><Link href="/auth/register" className="hover:text-white">Create account</Link><Link href="/auth/forgot" className="hover:text-white">Forgot password?</Link></>
          : <Link href="/auth/login" className="hover:text-white">Back to log in</Link>}
      </div>
    </Card>
  );
}
