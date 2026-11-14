import { Schema, model } from "mongoose";
const T = { timestamps: true };
const ref = (m: string) => ({ type: Schema.Types.ObjectId, ref: m, index: true });

export const User = model("User", new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["learner", "admin"], default: "learner", index: true },
  refreshHashes: { type: [String], default: [] },
  language: { type: Schema.Types.ObjectId, ref: "Language" },
  resetHash: String, resetExpires: Date,
}, T));

export const Language = model("Language", new Schema({
  name: { type: String, required: true }, code: { type: String, required: true, unique: true },
  greeting: String, tagline: String, history: String, culture: String, alphabet: String, specialChars: String, funFacts: String,
}, T));

export const Course = model("Course", new Schema({
  language: ref("Language"), title: { type: String, required: true },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  description: String, published: { type: Boolean, default: false },
}, T));

export const Module = model("Module", new Schema({
  course: ref("Course"), title: { type: String, required: true }, order: { type: Number, default: 0 },
}, T));

export const Lesson = model("Lesson", new Schema({
  course: ref("Course"), module: ref("Module"), title: { type: String, required: true },
  order: { type: Number, default: 0 }, published: { type: Boolean, default: false },
  items: [{
    kind: { type: String, enum: ["word", "sentence"], default: "word" },
    text: { type: String, required: true }, translation: { type: String, required: true },
    audioUrl: String, audioPublicId: String,
  }],
}, T));

export const Quiz = model("Quiz", new Schema({
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", unique: true },
  questions: [{ prompt: String, options: [String], answerIndex: Number }],
}, T));

export const Attempt = model("Attempt", new Schema({
  user: ref("User"), lesson: ref("Lesson"), score: Number, total: Number,
}, T));

const prog = new Schema({
  user: ref("User"), lesson: ref("Lesson"), course: ref("Course"),
  completed: { type: Boolean, default: false }, bestScore: { type: Number, default: 0 }, lastAccess: Date,
}, T);
prog.index({ user: 1, lesson: 1 }, { unique: true });
export const Progress = model("Progress", prog);

const enr = new Schema({ user: ref("User"), course: ref("Course") }, T);
enr.index({ user: 1, course: 1 }, { unique: true });
export const Enrolment = model("Enrolment", enr);

export const Announcement = model("Announcement", new Schema({ title: String, body: String }, T));

export const Volunteer = model("Volunteer", new Schema({
  name: { type: String, required: true, trim: true }, phone: String, email: String,
  language: { type: String, required: true }, notes: String,
  status: { type: String, enum: ["new", "contacted", "recorded", "declined"], default: "new", index: true },
  publicName: { type: Boolean, default: false }, link: String, onWall: { type: Boolean, default: false },
}, T));

export const Partner = model("Partner", new Schema({
  name: { type: String, required: true, trim: true }, organisation: String, email: String, phone: String,
  interest: String, message: String,
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new", index: true },
}, T));

export const Post = model("Post", new Schema({
  title: { type: String, required: true }, slug: { type: String, required: true, unique: true },
  excerpt: String, body: { type: String, default: "" }, language: String,
  published: { type: Boolean, default: false, index: true }, publishedAt: Date,
}, T));
