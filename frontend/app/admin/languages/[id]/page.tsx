"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Btn, Card, Err, Input, Spin } from "@/components/ui";

const FIELDS: [string, string, string, number][] = [
  ["greeting", "Greeting word (replaces “Welcome” on the learner’s dashboard)", "e.g. Sannu", 1],
  ["tagline", "One-line description", "", 2],
  ["history", "History & the language (leave a blank line between paragraphs)", "", 8],
  ["culture", "Culture & people (blank line between paragraphs)", "", 8],
  ["alphabet", "Alphabet (letters separated by spaces)", "A B Ɓ C D …", 2],
  ["specialChars", "Special letters & sounds (one per line, written as  Letter|explanation)", "Ɓ ɓ|A “b” made with air drawn inward. Example: ɓarna", 8],
  ["funFacts", "Did you know? (one fact per line)", "", 5],
];
export default function LangEditor() {
  const { id } = useParams() as any; const { ok } = useRequire("admin");
  const [l, setL] = useState<any>(null); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { if (ok) api(`/languages/${id}`).then(setL).catch(e => setErr(e.message)); }, [ok, id]);
  if (!l) return err ? <Err m={err} /> : <Spin />;
  const save = async () => {
    try { const b: any = { name: l.name }; FIELDS.forEach(([k]) => (b[k] = l[k] || "")); await api(`/admin/languages/${id}`, { method: "PUT", body: b }); setMsg("Saved ✓"); setErr(""); setTimeout(() => setMsg(""), 2500); }
    catch (e: any) { setErr(e.message); }
  };
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Link href="/admin" className="text-sm text-white/60 hover:text-white">← Dashboard</Link>
      <h1 className="font-display text-3xl font-bold">{l.name}: welcome page</h1>
      <Card className="space-y-4">
        <div><label className="text-sm text-white/70">Language name</label><Input value={l.name} onChange={(e: any) => setL({ ...l, name: e.target.value })} /></div>
        {FIELDS.map(([k, label, ph, rows]) => (
          <div key={k}><label className="text-sm text-white/70">{label}</label>
            <textarea rows={rows} placeholder={ph} value={l[k] || ""} onChange={e => setL({ ...l, [k]: e.target.value })} className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 outline-none focus:border-brand placeholder:text-white/40" /></div>))}
        <Err m={err} />
        <div className="flex gap-3 items-center"><Btn onClick={save}>Save</Btn><Link href={`/languages/${id}`} target="_blank" className="rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/20 font-semibold">Preview ↗</Link>{msg && <span className="text-emerald-300 text-sm">{msg}</span>}</div>
      </Card>
    </div>
  );
}
