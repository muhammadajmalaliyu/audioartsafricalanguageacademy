"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Btn, Card, Err, Input } from "@/components/ui";

const LANGS = ["Hausa", "Yorùbá", "Igbo", "Nigerian Pidgin", "Etsako / Afemai", "Efik", "Ijaw", "Tiv", "Fulfulde", "Kanuri", "Other"];

export default function Volunteer() {
  const [f, setF] = useState<any>({ name: "", phone: "", email: "", language: "Hausa", other: "", notes: "", consent: false, website: "" });
  const [err, setErr] = useState(""); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function submit(e: any) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      await api("/volunteers", { body: { name: f.name, phone: f.phone || undefined, email: f.email || undefined, language: f.language === "Other" ? f.other : f.language, notes: f.notes || undefined, consent: f.consent || undefined, website: f.website } });
      setDone(true);
    } catch (e: any) { setErr(e.message); }
    setBusy(false);
  }
  if (done) return (
    <Card className="max-w-xl mx-auto text-center space-y-3 py-10"><div className="text-5xl">🎉</div>
      <h1 className="font-display text-2xl font-bold">Thank you, {f.name.split(" ")[0]}!</h1>
      <p className="text-white/75">We have received your details and will contact you soon about recording your language.</p></Card>
  );
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="text-center"><div className="text-4xl">🎙️</div>
        <h1 className="font-display text-3xl font-bold mt-2">Volunteer your voice</h1>
        <p className="text-white/70 mt-2">Native speakers of Nigerian languages: help learners hear the real sound of your language. We will contact you with the words and sentences to record.</p></div>
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder="Full name" value={f.name} onChange={set("name")} required />
          <Input placeholder="WhatsApp / phone number" value={f.phone} onChange={set("phone")} inputMode="tel" />
          <Input type="email" placeholder="Email (optional if you gave a phone number)" value={f.email} onChange={set("email")} />
          <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={f.language} onChange={set("language")}>{LANGS.map(l => <option key={l}>{l}</option>)}</select>
          {f.language === "Other" && <Input placeholder="Which language?" value={f.other} onChange={set("other")} required />}
          <textarea className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 min-h-24 outline-none focus:border-brand placeholder:text-white/40" placeholder="Dialect or region, and anything we should know (optional)" value={f.notes} onChange={set("notes")} maxLength={500} />
          <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="hidden" aria-hidden="true" />
          <label className="flex items-start gap-2 text-sm text-white/75"><input type="checkbox" className="mt-1" checked={f.consent} onChange={e => setF({ ...f, consent: e.target.checked })} required />
            I agree that Audio Arts Africa may contact me about voice recording, and may use my recordings in its language lessons.</label>
          <Err m={err} />
          <Btn variant="accent" className="w-full" disabled={busy}>{busy ? "Sending…" : "Send my details"}</Btn>
        </form>
      </Card>
    </div>
  );
}
