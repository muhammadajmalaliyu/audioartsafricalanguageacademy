"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Btn, Card, Err, Play, Spin } from "@/components/ui";

export default function Lesson() {
  const { id } = useParams() as any; const { ok } = useRequire();
  const [d, setD] = useState<any>(null); const [tab, setTab] = useState("learn"); const [err, setErr] = useState("");
  const load = () => api(`/lessons/${id}`).then(setD).catch(e => setErr(e.message));
  useEffect(() => { if (ok) load(); }, [ok, id]);
  if (!d) return err ? <Err m={err} /> : <Spin />;
  const { lesson } = d;
  const tabs = [["learn", "Learn"], ["practice", "Practise"], ["quiz", d.hasQuiz ? "Quiz" : "Finish"]];
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Link href={`/courses/${d.course._id}`} className="text-sm text-white/60 hover:text-white">← {d.course.title}</Link>
      <h1 className="font-display text-3xl font-bold">{lesson.title} {d.progress?.completed && <span className="text-emerald-400 text-xl">✓</span>}</h1>
      <div className="flex gap-2">{tabs.map(([k, n]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl font-semibold ${tab === k ? "bg-brand text-navy-900" : "bg-white/10"}`}>{n}</button>)}</div>
      {tab === "learn" && <Learn items={lesson.items} />}
      {tab === "practice" && <Practice items={lesson.items} next={() => setTab("quiz")} />}
      {tab === "quiz" && (d.hasQuiz ? <Quiz id={id} done={load} /> : <Finish id={id} done={load} complete={d.progress?.completed} />)}
    </div>
  );
}

function Learn({ items }: any) {
  return <div className="space-y-3">{items.map((i: any, n: number) => (
    <Card key={n} className="flex items-center gap-4">
      <Play src={i.audioUrl} />
      <div><p className="font-display text-xl font-semibold">{i.text}</p><p className="text-white/70">{i.translation}</p></div>
      <span className="ml-auto text-xs uppercase text-white/40">{i.kind}</span>
    </Card>))}</div>;
}

function Practice({ items, next }: any) {
  const [i, setI] = useState(0); const [show, setShow] = useState(false); const [got, setGot] = useState(0);
  if (i >= items.length) return <Card className="text-center space-y-3"><p className="text-2xl">🎉</p><p className="font-semibold">You went through all {items.length} cards ({got} marked “got it”).</p><Btn variant="accent" onClick={next}>Continue</Btn></Card>;
  const c = items[i];
  return (
    <Card className="text-center space-y-5 py-8">
      <p className="text-xs text-white/50">Card {i + 1} of {items.length}</p>
      <div className="flex justify-center items-center gap-4"><p className="font-display text-4xl font-bold">{c.text}</p><Play src={c.audioUrl} /></div>
      {show ? <p className="text-2xl text-accent">{c.translation}</p> : <Btn variant="ghost" onClick={() => setShow(true)}>Reveal meaning</Btn>}
      {show && <div className="flex gap-3 justify-center">
        <Btn variant="ghost" onClick={() => { setShow(false); setI(i + 1); }}>Again later</Btn>
        <Btn onClick={() => { setGot(got + 1); setShow(false); setI(i + 1); }}>Got it ✓</Btn></div>}
    </Card>
  );
}

function Quiz({ id, done }: any) {
  const [qs, setQs] = useState<any[] | null>(null); const [ans, setAns] = useState<any[]>([]); const [res, setRes] = useState<any>(null); const [err, setErr] = useState("");
  useEffect(() => { api(`/lessons/${id}/quiz`).then(d => { setQs(d.questions); setAns(d.questions.map(() => null)); }).catch(e => setErr(e.message)); }, [id]);
  if (!qs) return err ? <Err m={err} /> : <Spin />;
  const submit = async () => { try { setRes(await api(`/lessons/${id}/quiz`, { body: { answers: ans } })); done(); } catch (e: any) { setErr(e.message); } };
  return (
    <div className="space-y-4">
      {res && <Card className={res.passed ? "border-emerald-400/60" : "border-accent/60"}>
        <p className="font-display text-3xl font-bold">{res.score}/{res.total} · {res.percent}%</p>
        <p className="text-white/75">{res.passed ? "Well done — lesson complete! ✅" : "Keep practising — you need 60% to complete the lesson."}</p></Card>}
      {qs.map((q, n) => (
        <Card key={n}><p className="font-semibold mb-3">{n + 1}. {q.prompt}</p>
          <div className="grid gap-2">{q.options.map((o: string, k: number) => {
            const picked = ans[n] === k; let cls = picked ? "border-brand bg-brand/20" : "border-white/10 bg-white/5 hover:bg-white/10";
            if (res) cls = res.results[n].answerIndex === k ? "border-emerald-400 bg-emerald-400/20" : picked ? "border-red-400 bg-red-400/20" : "border-white/10 bg-white/5";
            return <button key={k} disabled={!!res} onClick={() => setAns(ans.map((a, j) => (j === n ? k : a)))} className={`text-left rounded-xl border px-4 py-3 ${cls}`}>{o}</button>;
          })}</div></Card>))}
      <Err m={err} />
      {res ? <Btn variant="accent" onClick={() => { setRes(null); setAns(qs.map(() => null)); }}>Try again</Btn>
        : <Btn disabled={ans.includes(null)} onClick={submit}>Submit answers</Btn>}
    </div>
  );
}

function Finish({ id, done, complete }: any) {
  return <Card className="text-center space-y-3"><p>{complete ? "This lesson is complete ✅" : "Ready to finish this lesson?"}</p>
    {!complete && <Btn variant="accent" onClick={async () => { await api(`/lessons/${id}/complete`, { body: {} }); done(); }}>Mark lesson complete</Btn>}</Card>;
}
