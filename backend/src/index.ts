import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import routes from "./routes";
import { User } from "./models";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
const origins = (process.env.CLIENT_URL || "http://localhost:3000").split(",").map(s => s.trim());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }));
app.get("/health", (_, s) => s.json({ ok: true }));
app.use("/api", routes);

app.use((e: any, _q: any, s: any, _n: any) => {
  if (e.name === "ZodError") return s.status(400).json({ error: e.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join("; ") });
  if (e.name === "CastError" || e.name === "ValidationError") return s.status(400).json({ error: "Invalid data" });
  if (e.code === 11000) return s.status(409).json({ error: "Already exists" });
  if (e.name === "MulterError") return s.status(400).json({ error: e.message });
  console.error(e);
  s.status(500).json({ error: "Server error" });
});

// Creates the admin account automatically on first start (no shell needed on Render free tier).
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  if (!email || !process.env.ADMIN_PASSWORD) return;
  if (await User.exists({ email })) return;
  await User.create({ name: process.env.ADMIN_NAME || "Admin", email, role: "admin", passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12) });
  console.log("Admin account created:", email);
}

mongoose.connect(process.env.MONGODB_URI as string).then(async () => {
  await ensureAdmin();
  app.listen(process.env.PORT || 4000, () => console.log("API running"));
}).catch(e => { console.error("DB connection failed", e.message); process.exit(1); });
