"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import FlashCard, { FlashItem } from "./FlashCard";
import { Card } from "./ui";

const LANGS: [string, string][] = [["igbo", "Igbo"], ["hausa", "Hausa"], ["yoruba", "Yorùbá"]];

// Shown instantly. Once the live lesson loads (with native audio) it replaces these.
const FALLBACK: Record<string, FlashItem[]> = {
  igbo: [{ text: "Ndewo", translation: "Hello" }, { text: "Ụtụtụ ọma", translation: "Good morning" }, { text: "Ehihie ọma", translation: "Good afternoon" }],
  hausa: [{ text: "Sannu", translation: "Hello" }, { text: "Barka da safe", translation: "Good morning" }, { text: "Barka da rana", translation: "Good afternoon" }],
  yoruba: [{ text: "Báwo ni", translation: "Hello" }, { text: "Ẹ kú àárọ̀", translation: "Good morning" }, { text: "Ẹ kú ọ̀sán", translation: "Good afternoon" }],
};

/** Tracking: fires a browser event (and dataLayer / gtag if you add analytics later) and remembers the source so the sign-up is attributed. */
function trackCta(language: string) {
  const detail = { language, source: "home_demo" };
  try { localStorage.setItem("aaa_src", JSON.stringify({ ...detail, t: Date.now() })); } catch {}
  window.dispatchEvent(new CustomEvent("aaa:demo_cta_click", { detail }));
  (window as any).dataLayer?.push({ event: "demo_cta_click", ...detail });
  (window as any).gtag?.("event", "demo_cta_click", detail);
}

export default function TryLesson() {
  const [lang, setLang] = useState("igbo");
  const [data, setData] = useState<Record<string, any>>({});
  const [loaded, setLoaded] = useState(false);
  const [i, setI] = useState(0); const [show, setShow] = useState(false);
  useEffect(() => { api("/demo").then(d => setData(d || {})).catch(() => {}).finally(() => setLoaded(true)); }, []);

  const live = data[lang]?.items;
  const cards: FlashItem[] = live && live.length >= 3 ? live.slice(0, 3) : FALLBACK[lang];
  const more = data[lang]?.total ? Math.max(data[lang].total - 3, 0) : 240;
  const pick = (k: string) => { setLang(k); setI(0); setShow(false); };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {LANGS.map(([k, n]) => <button key={k} onClick={() => pick(k)} className={`px-4 py-2 rounded-xl font-semibold ${lang === k ? "bg-brand text-navy-900" : "bg-white/10"}`}>{n}</button>)}
      </div>
      {!loaded && <p className="text-center text-xs text-white/50">Loading native audio…</p>}
      {i < 3 ? (
        <FlashCard item={cards[i]} index={i} total={3} revealed={show} nextLabel="Next →"
          onReveal={() => setShow(true)} onNext={() => { setShow(false); setI(i + 1); }} />
      ) : (
        <Card className="text-center space-y-4 py-8">
          <p className="text-3xl">🎉</p>
          <p className="font-display text-xl font-semibold leading-snug">You just learned 3 words. There are {more} more in this language lesson.</p>
          <Link href="/signup" onClick={() => trackCta(lang)} className="block rounded-xl bg-accent text-navy-900 font-bold text-lg px-6 py-4 hover:brightness-110">Start learning free →</Link>
        </Card>
      )}
    </div>
  );
}
