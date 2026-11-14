"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Btn, Card, Err, Input } from "./ui";

const INTERESTS = ["Community Supporter", "Cultural Guardian", "Platinum Partner", "Partnership / other"];
export default function PartnerForm() {
  const [f, setF] = useState<any>({ name: "", organisation: "", email: "", phone: "", interest: INTERESTS[0], message: "", website: "" });
  const [err, setErr] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => { const t = new URLSearchParams(location.search).get("tier"); if (t && INTERESTS.includes(t)) setF((x: any) => ({ ...x, interest: t })); }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function submit(e: any) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { await api("/partners", { body: { name: f.name, organisation: f.organisation || undefined, email: f.email || undefined, phone: f.phone || undefined, interest: f.interest, message: f.message || undefined, website: f.website } }); setDone(true); }
    catch (e: any) { setErr(e.message); }
    setBusy(false);
  }
  if (done) return <Card className="text-center py-10 space-y-2"><div className="text-5xl">🙏</div><h3 className="font-display text-2xl font-bold">Thank you, {f.name.split(" ")[0]}!</h3><p className="text-white/75">We have received your message and will reply soon.</p></Card>;
  return (
    <Card>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3"><Input placeholder="Your name" value={f.name} onChange={set("name")} required /><Input placeholder="Organisation (optional)" value={f.organisation} onChange={set("organisation")} /></div>
        <div className="grid sm:grid-cols-2 gap-3"><Input type="email" placeholder="Email" value={f.email} onChange={set("email")} /><Input placeholder="Phone / WhatsApp" value={f.phone} onChange={set("phone")} inputMode="tel" /></div>
        <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={f.interest} onChange={set("interest")}>{INTERESTS.map(i => <option key={i}>{i}</option>)}</select>
        <textarea className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 min-h-28 outline-none focus:border-brand placeholder:text-white/40" placeholder="How would you like to support or partner with us?" value={f.message} onChange={set("message")} maxLength={1000} />
        <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden="true" />
        <Err m={err} /><Btn variant="accent" className="w-full" disabled={busy}>{busy ? "Sending…" : "Send enquiry"}</Btn>
      </form>
    </Card>
  );
}
