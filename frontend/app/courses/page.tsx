"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Card, Err, Spin } from "@/components/ui";

export default function Dashboard() {
  const { ok } = useRequire();
  const [me, setMe] = useState<any>(null); const [langs, setL] = useState<any[] | null>(null); const [ann, setA] = useState<any[]>([]); const [err, setErr] = useState(""); const [welcome, setWelcome] = useState(false);
  useEffect(() => {
    if (!ok) return;
    setWelcome(new URLSearchParams(location.search).get("welcome") === "1");
    api("/me").then(setMe).catch(e => setErr(e.message));
    api("/languages").then(setL).catch(e => setErr(e.message));
    api("/announcements").then(setA).catch(() => {});
  }, [ok]);
  if (!ok || !me || !langs) return err ? <Err m={err} /> : <Spin />;
  const greet = me.language?.greeting || "Welcome";
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">{greet}, {me.name.split(" ")[0]} 👋</h1>
      {welcome && (
        <Card className="border-emerald-400/50 bg-emerald-400/10 space-y-3">
          <p className="font-display text-xl font-bold">🎉 Welcome to the family!</p>
          <p className="text-white/80 text-sm">Pick a language below to begin. Learning is better together, so join our learner community to practise, ask questions and get updates.</p>
          <div className="flex gap-2 flex-wrap">
            <a href={process.env.NEXT_PUBLIC_COMMUNITY_URL || "https://wa.me/2348029609876?text=" + encodeURIComponent("Hello, I just joined Audio Arts Africa Language Academy and I would like to join the learner community.")} target="_blank" rel="noopener" className="rounded-xl px-4 py-2 bg-emerald-400 text-navy-900 font-semibold text-sm hover:brightness-110">Join the community</a>
            <button onClick={() => { setWelcome(false); history.replaceState({}, "", "/courses"); }} className="rounded-xl px-4 py-2 bg-white/10 text-sm hover:bg-white/20">Dismiss</button>
          </div>
        </Card>)}
      {ann.map(a => <Card key={a._id} className="border-accent/40"><p className="font-semibold text-accent">📢 {a.title}</p><p className="text-white/75 text-sm mt-1">{a.body}</p></Card>)}
      {me.language && (
        <Link href={`/languages/${me.language._id}`}><Card className="flex items-center gap-4 border-brand/50 hover:border-brand transition">
          <div className="flex-1"><p className="text-xs uppercase tracking-wider text-brand">Continue learning</p><p className="font-display text-xl font-semibold">{me.language.name}</p></div>
          <span className="text-brand font-semibold">Continue →</span></Card></Link>
      )}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">{me.language ? "Choose a language to learn" : "Please select a language you would like to start learning below."}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {langs.map((l, i) => (
            <Link key={l._id} href={`/languages/${l._id}`} className={`rounded-2xl p-6 border transition hover:-translate-y-0.5 hover:brightness-110 ${i % 2 ? "bg-accent/15 border-accent/50" : "bg-brand/15 border-brand/50"}`}>
              <p className="text-white/60 text-sm">{l.greeting}</p>
              <p className="font-display text-2xl font-bold mt-1">{l.name}</p>
              <p className="text-sm text-white/70 mt-2 min-h-[2.5rem]">{l.tagline}</p>
              <span className={`inline-block mt-3 text-xs rounded-full px-3 py-1 ${l.courses ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/60"}`}>{l.courses ? "Courses available" : "Coming soon"}</span>
            </Link>))}
        </div>
        {!langs.length && <p className="text-white/60">Languages will appear here soon.</p>}
      </div>
    </div>
  );
}
