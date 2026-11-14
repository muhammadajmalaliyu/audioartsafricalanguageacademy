"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Spin } from "@/components/ui";

export default function Voices() {
  const [v, setV] = useState<any[] | null>(null);
  useEffect(() => { api("/voices").then(setV).catch(() => setV([])); }, []);
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center py-6">
        <div className="text-4xl">🎙️</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Wall of Voices</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">Thank you to the native speakers who lend their voices so that Nigerian languages can be heard, learned and preserved.</p>
      </section>
      {!v ? <Spin /> : v.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">{v.map((x, i) => (
          <Card key={i} className="text-center space-y-1">
            <p className="font-display text-lg font-semibold">{x.name}</p>
            <span className="inline-block text-xs bg-accent/20 text-accent rounded px-2 py-0.5">{x.language}</span>
            {x.link && <p><a href={x.link} target="_blank" rel="noopener nofollow ugc" className="text-sm text-brand hover:underline">Visit profile ↗</a></p>}
          </Card>))}</div>
      ) : <Card className="text-center text-white/70">Our first voices will be thanked here very soon.</Card>}
      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">Your name could be here</h2>
        <p className="text-white/75">Volunteer to record words and sentences in your language, and we will credit you on this wall (with a link to your profile, if you like).</p>
        <Link href="/volunteer" className="inline-block px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Volunteer your voice</Link>
      </section>
    </div>
  );
}
