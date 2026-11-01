# Audio Arts Africa Language Academy

Monorepo: `frontend/` (Next.js → Vercel) · `backend/` (Express → Render) · MongoDB Atlas · Cloudinary (audio).

## 1. Accounts (all free tiers)
MongoDB Atlas (M0 cluster, allow access from anywhere `0.0.0.0/0`), Cloudinary, Render, Vercel, GitHub.

## 2. Run locally
```bash
cd backend && cp .env.example .env   # fill MONGODB_URI, secrets, Cloudinary, ADMIN_EMAIL/PASSWORD
npm install && npm run seed && npm run dev      # seed creates your admin + sample Hausa Beginner course
cd ../frontend && cp .env.example .env.local && npm install && npm run dev   # http://localhost:3000
```

## 3. Deploy
1. Push this folder to GitHub.
2. **Render** → New → Blueprint (uses `render.yaml`). Set env vars: `MONGODB_URI`, Cloudinary keys, `CLIENT_URL` (your Vercel URL, comma-separate extra domains). Then open the Render Shell and run `npm run seed` (needs `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`).
3. **Vercel** → Import repo, Root Directory `frontend`, env `NEXT_PUBLIC_API_URL` = your Render URL.
4. Visit your site → Log in with the admin email → **Admin → Content** to build lessons and upload recordings.

## Notes
- Render free web services sleep when idle; the first request can take ~30s. 
- Login uses a 15-minute access token plus a 30-day httpOnly refresh cookie. Because Vercel and Render are different domains, some browsers block third-party cookies; attaching custom subdomains (e.g. `learn.` and `api.` on your own domain) fixes this permanently.
- Password-reset links are printed in the Render logs until you add an email service (Resend/Brevo free tier).
- Backups: Atlas M0 has no automated backups; run `mongodump` regularly or upgrade to M10 when you launch publicly.
- Monitoring: Render logs + free UptimeRobot ping on `/health`.
