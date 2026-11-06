"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Btn, Card, Err, Input, Spin } from "@/components/ui";
import { makeQuiz } from "@/lib/quizgen";

const blank = { kind: "word", text: "", translation: "" };

export default function Editor() {
  const { id } = useParams() as any; const { ok } = useRequire("admin");
  const [l, setL] = useState<any>(null); const [qs, setQs] = useState<any[]>([]); const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [up, setUp] = useState(-1);
  useEffect(() => { if (ok) { api(`/lessons/${id}`).then(d => setL(d.lesson)).catch(e => setErr(e.message)); api(`/admin/lessons/${id}/quiz`).then(d => setQs(d.questions)); } }, [ok, id]);
  if (!l) return err ? <Err m={err} /> : <Spin />;

  const setItem = (i: number, p: any) => setL({ ...l, items: l.items.map((x: any, n: number) => (n === i ? { ...x, ...p } : x)) });
  const flash = (m: string) => { setMsg(m); setErr(""); setTimeout(() => setMsg(""), 2500); };
  const save = async (extra: any = {}) => {
    try { const d = await api(`/admin/lessons/${id}`, { method: "PUT", body: { title: l.title, items: l.items, ...extra } }); setL(d); flash("Saved ✓"); }
    catch (e: any) { setErr(e.message); }
  };
  const upload = async (i: number, f?: File) => {
    if (!f) return; setUp(i); setErr("");
    try { const fd = new FormData(); fd.append("file", f); const r = await api("/admin/upload", { body: fd }); setItem(i, { audioUrl: r.url, audioPublicId: r.publicId }); flash("Uploaded — remember to Save"); }
    catch (e: any) { setErr(e.message); } setUp(-1);
  };
  const saveQuiz = async () => { try { await api(`/admin/lessons/${id}/quiz`, { method: "PUT", body: { questions: qs } }); flash("Quiz saved ✓"); } catch (e: any) { setErr(e.message); } };
  const setQ = (i: number, p: any) => setQs(qs.map((q, n) => (n === i ? { ...q, ...p } : q)));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/admin" className="text-sm text-white/60 hover:text-white">← Dashboard</Link>
      <Card className="space-y-3">
        <Input className="font-display text-xl font-semibold" value={l.title} onChange={(e: any) => setL({ ...l, title: e.target.value })} />
        <div className="flex gap-2 flex-wrap items-center">
          <Btn onClick={() => save()}>Save lesson</Btn>
          <Link href={`/lessons/${id}`} target="_blank" className="rounded-xl px-4 py-2.5 bg-white/10 hover:bg-white/20 font-semibold">Preview as learner ↗</Link>
          <Btn variant={l.published ? "ghost" : "accent"} onClick={() => save({ published: !l.published })}>{l.published ? "Unpublish" : "Publish lesson"}</Btn>
          <span className={`text-sm ${l.published ? "text-emerald-300" : "text-white/50"}`}>{l.published ? "● Live for learners" : "○ Draft"}</span>
          {msg && <span className="text-emerald-300 text-sm">{msg}</span>}</div><Err m={err} />
      </Card>

      <h2 className="font-display text-xl font-semibold">Words & sentences</h2>
      {l.items.map((it: any, i: number) => (
        <Card key={i} className="space-y-3">
          <div className="grid sm:grid-cols-[110px_1fr_1fr] gap-2">
            <select className="rounded-xl bg-white/10 px-3" value={it.kind} onChange={e => setItem(i, { kind: e.target.value })}><option>word</option><option>sentence</option></select>
            <Input placeholder="Hausa text" value={it.text} onChange={(e: any) => setItem(i, { text: e.target.value })} />
            <Input placeholder="English translation" value={it.translation} onChange={(e: any) => setItem(i, { translation: e.target.value })} /></div>
          <div className="flex items-center gap-3 flex-wrap">
            {it.audioUrl ? <audio controls src={it.audioUrl} className="h-10" /> : <span className="text-sm text-white/50">No recording</span>}
            <label className="cursor-pointer rounded-xl px-4 py-2 bg-accent text-navy-900 font-semibold text-sm hover:brightness-110">{up === i ? "Uploading…" : it.audioUrl ? "Replace audio" : "Upload audio"}
              <input type="file" accept="audio/*" hidden onChange={e => upload(i, e.target.files?.[0])} /></label>
            {it.audioUrl && <Btn variant="ghost" className="text-sm !py-2" onClick={() => setItem(i, { audioUrl: "", audioPublicId: "" })}>Remove audio</Btn>}
            <Btn variant="danger" className="ml-auto text-sm !py-2" onClick={() => setL({ ...l, items: l.items.filter((_: any, n: number) => n !== i) })}>Delete item</Btn></div>
        </Card>))}
      <Btn variant="ghost" onClick={() => setL({ ...l, items: [...l.items, { ...blank }] })}>+ Add word / sentence</Btn>

      <h2 className="font-display text-xl font-semibold pt-4">Quiz</h2>
      {qs.map((q, i) => (
        <Card key={i} className="space-y-2">
          <Input placeholder={`Question ${i + 1}`} value={q.prompt} onChange={(e: any) => setQ(i, { prompt: e.target.value })} />
          {q.options.map((o: string, k: number) => (
            <div key={k} className="flex items-center gap-2"><input type="radio" name={`a${i}`} checked={q.answerIndex === k} onChange={() => setQ(i, { answerIndex: k })} title="Correct answer" />
              <Input placeholder={`Option ${k + 1}`} value={o} onChange={(e: any) => setQ(i, { options: q.options.map((x: string, j: number) => (j === k ? e.target.value : x)) })} /></div>))}
          <p className="text-xs text-white/50">Select the radio button beside the correct answer.</p>
          <Btn variant="danger" className="text-sm !py-1.5" onClick={() => setQs(qs.filter((_, n) => n !== i))}>Delete question</Btn>
        </Card>))}
      <div className="flex gap-2"><Btn variant="ghost" onClick={() => setQs([...qs, { prompt: "", options: ["", "", "", ""], answerIndex: 0 }])}>+ Add question</Btn><Btn variant="accent" onClick={() => { const it = l.items.filter((x: any) => x.text && x.translation); if (it.length < 4) return setErr("Add at least 4 words/sentences first."); if (qs.length && !confirm("Replace the current questions with a new auto-generated quiz?")) return; setQs(makeQuiz(it)); flash("Quiz generated — review it, then Save quiz"); }}>✨ Auto-generate quiz</Btn><Btn onClick={saveQuiz}>Save quiz</Btn></div>
    </div>
  );
}
