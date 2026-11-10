import nodemailer from "nodemailer";

const FROM_NAME = () => process.env.MAIL_FROM_NAME || "Audio Arts Africa Language Academy";

/** Option 1: Gmail with an App Password (set GMAIL_USER + GMAIL_APP_PASSWORD). */
async function viaGmail(to: string, subject: string, html: string) {
  const t = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: process.env.GMAIL_USER, pass: (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "") },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  });
  await t.sendMail({ from: `"${FROM_NAME()}" <${process.env.GMAIL_USER}>`, to, subject, html });
}

/** Option 2: Brevo HTTPS API (set BREVO_API_KEY + MAIL_FROM). Works where SMTP ports are blocked. */
async function viaBrevo(to: string, subject: string, html: string) {
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY as string, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: { name: FROM_NAME(), email: process.env.MAIL_FROM }, to: [{ email: to }], subject, htmlContent: html }),
  });
  if (!r.ok) throw new Error(`Brevo ${r.status} ${await r.text()}`);
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try { await viaGmail(to, subject, html); return true; } catch (e: any) { console.error("Gmail send failed:", e.message); }
  }
  if (process.env.BREVO_API_KEY && process.env.MAIL_FROM) {
    try { await viaBrevo(to, subject, html); return true; } catch (e: any) { console.error("Brevo send failed:", e.message); }
  }
  return false;
}
