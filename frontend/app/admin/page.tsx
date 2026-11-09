"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useRequire } from "@/lib/auth";
import { Btn, Card, Err, Input, Spin } from "@/components/ui";

export default function Admin() {
  const { ok } = useRequire("admin"); const [tab, setTab] = useState("overview");
  if (!ok) return <Spin />;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap"><h1 className="font-display text-3xl font-bold mr-auto">Administrator dashboard</h1><Link href="/admin/import" className="rounded-xl px-4 py-2.5 bg-accent text-navy-900 font-semibold hover:brightness-110">⬆ Bulk import</Link></div>
      <div className="flex gap-2 flex-wrap">{[["overview", "Overview"], ["content", "Content"], ["learners", "Learners"], ["volunteers", "Volunteers"], ["news", "Announcements"]].map(([k, n]) =>
        <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-xl font-semibold ${tab === k ? "bg-accent text-navy-900" : "bg-white/10"}`}>{n}</button>)}</div>
      {tab === "overview" && <Overview />}{tab === "content" && <Content />}{tab === "learners" && <Learners />}{tab === "volunteers" && <Volunteers />}{tab === "news" && <News />}
    </div>
  );
}

function Overview() {
  const [s, setS] = useState<any>(null); useEffect(() => { api("/admin/stats").then(setS); }, []);
  if (!s) return <Spin />;
  return <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{[["Learners", s.learners], ["Courses", s.courses], ["Lessons", s.lessons], ["Published", s.published], ["Quiz attempts", s.attempts]].map(([l, v]) =>
    <Card key={l}><p className="text-white/60 text-sm">{l}</p><p className="font-display text-3xl font-bold text-brand">{v}</p></Card>)}</div>;
}

function Add({ ph, onAdd, label = "Add" }: any) {
  const [v, setV] = useState("");
  return <form className="flex gap-2" onSubmit={async e => { e.preventDefault(); if (v.trim()) { await onAdd(v.trim()); setV(""); } }}>
    <Input placeholder={ph} value={v} onChange={(e: any) => setV(e.target.value)} /><Btn>{label}</Btn></form>;
}

function Content() {
  const [langs, setL] = useState<any[]>([]); const [courses, setC] = useState<any[]>([]); const [sel, setSel] = useState<string>(""); const [d, setD] = useState<any>(null);
  const [err, setErr] = useState(""); const [nc, setNc] = useState({ language: "", title: "", level: "beginner" });
  const run = async (f: () => Promise<any>) => { setErr(""); try { await f(); await load(); } catch (e: any) { setErr(e.message); } };
  const load = async () => { setL(await api("/languages")); setC(await api("/admin/courses")); if (sel) setD(await api(`/courses/${sel}`).catch(() => null)); };
  useEffect(() => { load(); }, [sel]);
  const pick = (id: string) => { setD(null); setSel(id); };
  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-5">
      <div className="space-y-4">
        <Card className="space-y-3"><h2 className="font-display font-semibold">Languages</h2>
          <div className="flex flex-wrap gap-2">{langs.map(l => <Link key={l._id} href={`/admin/languages/${l._id}`} className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1 text-sm" title="Edit welcome page">{l.name} ✎</Link>)}</div>
          <Add ph="New language (e.g. Yoruba)" onAdd={(n: string) => run(() => api("/admin/languages", { body: { name: n, code: n.slice(0, 2).toLowerCase() + Math.random().toString(36).slice(2, 5) } }))} /></Card>
        <Card className="space-y-3"><h2 className="font-display font-semibold">New course</h2>
          <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={nc.language} onChange={e => setNc({ ...nc, language: e.target.value })}><option value="">Language…</option>{langs.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}</select>
          <select className="w-full rounded-xl bg-white/10 px-3 py-2.5" value={nc.level} onChange={e => setNc({ ...nc, level: e.target.value })}>{["beginner", "intermediate", "advanced"].map(x => <option key={x}>{x}</option>)}</select>
          <Input placeholder="Course title" value={nc.title} onChange={(e: any) => setNc({ ...nc, title: e.target.value })} />
          <Btn className="w-full" onClick={() => run(async () => { const c = await api("/admin/courses", { body: nc }); setNc({ ...nc, title: "" }); pick(c._id); })}>Create course</Btn></Card>
        <Card className="space-y-1"><h2 className="font-display font-semibold mb-2">Courses</h2>
          {courses.map(c => <button key={c._id} onClick={() => pick(c._id)} className={`w-full text-left rounded-lg px-3 py-2 ${sel === c._id ? "bg-brand/25" : "hover:bg-white/10"}`}>{c.title} <span className="text-xs text-white/50">{c.published ? "• live" : "• draft"}</span></button>)}</Card>
      </div>
      <div className="space-y-4"><Err m={err} />
        {!d ? <Card className="text-white/60">Select or create a course to manage its modules and lessons.</Card> : <>
          <Card className="flex items-center gap-3 flex-wrap"><div className="mr-auto"><h2 className="font-display text-xl font-semibold">{d.course.title}</h2><p className="text-sm text-white/60">{d.course.published ? "Visible to learners" : "Draft — hidden from learners"}</p></div>
            <Btn variant={d.course.published ? "ghost" : "accent"} onClick={() => run(() => api(`/admin/courses/${sel}`, { method: "PUT", body: { published: !d.course.published } }))}>{d.course.published ? "Unpublish" : "Publish course"}</Btn>
            <Btn variant="danger" onClick={() => confirm("Delete this course and all its lessons?") && run(async () => { await api(`/admin/courses/${sel}`, { method: "DELETE" }); setSel(""); setD(null); })}>Delete</Btn></Card>
          {d.modules.map((m: any) => (
            <Card key={m._id} className="space-y-3">
              <div className="flex items-center"><h3 className="font-display font-semibold mr-auto">{m.title}</h3>
                <Btn variant="danger" onClick={() => confirm("Delete module and its lessons?") && run(() => api(`/admin/modules/${m._id}`, { method: "DELETE" }))}>Delete</Btn></div>
              {d.lessons.filter((l: any) => l.module === m._id).map((l: any) => (
                <Link key={l._id} href={`/admin/lessons/${l._id}`} className="flex items-center gap-3 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2">
                  <span className="flex-1">{l.title}</span><span className={`text-xs ${l.published ? "text-emerald-300" : "text-white/50"}`}>{l.published ? "Published" : "Draft"}</span><span className="text-brand text-sm">Edit →</span></Link>))}
              <Add ph="New lesson title" label="Add lesson" onAdd={(t: string) => run(() => api("/admin/lessons", { body: { course: sel, module: m._id, title: t, order: d.lessons.length + 1 } }))} />
            </Card>))}
          <Card><Add ph="New module title (e.g. Numbers)" label="Add module" onAdd={(t: string) => run(() => api("/admin/modules", { body: { course: sel, title: t, order: d.modules.length + 1 } }))} /></Card>
        </>}
      </div>
    </div>
  );
}

function Learners() {
  const [l, setL] = useState<any[] | null>(null); useEffect(() => { api("/admin/learners").then(setL); }, []);
  if (!l) return <Spin />;
  return <Card><h2 className="font-display font-semibold mb-3">{l.length} learners</h2>{l.map(u => <div key={u._id} className="flex gap-3 py-2 border-t border-white/10 text-sm"><span className="flex-1">{u.name}</span><span className="text-white/60 hidden sm:block">{u.email}</span><span className="text-accent">{u.completed} done</span></div>)}</Card>;
}

function News() {
  const [a, setA] = useState<any[]>([]); const [f, setF] = useState({ title: "", body: "" });
  const load = () => api("/announcements").then(setA); useEffect(() => { load(); }, []);
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card className="space-y-3"><h2 className="font-display font-semibold">Publish announcement</h2>
        <Input placeholder="Title" value={f.title} onChange={(e: any) => setF({ ...f, title: e.target.value })} />
        <textarea className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 min-h-28 outline-none focus:border-brand" placeholder="Message" value={f.body} onChange={e => setF({ ...f, body: e.target.value })} />
        <Btn onClick={async () => { if (f.title && f.body) { await api("/admin/announcements", { body: f }); setF({ title: "", body: "" }); load(); } }}>Publish</Btn></Card>
      <div className="space-y-3">{a.map(x => <Card key={x._id}><p className="font-semibold">{x.title}</p><p className="text-sm text-white/70">{x.body}</p>
        <Btn variant="danger" className="mt-2 !py-1 text-sm" onClick={async () => { await api(`/admin/announcements/${x._id}`, { method: "DELETE" }); load(); }}>Remove</Btn></Card>)}</div>
    </div>
  );
}

const wa = (n: string) => { let d = (n || "").replace(/\D/g, ""); if (d.startsWith("0")) d = "234" + d.slice(1); return "https://wa.me/" + d; };
function Volunteers() {
  const [v, setV] = useState<any[] | null>(null); const [f, setF] = useState("all");
  const load = () => api("/admin/volunteers").then(setV); useEffect(() => { load(); }, []);
  if (!v) return <Spin />;
  const list = v.filter(x => f === "all" || x.status === f);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center"><span className="text-white/60 text-sm">{v.length} volunteers</span>
        {["all", "new", "contacted", "recorded", "declined"].map(s => <button key={s} onClick={() => setF(s)} className={`px-3 py-1 rounded-lg text-sm ${f === s ? "bg-brand text-navy-900" : "bg-white/10"}`}>{s}</button>)}</div>
      {list.map(x => (
        <Card key={x._id} className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold mr-auto">{x.name} <span className="ml-2 text-xs bg-accent/20 text-accent rounded px-2 py-0.5">{x.language}</span></p>
            <select value={x.status} onChange={async e => { await api(`/admin/volunteers/${x._id}`, { method: "PUT", body: { status: e.target.value } }); load(); }} className="rounded-lg bg-white/10 px-2 py-1 text-sm">
              {["new", "contacted", "recorded", "declined"].map(s => <option key={s}>{s}</option>)}</select></div>
          <p className="text-sm text-white/70">{x.phone && <>📞 {x.phone} </>}{x.email && <>✉️ {x.email}</>}</p>
          {x.notes && <p className="text-sm text-white/60">“{x.notes}”</p>}
          <div className="flex gap-2">{x.phone && <a href={wa(x.phone)} target="_blank" rel="noopener" className="rounded-lg px-3 py-1.5 bg-emerald-500/20 text-emerald-300 text-sm">WhatsApp</a>}
            {x.email && <a href={`mailto:${x.email}`} className="rounded-lg px-3 py-1.5 bg-white/10 text-sm">Email</a>}
            <Btn variant="danger" className="ml-auto !py-1.5 text-sm" onClick={async () => { if (confirm("Delete this volunteer?")) { await api(`/admin/volunteers/${x._id}`, { method: "DELETE" }); load(); } }}>Delete</Btn></div>
        </Card>))}
      {!list.length && <p className="text-white/60">No volunteers here yet.</p>}
    </div>
  );
}
