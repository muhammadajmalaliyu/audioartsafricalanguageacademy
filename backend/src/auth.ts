import jwt from "jsonwebtoken";
import { User } from "./models";

const A = () => process.env.JWT_ACCESS_SECRET as string;
const R = () => process.env.JWT_REFRESH_SECRET as string;
export const signAccess = (u: any) => jwt.sign({ sub: String(u._id), role: u.role }, A(), { expiresIn: "15m" });
export const signRefresh = (u: any) => jwt.sign({ sub: String(u._id) }, R(), { expiresIn: "30d" });
export const verifyRefresh = (t: string) => jwt.verify(t, R()) as any;

export function auth(req: any, res: any, next: any) {
  try {
    const p: any = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), A());
    req.uid = p.sub; next();
  } catch { res.status(401).json({ error: "Unauthorized" }); }
}
// Role is re-checked in the database on every admin request (never trusted from the token or the UI).
export async function admin(req: any, res: any, next: any) {
  const u = await User.findById(req.uid).select("role");
  if (u?.role === "admin") return next();
  res.status(403).json({ error: "Administrators only" });
}
