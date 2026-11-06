"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { makeQuiz } from "@/lib/quizgen";
import { Btn, Card, Err, Input, Spin } from "@/components/ui";

function parseCSV(t: string) {
  const rows: string[][] = []; let row: string[] = [], cur = "", q = false; t = t.replace(/^\uFEFF/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; row.push(cur); cur = ""; rows.push(row); row = []; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}

export default function Import() {
  const { ok } = useRequire("admin");
  const [rows, setRows] = useState<string[][]>([]); const [textCol, setTextCol] = useState("Hausa");
  const [files, setFiles] = useState<File[]>([]); const [courses, setCourses] = useState<any[]>([]); const [langs, setLangs] = useState<any[]>([]);
  const [courseId, setCourseId] = useState(""); const [nl, setNl] = useState({ language: "", title: "Hausa Beginner" });
  const [moduleName, setModuleName] = useState("Beginner Basics"); const [publish, setPublish] = useState(false);
  const [log, setLog] = useState<string[]>([]); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");

  useEffect(() => { if (ok) { api("/admin/courses").then(setCourses); api("/languages").then(setLangs); } }, [ok]);
  const head = rows[0] || [];
  const idx = (re: RegExp) => head.findIndex(h => re.test(h));
  const cols = { id: idx(/^id$/i), topic: idx(/topic|lesson/i), en: idx(/english/i), type: idx(/type/i), text: head.findIndex(h => h.trim().toLowerCase() === textCol.trim().toLowerCase()) };
  const data = useMemo(() => rows.slice(1).filter(r => r[cols.text] && r[cols.en] && r[cols.topic]), [rows, textCol]);
  const topics = useMemo(() => { const m = new Map<string, string[][]>(); data.forEach(r => { const k = r[cols.topic].trim(); m.set(k, [...(m.get(k) || []), r]); }); return Array.from(m.entries()); }, [data]);
  const fmap = useMemo(() => new Map(files.map(f => [f.name.replace(/\.[^.]+$/, "").trim().toUpperCase(), f])), [files]);
  const matched = data.filter(r => fmap.has((r[cols.id] || "").trim().toUpperCase())).length;
  const say = (m: string) => setLog(l => [...l.slice(-60), m]);

  async function run() {
    setBusy(true); setErr(""); setLog([]);
    try {
      let cid = courseId;
      if (cid === "new") { const c = await api("/admin/courses", { body: { language: nl.language, title: nl.title, level: "beginner" } }); cid = c._id; say(`Created course “${nl.title}”`); }
      const ex = await api(`/courses/${cid}`);
      const mod = ex.modules.find((m: any) => m.title === moduleName) || await api("/admin/modules", { body: { course: cid, title: moduleName, order: ex.modules.length + 1 } });
      const have = new Set(ex.lessons.map((l: any) => l.title));
      const pool = data.map(r => ({ kind: r[cols.type] || "word", text: r[cols.text], translation: r[cols.en] }));
      let done = 0;
      for (const [topic, rs] of topics) {
        const title = topic.replace(/^\d+\s*/, ""); const order = parseInt(topic) || ++done;
        if (have.has(title)) { say(`↷ Skipped “${title}” (already exists)`); continue; }
        const items: any[] = [];
        for (let i = 0; i < rs.length; i++) {
          const r = rs[i]; const f = fmap.get((r[cols.id] || "").trim().toUpperCase());
          const it: any = { kind: (r[cols.type] || "word").toLowerCase() === "sentence" ? "sentence" : "word", text: r[cols.text].trim(), translation: r[cols.en].trim() };
          if (f) {
            say(`⬆ ${title}: uploading ${r[cols.id]} (${i + 1}/${rs.length})`);
            try { const fd = new FormData(); fd.append("file", f); const u = await api("/admin/upload", { body: fd }); it.audioUrl = u.url; it.audioPublicId = u.publicId; }
            catch (e: any) { say(`⚠ ${r[cols.id]} audio failed: ${e.message}`); }
          }
          items.push(it);
        }
        const l = await api("/admin/lessons", { body: { course: cid, module: mod._id, title, order } });
        await api(`/admin/lessons/${l._id}`, { method: "PUT", body: { items, published: publish } });
        const qs = makeQuiz(items, pool);
        if (qs.length) await api(`/admin/lessons/${l._id}/quiz`, { method: "PUT", body: { questions: qs } });
        say(`✅ ${title}: ${items.length} items, ${items.filter(x => x.audioUrl).length} audio, ${qs.length} quiz questions`);
      }
      say("🎉 Import finished. Open Admin → Content to review, then publish.");
    } catch (e: any) { setErr(e.message); }
    setBusy(false);
  }
  if (!ok) return <Spin />;
  const ready = data.length > 0 && (courseId && (courseId !== "new" || (nl.language && nl.title)));
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Link href="/admin" className="text-sm text-white/60 hover:text-white">← Dashboard</Link>
      <h1 className="font-display text-3xl font-bold">Bulk import</h1>
      <Card className="space-y-3"><h2 className="font-display font-semibold">1. Word list (CSV)</h2>
        <input type="file" accept=".csv,text/csv" onChange={async e => { const f = e.target.files?.[0]; if (f) setRows(parseCSV(await f.text())); }} />
        {rows.length > 0 && <div className="space-y-2"><label className="text-sm text-white/70">Column to import as the learning language:</label>
          <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={textCol} onChange={e => setTextCol(e.target.value)}>{head.map(h => <option key={h}>{h}</option>)}</select>
          <p className="text-sm text-emerald-300">{data.length} rows · {topics.length} topics found</p></div>}</Card>
      <Card className="space-y-3"><h2 className="font-display font-semibold">2. Audio files (named by ID, e.g. HA-001.mp3)</h2>
        <input type="file" accept="audio/*" multiple onChange={e => setFiles(Array.from(e.target.files || []))} />
        <p className="text-sm text-white/70">{files.length} files selected · {matched} matched to rows{files.length > 0 && data.length > 0 && matched < files.length ? " · check file names for the rest" : ""}</p></Card>
      <Card className="space-y-3"><h2 className="font-display font-semibold">3. Where should the lessons go?</h2>
        <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">Choose a course…</option>{courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}<option value="new">+ Create a new course</option></select>
        {courseId === "new" && <div className="grid sm:grid-cols-2 gap-2">
          <select className="rounded-xl bg-white/10 px-3 py-2.5" value={nl.language} onChange={e => setNl({ ...nl, language: e.target.value })}><option value="">Language…</option>{langs.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}</select>
          <Input value={nl.title} onChange={(e: any) => setNl({ ...nl, title: e.target.value })} /></div>}
        <Input value={moduleName} onChange={(e: any) => setModuleName(e.target.value)} placeholder="Module name" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={publish} onChange={e => setPublish(e.target.checked)} /> Publish lessons immediately (otherwise they stay as drafts for you to review)</label></Card>
      <p className="text-sm text-white/60">Each topic becomes a lesson with an auto-made 8-question quiz. Topics that already exist in the course are skipped, so you can safely run this again with new audio files or new topics.</p>
      <Err m={err} />
      <Btn variant="accent" disabled={!ready || busy} onClick={run} className="w-full">{busy ? "Importing… keep this page open" : "Start import"}</Btn>
      {log.length > 0 && <Card className="font-mono text-xs space-y-1 max-h-80 overflow-auto">{log.map((l, i) => <div key={i}>{l}</div>)}</Card>}
    </div>
  );
}
