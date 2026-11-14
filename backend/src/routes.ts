import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import multer from "multer";
import { z } from "zod";
import { Types } from "mongoose";
import rateLimit from "express-rate-limit";
import { v2 as cloud } from "cloudinary";
import { User, Language, Course, Module, Lesson, Quiz, Attempt, Progress, Enrolment, Announcement, Volunteer, Partner, Post } from "./models";
import { sendMail } from "./mail";
import { auth, admin, signAccess, signRefresh, verifyRefresh } from "./auth";

cloud.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, secure: true,
});
const r = Router();
const prod = process.env.NODE_ENV === "production";
const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const pick = (o: any, keys: string[]) => Object.fromEntries(keys.filter(k => o?.[k] !== undefined).map(k => [k, o[k]]));
const pub = (u: any) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const nf = (s: any) => s.status(404).json({ error: "Not found" });
const destroy = (id: string) => cloud.uploader.destroy(id, { resource_type: "video" }).catch(() => {});


const siteUrl = () => (process.env.CLIENT_URL || "").split(",")[0];
async function sendWelcome(u: any) {
  const name = String(u.name).replace(/[<>&"]/g, "").split(" ")[0];
  const community = process.env.COMMUNITY_URL;
  await sendMail(u.email, "Welcome to Audio Arts Africa Language Academy",
    `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#031a45">
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Thank you for joining Audio Arts Africa Language Academy. Learn Nigerian languages for free, with native voices.</p>
      <p style="margin:24px 0"><a href="${siteUrl()}/courses" style="background:#ff9f2e;color:#031a45;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">Choose your language</a></p>
      ${community ? `<p>Join our learner community and practise with others: <a href="${community}">${community}</a></p>` : ""}
      <p>Are you a native speaker? <a href="${siteUrl()}/volunteer">Lend us your voice</a>.</p>
      <p style="font-size:13px;color:#555">Learn a Language. Connect with a People.</p></div>`);
}

async function session(res: any, u: any) {
  const rt = signRefresh(u);
  u.refreshHashes = [...u.refreshHashes, sha(rt)].slice(-5);
  await u.save();
  res.cookie("rt", rt, { httpOnly: true, secure: prod, sameSite: prod ? "none" : "lax", maxAge: 30 * 864e5, path: "/api/auth" });
  res.json({ accessToken: signAccess(u), user: pub(u) });
}

/* ---------------- AUTH ---------------- */
const pw = z.string().min(8).max(100);
r.post("/auth/register", async (q, s) => {
  const b = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: pw }).parse(q.body);
  if (await User.exists({ email: b.email.toLowerCase() })) return s.status(409).json({ error: "Email already registered" });
  const nu = await User.create({ name: b.name, email: b.email, passwordHash: await bcrypt.hash(b.password, 12) });
  sendWelcome(nu).catch(() => {}); // never block sign-up on email
  await session(s, nu);
});
r.post("/auth/login", async (q, s) => {
  const b = z.object({ email: z.string().email(), password: z.string() }).parse(q.body);
  const u = await User.findOne({ email: b.email.toLowerCase() });
  if (!u || !(await bcrypt.compare(b.password, u.passwordHash))) return s.status(401).json({ error: "Invalid email or password" });
  await session(s, u);
});
r.post("/auth/refresh", async (q, s) => {
  try {
    const t = q.cookies.rt; const p = verifyRefresh(t); const u = await User.findById(p.sub);
    if (!u || !u.refreshHashes.includes(sha(t))) throw 0;
    s.json({ accessToken: signAccess(u), user: pub(u) });
  } catch { s.status(401).json({ error: "Session expired" }); }
});
r.post("/auth/logout", async (q, s) => {
  try { const t = q.cookies.rt; const p = verifyRefresh(t); await User.updateOne({ _id: p.sub }, { $pull: { refreshHashes: sha(t) } }); } catch {}
  s.clearCookie("rt", { path: "/api/auth", sameSite: prod ? "none" : "lax", secure: prod }).json({ ok: true });
});
r.post("/auth/forgot", async (q, s) => {
  const { email } = z.object({ email: z.string().email() }).parse(q.body);
  const u = await User.findOne({ email: email.toLowerCase() });
  if (u) {
    const t = crypto.randomBytes(32).toString("hex");
    u.resetHash = sha(t); u.resetExpires = new Date(Date.now() + 3600e3); await u.save();
    const link = `${(process.env.CLIENT_URL || "").split(",")[0]}/auth/reset?token=${t}`;
    const name = String(u.name).replace(/[<>&"]/g, "");
    const sent = await sendMail(u.email, "Reset your password – Audio Arts Africa Language Academy",
      `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#031a45">
        <h2>Reset your password</h2><p>Hello ${name},</p>
        <p>We received a request to reset your password. Tap the button below to choose a new one. This link expires in 1 hour.</p>
        <p style="margin:28px 0"><a href="${link}" style="background:#ff9f2e;color:#031a45;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">Choose a new password</a></p>
        <p style="font-size:13px;color:#555">If you did not ask for this, you can ignore this email — your password will not change.</p>
        <p style="font-size:13px;color:#555">Audio Arts Africa Language Academy</p></div>`);
    if (!sent) console.log(`PASSWORD RESET LINK for ${u.email}: ${link}`); // fallback until email is configured
  }
  s.json({ ok: true });
});
r.post("/auth/reset", async (q, s) => {
  const b = z.object({ token: z.string(), password: pw }).parse(q.body);
  const u = await User.findOne({ resetHash: sha(b.token), resetExpires: { $gt: new Date() } });
  if (!u) return s.status(400).json({ error: "Reset link is invalid or expired" });
  u.passwordHash = await bcrypt.hash(b.password, 12); u.resetHash = undefined; u.resetExpires = undefined; u.refreshHashes = [];
  await u.save(); s.json({ ok: true });
});
r.get("/me", auth, async (q: any, s) => {
  const u: any = await User.findById(q.uid).populate("language", "name greeting");
  s.json({ ...pub(u), language: u.language || null });
});
r.patch("/me", auth, async (q: any, s) => {
  const b = z.object({ name: z.string().min(2).max(80).optional(), password: pw.optional(), language: z.string().optional() }).parse(q.body);
  const u: any = await User.findById(q.uid);
  if (b.name) u.name = b.name;
  if (b.password) u.passwordHash = await bcrypt.hash(b.password, 12);
  if (b.language && (await Language.exists({ _id: b.language }))) u.language = b.language;
  await u.save(); s.json(pub(u));
});

/* ---------------- LEARNER ---------------- */
const isAdmin = async (uid: string) => (await User.findById(uid).select("role"))?.role === "admin";

r.get("/languages", async (_, s) => {
  const ls: any[] = await Language.find().select("name code greeting tagline").sort("name").lean();
  const cs = await Course.aggregate([{ $match: { published: true } }, { $group: { _id: "$language", n: { $sum: 1 } } }]);
  const m: any = Object.fromEntries(cs.map((x: any) => [String(x._id), x.n]));
  s.json(ls.map(l => ({ ...l, courses: m[String(l._id)] || 0 })));
});
r.get("/languages/:id", auth, async (q, s) => { const l = await Language.findById(q.params.id).lean(); l ? s.json(l) : nf(s); });

r.get("/courses", auth, async (q: any, s) => {
  const courses: any[] = await Course.find({ published: true }).populate("language", "name code").lean();
  const total = await Lesson.aggregate([{ $match: { published: true } }, { $group: { _id: "$course", n: { $sum: 1 } } }]);
  const done = await Progress.aggregate([{ $match: { user: new Types.ObjectId(q.uid), completed: true } }, { $group: { _id: "$course", n: { $sum: 1 } } }]);
  const m = (a: any[]) => Object.fromEntries(a.map(x => [String(x._id), x.n]));
  const T = m(total), D = m(done);
  s.json(courses.map(c => ({ ...c, lessons: T[c._id] || 0, completed: Math.min(D[c._id] || 0, T[c._id] || 0) })));
});

r.get("/courses/:id", auth, async (q: any, s) => {
  const adm = await isAdmin(q.uid);
  const c: any = await Course.findById(q.params.id).populate("language", "name code").lean();
  if (!c || (!c.published && !adm)) return nf(s);
  const modules = await Module.find({ course: c._id }).sort("order").lean();
  const lessons = await Lesson.find({ course: c._id, ...(adm ? {} : { published: true }) }).select("title module order published").sort("order").lean();
  const prog = await Progress.find({ user: q.uid, course: c._id }).lean();
  s.json({ course: c, modules, lessons, progress: Object.fromEntries(prog.map((p: any) => [String(p.lesson), { completed: p.completed, bestScore: p.bestScore }])) });
});

r.get("/lessons/:id", auth, async (q: any, s) => {
  const adm = await isAdmin(q.uid);
  const l: any = await Lesson.findById(q.params.id).lean();
  const c: any = l && (await Course.findById(l.course).lean());
  if (!l || !c || ((!l.published || !c.published) && !adm)) return nf(s);
  if (!adm) await Enrolment.updateOne({ user: q.uid, course: l.course }, { $setOnInsert: { user: q.uid, course: l.course } }, { upsert: true });
  const progress = adm ? null : await Progress.findOneAndUpdate({ user: q.uid, lesson: l._id },
    { $set: { course: l.course, lastAccess: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
  s.json({ lesson: l, course: { _id: c._id, title: c.title }, hasQuiz: !!(await Quiz.exists({ lesson: l._id })), progress });
});

r.get("/lessons/:id/quiz", auth, async (q: any, s) => {
  const qz: any = await Quiz.findOne({ lesson: q.params.id }).lean();
  if (!qz) return nf(s);
  s.json({ questions: qz.questions.map((x: any) => ({ prompt: x.prompt, options: x.options })) });
});

r.post("/lessons/:id/quiz", auth, async (q: any, s) => {
  const qz: any = await Quiz.findOne({ lesson: q.params.id }).lean();
  const l: any = await Lesson.findById(q.params.id).lean();
  if (!qz || !l) return nf(s);
  const ans = z.array(z.number().int().nullable()).parse(q.body.answers);
  const results = qz.questions.map((x: any, i: number) => ({ correct: ans[i] === x.answerIndex, answerIndex: x.answerIndex }));
  const score = results.filter((x: any) => x.correct).length, total = results.length;
  const percent = total ? Math.round((100 * score) / total) : 0, passed = percent >= 60;
  await Attempt.create({ user: q.uid, lesson: l._id, score, total });
  await Progress.findOneAndUpdate({ user: q.uid, lesson: l._id },
    { $set: { course: l.course, lastAccess: new Date(), ...(passed ? { completed: true } : {}) }, $max: { bestScore: percent } },
    { upsert: true, setDefaultsOnInsert: true });
  s.json({ score, total, percent, passed, results });
});

r.post("/lessons/:id/complete", auth, async (q: any, s) => {
  const l: any = await Lesson.findById(q.params.id).lean();
  if (!l || !l.published) return nf(s);
  if (await Quiz.exists({ lesson: l._id })) return s.status(400).json({ error: "Pass the quiz to complete this lesson" });
  await Progress.updateOne({ user: q.uid, lesson: l._id }, { $set: { course: l.course, completed: true, lastAccess: new Date() } }, { upsert: true });
  s.json({ ok: true });
});

r.get("/me/progress", auth, async (q: any, s) => {
  const ps: any[] = await Progress.find({ user: q.uid }).lean();
  const scored = ps.filter(p => p.bestScore > 0);
  const recent: any[] = await Attempt.find({ user: q.uid }).sort("-createdAt").limit(8).populate("lesson", "title").lean();
  s.json({
    completed: ps.filter(p => p.completed).length, started: ps.length,
    avgScore: scored.length ? Math.round(scored.reduce((a, p) => a + p.bestScore, 0) / scored.length) : 0,
    recent: recent.map(a => ({ lesson: a.lesson?.title, score: a.score, total: a.total, date: a.createdAt })),
  });
});

r.get("/announcements", auth, async (_, s) => s.json(await Announcement.find().sort("-createdAt").limit(5)));

/* ---------------- ADMIN ---------------- */
const crud = (p: string, M: any, keys: string[], need: string[]) => {
  r.post(`/admin/${p}`, auth, admin, async (q, s) => {
    const d: any = pick(q.body, keys);
    for (const k of need) if (!d[k]) return s.status(400).json({ error: `${k} is required` });
    s.status(201).json(await M.create(d));
  });
  r.put(`/admin/${p}/:id`, auth, admin, async (q, s) => {
    const d = await M.findByIdAndUpdate(q.params.id, pick(q.body, keys), { new: true, runValidators: true });
    d ? s.json(d) : nf(s);
  });
};
crud("languages", Language, ["name", "code", "greeting", "tagline", "history", "culture", "alphabet", "specialChars", "funFacts"], ["name", "code"]);
crud("courses", Course, ["language", "title", "level", "description", "published"], ["language", "title"]);
crud("modules", Module, ["course", "title", "order"], ["course", "title"]);

r.get("/admin/stats", auth, admin, async (_, s) => {
  const [learners, courses, lessons, published, attempts] = await Promise.all([
    User.countDocuments({ role: "learner" }), Course.countDocuments(), Lesson.countDocuments(),
    Lesson.countDocuments({ published: true }), Attempt.countDocuments(),
  ]);
  s.json({ learners, courses, lessons, published, attempts });
});
r.get("/admin/courses", auth, admin, async (_, s) => s.json(await Course.find().populate("language", "name code").sort("-createdAt")));
r.get("/admin/learners", auth, admin, async (_, s) => {
  const us: any[] = await User.find({ role: "learner" }).select("name email createdAt").sort("-createdAt").lean();
  const done = await Progress.aggregate([{ $match: { completed: true } }, { $group: { _id: "$user", n: { $sum: 1 } } }]);
  const D = Object.fromEntries(done.map((x: any) => [String(x._id), x.n]));
  s.json(us.map(u => ({ ...u, completed: D[u._id] || 0 })));
});

const delLessons = async (filter: any) => {
  const ls: any[] = await Lesson.find(filter);
  const ids = ls.map(l => l._id);
  ls.forEach(l => l.items.forEach((i: any) => i.audioPublicId && destroy(i.audioPublicId)));
  await Promise.all([Quiz.deleteMany({ lesson: { $in: ids } }), Progress.deleteMany({ lesson: { $in: ids } }), Attempt.deleteMany({ lesson: { $in: ids } }), Lesson.deleteMany({ _id: { $in: ids } })]);
};
r.delete("/admin/languages/:id", auth, admin, async (q, s) => {
  if (await Course.exists({ language: q.params.id })) return s.status(409).json({ error: "Delete this language's courses first" });
  await Language.findByIdAndDelete(q.params.id); s.json({ ok: true });
});
r.delete("/admin/courses/:id", auth, admin, async (q, s) => {
  await delLessons({ course: q.params.id });
  await Promise.all([Module.deleteMany({ course: q.params.id }), Enrolment.deleteMany({ course: q.params.id }), Course.findByIdAndDelete(q.params.id)]);
  s.json({ ok: true });
});
r.delete("/admin/modules/:id", auth, admin, async (q, s) => {
  await delLessons({ module: q.params.id }); await Module.findByIdAndDelete(q.params.id); s.json({ ok: true });
});
r.delete("/admin/lessons/:id", auth, admin, async (q, s) => { await delLessons({ _id: q.params.id }); s.json({ ok: true }); });

const item = z.object({
  kind: z.enum(["word", "sentence"]).default("word"), text: z.string().min(1), translation: z.string().min(1),
  audioUrl: z.string().optional(), audioPublicId: z.string().optional(),
});
r.post("/admin/lessons", auth, admin, async (q, s) => {
  const b = z.object({ course: z.string(), module: z.string(), title: z.string().min(1), order: z.number().optional() }).parse(q.body);
  s.status(201).json(await Lesson.create({ ...b, items: [], published: false }));
});
r.put("/admin/lessons/:id", auth, admin, async (q, s) => {
  const old: any = await Lesson.findById(q.params.id);
  if (!old) return nf(s);
  const d: any = pick(q.body, ["title", "order", "published", "items", "module"]);
  if (d.items) {
    d.items = z.array(item).parse(d.items);
    const keep = new Set(d.items.map((i: any) => i.audioPublicId).filter(Boolean));
    old.items.forEach((i: any) => i.audioPublicId && !keep.has(i.audioPublicId) && destroy(i.audioPublicId));
  }
  old.set(d);
  if (old.published && !old.items.length) return s.status(400).json({ error: "Add at least one item before publishing" });
  await old.save(); s.json(old);
});

const quizSchema = z.array(z.object({
  prompt: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(6), answerIndex: z.number().int().min(0),
}).refine(x => x.answerIndex < x.options.length, "answerIndex out of range"));
r.get("/admin/lessons/:id/quiz", auth, admin, async (q, s) => s.json({ questions: (await Quiz.findOne({ lesson: q.params.id }))?.questions || [] }));
r.put("/admin/lessons/:id/quiz", auth, admin, async (q, s) => {
  const questions = quizSchema.parse(q.body.questions);
  if (!questions.length) { await Quiz.deleteOne({ lesson: q.params.id }); return s.json({ questions: [] }); }
  s.json(await Quiz.findOneAndUpdate({ lesson: q.params.id }, { questions }, { upsert: true, new: true }));
});

const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 }, fileFilter: (_q, f, cb) => cb(null, /^audio\//.test(f.mimetype)) });
r.post("/admin/upload", auth, admin, up.single("file"), (q: any, s) => {
  if (!q.file) return s.status(400).json({ error: "Audio file required (max 15MB)" });
  cloud.uploader.upload_stream({ resource_type: "video", folder: "audio-arts-academy" }, (e, res) =>
    e || !res ? s.status(500).json({ error: "Upload failed" }) : s.json({ url: res.secure_url, publicId: res.public_id })).end(q.file.buffer);
});

r.post("/admin/announcements", auth, admin, async (q, s) => {
  s.status(201).json(await Announcement.create(z.object({ title: z.string().min(1), body: z.string().min(1) }).parse(q.body)));
});
r.delete("/admin/announcements/:id", auth, admin, async (q, s) => { await Announcement.findByIdAndDelete(q.params.id); s.json({ ok: true }); });

/* ---------------- VOLUNTEERS ---------------- */
const volLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 });
r.post("/volunteers", volLimit, async (q, s) => {
  if (q.body?.website) return s.json({ ok: true }); // honeypot: bots fill this hidden field
  const b = z.object({
    name: z.string().min(2).max(80), phone: z.string().max(30).optional(), email: z.string().email().optional().or(z.literal("")),
    language: z.string().min(2).max(40), notes: z.string().max(500).optional(), consent: z.literal(true),
    publicName: z.boolean().optional(), link: z.string().url().max(200).optional().or(z.literal("")),
  }).refine(x => (x.phone && x.phone.trim()) || x.email, { message: "Please give a phone number or an email" }).parse(q.body);
  await Volunteer.create({ name: b.name, phone: b.phone, email: b.email || undefined, language: b.language, notes: b.notes, publicName: !!b.publicName, link: b.publicName && b.link ? b.link : undefined });
  s.status(201).json({ ok: true });
});
r.get("/admin/volunteers", auth, admin, async (_, s) => s.json(await Volunteer.find().sort("-createdAt")));
r.put("/admin/volunteers/:id", auth, admin, async (q, s) => {
  const b = z.object({ status: z.enum(["new", "contacted", "recorded", "declined"]).optional(), onWall: z.boolean().optional() }).parse(q.body);
  const d = await Volunteer.findByIdAndUpdate(q.params.id, b, { new: true });
  d ? s.json(d) : nf(s);
});
r.delete("/admin/volunteers/:id", auth, admin, async (q, s) => { await Volunteer.findByIdAndDelete(q.params.id); s.json({ ok: true }); });

/* ---------------- WALL OF VOICES (public, only consenting volunteers the admin approved) ---------------- */
r.get("/voices", async (_, s) => s.json(await Volunteer.find({ onWall: true, publicName: true }).select("name language link").sort("name").lean()));

/* ---------------- IMPACT (public, aggregate numbers only) ---------------- */
r.get("/impact", async (_, s) => {
  const since = new Date(Date.now() - 30 * 864e5);
  const [learners, active, langs, lessons, attempts, voices] = await Promise.all([
    User.countDocuments({ role: "learner" }),
    Progress.distinct("user", { lastAccess: { $gte: since } }).then(a => a.length),
    Course.distinct("language", { published: true }).then(a => a.length),
    Lesson.countDocuments({ published: true }),
    Attempt.countDocuments(),
    Volunteer.countDocuments({ status: "recorded" }),
  ]);
  const rec = await Lesson.aggregate([{ $match: { published: true } }, { $unwind: "$items" }, { $match: { "items.audioUrl": { $exists: true, $ne: "" } } }, { $count: "n" }]);
  const all = await Lesson.aggregate([{ $match: { published: true } }, { $project: { n: { $size: "$items" } } }, { $group: { _id: null, n: { $sum: "$n" } } }]);
  s.set("Cache-Control", "public, max-age=300");
  s.json({ learners, activeLearners: active, languages: langs, lessons, wordsRecorded: rec[0]?.n || 0, wordsAndPhrases: all[0]?.n || 0, quizAttempts: attempts, volunteerVoices: voices });
});

/* ---------------- SPONSORS & PARTNERS ---------------- */
const partnerLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 });
r.post("/partners", partnerLimit, async (q, s) => {
  if (q.body?.website) return s.json({ ok: true });
  const b = z.object({
    name: z.string().min(2).max(80), organisation: z.string().max(120).optional(), email: z.string().email().optional().or(z.literal("")),
    phone: z.string().max(30).optional(), interest: z.string().max(60).optional(), message: z.string().max(1000).optional(),
  }).refine(x => x.email || (x.phone && x.phone.trim()), { message: "Please give an email or a phone number" }).parse(q.body);
  await Partner.create({ ...b, email: b.email || undefined });
  if (process.env.NOTIFY_EMAIL) sendMail(process.env.NOTIFY_EMAIL, "New sponsor / partner enquiry",
    `<p><b>${String(b.name).replace(/[<>&]/g, "")}</b> (${String(b.organisation || "no organisation").replace(/[<>&]/g, "")}) is interested in: ${String(b.interest || "—").replace(/[<>&]/g, "")}.</p><p>Open Admin → Partners to reply.</p>`).catch(() => {});
  s.status(201).json({ ok: true });
});
r.get("/admin/partners", auth, admin, async (_, s) => s.json(await Partner.find().sort("-createdAt")));
r.put("/admin/partners/:id", auth, admin, async (q, s) => {
  const { status } = z.object({ status: z.enum(["new", "contacted", "closed"]) }).parse(q.body);
  const d = await Partner.findByIdAndUpdate(q.params.id, { status }, { new: true }); d ? s.json(d) : nf(s);
});
r.delete("/admin/partners/:id", auth, admin, async (q, s) => { await Partner.findByIdAndDelete(q.params.id); s.json({ ok: true }); });

/* ---------------- LANGUAGE HUB (blog) ---------------- */
const slugify = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "post";
const postSchema = z.object({ title: z.string().min(3).max(150), excerpt: z.string().max(300).optional(), body: z.string().max(20000).optional(), language: z.string().max(40).optional(), published: z.boolean().optional() });
r.get("/posts", async (_, s) => { s.set("Cache-Control", "public, max-age=120"); s.json(await Post.find({ published: true }).select("title slug excerpt language publishedAt").sort("-publishedAt").lean()); });
r.get("/posts/:slug", async (q, s) => { const p = await Post.findOne({ slug: q.params.slug, published: true }).lean(); p ? s.json(p) : nf(s); });
r.get("/admin/posts", auth, admin, async (_, s) => s.json(await Post.find().sort("-createdAt").lean()));
r.post("/admin/posts", auth, admin, async (q, s) => {
  const b = postSchema.parse(q.body); let slug = slugify(b.title);
  if (await Post.exists({ slug })) slug += "-" + Date.now().toString(36).slice(-4);
  s.status(201).json(await Post.create({ ...b, slug, publishedAt: b.published ? new Date() : undefined }));
});
r.put("/admin/posts/:id", auth, admin, async (q, s) => {
  const b = postSchema.partial().parse(q.body); const p: any = await Post.findById(q.params.id);
  if (!p) return nf(s);
  p.set(b); if (b.published && !p.publishedAt) p.publishedAt = new Date();
  await p.save(); s.json(p);
});
r.delete("/admin/posts/:id", auth, admin, async (q, s) => { await Post.findByIdAndDelete(q.params.id); s.json({ ok: true }); });

export default r;
