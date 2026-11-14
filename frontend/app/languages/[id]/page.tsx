"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Bar, Card, Err, Spin } from "@/components/ui";
import ShareButton from "@/components/ShareButton";

const paras = (t?: string) => (t || "").split(/\n\s*\n/).filter(x => x.trim());
const lines = (t?: string) => (t || "").split("\n").filter(x => x.trim());

export default function LanguagePage() {
  const { id } = useParams() as any; const { ok } = useRequire();
  const [l, setL] = useState<any>(null); const [courses, setC] = useState<any[]>([]); const [err, setErr] = useState("");
  useEffect(() => {
    if (!ok) return;
    api(`/languages/${id}`).then(setL).catch(e => setErr(e.message));
    api("/courses").then(cs => setC(cs.filter((c: any) => c.language?._id === id))).catch(() => {});
    api("/me", { method: "PATCH", body: { language: id } }).catch(() => {}); // remembers the learner's chosen language
  }, [ok, id]);
  if (!l) return err ? <Err m={err} /> : <Spin />;
  const Title = ({ children }: any) => <h2 className="font-display text-2xl font-bold mb-3">{children}</h2>;
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Link href="/courses" className="text-sm text-white/60 hover:text-white">← All languages</Link>
      <section className="text-center py-6">
        <p className="text-accent font-display text-5xl md:text-6xl font-bold">{l.greeting || "Welcome"}!</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-3">Welcome to {l.name}</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">{l.tagline}</p>
      </section>
      {l.history && <Card><Title>📜 History &amp; the language</Title><div className="space-y-3 text-white/80 leading-relaxed">{paras(l.history).map((p, i) => <p key={i}>{p}</p>)}</div></Card>}
      {l.culture && <Card><Title>🎭 Culture &amp; people</Title><div className="space-y-3 text-white/80 leading-relaxed">{paras(l.culture).map((p, i) => <p key={i}>{p}</p>)}</div></Card>}
      {l.alphabet && <Card><Title>🔤 The alphabet</Title>
        <div className="flex flex-wrap gap-2">{l.alphabet.split(/\s+/).filter(Boolean).map((a: string, i: number) => <span key={i} className="min-w-[3rem] text-center rounded-xl bg-brand/15 border border-brand/40 px-3 py-2 font-display text-xl font-semibold">{a}</span>)}</div></Card>}
      {l.specialChars && <Card><Title>✨ Special letters &amp; sounds</Title>
        <div className="grid gap-3">{lines(l.specialChars).map((x, i) => { const [ch, ...rest] = x.split("|");
          return <div key={i} className="flex gap-4 items-start"><span className="shrink-0 min-w-[4rem] text-center rounded-xl bg-accent/15 border border-accent/40 px-3 py-2 font-display text-xl font-bold text-accent">{ch.trim()}</span><p className="text-white/80 text-sm pt-2">{rest.join("|").trim()}</p></div>; })}</div></Card>}
      {l.funFacts && <Card><Title>💡 Did you know?</Title><ul className="space-y-2 text-white/80 list-disc pl-5">{lines(l.funFacts).map((x, i) => <li key={i}>{x}</li>)}</ul></Card>}
      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-6 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Ready to start learning {l.name}?</h2>
        {courses.length ? courses.map(c => (
          <Link key={c._id} href={`/courses/${c._id}`} className="block rounded-2xl bg-accent text-navy-900 p-4 text-left hover:brightness-110">
            <p className="font-display font-bold text-lg">Start course: {c.title} →</p>
            <p className="text-sm opacity-80 mb-2">{c.completed}/{c.lessons} lessons complete</p><Bar pct={c.lessons ? (100 * c.completed) / c.lessons : 0} />
          </Link>))
          : <p className="text-white/75">Courses for {l.name} are coming soon. Are you a native speaker? <Link href="/volunteer" className="text-accent underline">Volunteer your voice</Link> and help us build them.</p>}
      </section>
      <div className="text-center pb-4"><ShareButton className="px-5 py-2.5 rounded-xl bg-white/10 font-semibold hover:bg-white/20" /></div>
    </div>
  );
}
