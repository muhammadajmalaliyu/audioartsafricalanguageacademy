import Link from "next/link";
import { getPublic } from "@/lib/serverApi";

export const revalidate = 3600;
export const metadata = {
  title: "Learn Nigerian Languages Online Free | Hausa, Yorùbá, Igbo | Audio Arts Africa",
  description: "Free Nigerian language lessons with native-speaker audio. Learn Hausa, Yorùbá and Igbo greetings, words and phrases online.",
  alternates: { canonical: "/learn" },
};

export default async function Learn() {
  const langs: any[] = (await getPublic("/public/languages")) || [];
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center py-6">
        <p className="text-brand text-sm uppercase tracking-widest font-semibold">Free language lessons</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Learn Nigerian languages online</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">Hear every word and phrase spoken by native speakers. Pick a language to browse free phrases and start a course.</p>
      </section>
      <div className="grid sm:grid-cols-2 gap-4">
        {langs.map((l, i) => {
          const live = l.courses > 0;
          const card = (
            <div className={`rounded-3xl border p-6 h-full ${i % 2 ? "border-accent/50 bg-accent/10" : "border-brand/50 bg-brand/10"} ${live ? "hover:brightness-110 transition" : "opacity-60"}`}>
              <p className="text-white/60 text-sm">{l.greeting}</p>
              <h2 className="font-display text-2xl font-bold">Learn {l.name}</h2>
              <p className="text-sm text-white/75 mt-2">{l.tagline}</p>
              <p className="text-xs mt-3 text-white/60">{live ? `${l.phrases} words and phrases with audio` : "Coming soon"}</p>
            </div>);
          return live ? <Link key={l.slug} href={`/learn/${l.slug}`}>{card}</Link> : <div key={l.slug}>{card}</div>;
        })}
      </div>
      <p className="text-center"><Link href="/auth/register" className="inline-block px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link></p>
    </div>
  );
}
