import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublic, SITE, LANG_CODES } from "@/lib/serverApi";
import { Play } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import ShareButton from "@/components/ShareButton";

export const revalidate = 3600;
const paras = (t?: string) => (t || "").split(/\n\s*\n/).filter(x => x.trim());
const lines = (t?: string) => (t || "").split("\n").filter(x => x.trim());

export async function generateMetadata({ params }: any) {
  const d = await getPublic(`/public/language/${params.language}`);
  if (!d) return { title: "Language | Audio Arts Africa Language Academy" };
  const n = d.language.name;
  return {
    title: `Learn ${n} Online Free: Phrases with Native Audio | Audio Arts Africa`,
    description: `Learn ${n} for free. Hear ${d.phrases.length} ${n} words and phrases spoken by native speakers, explore the alphabet and culture, and start a free beginner course.`,
    alternates: { canonical: `/learn/${params.language}` },
    openGraph: { title: `Learn ${n} Online Free`, description: `Free ${n} lessons with native-speaker audio.`, type: "website" },
  };
}

export default async function LanguageLanding({ params }: any) {
  const d = await getPublic(`/public/language/${params.language}`);
  if (!d) notFound();
  const { language: l, courses, phrases } = d;
  const url = `${SITE}/learn/${l.slug}`;
  const topics: string[] = Array.from(new Set<string>(phrases.map((p: any) => p.topic)));
  const featured = phrases.filter((p: any) => p.audioUrl).slice(0, 6);
  const ld = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: "Learn", item: `${SITE}/learn` }, { "@type": "ListItem", position: 3, name: l.name, item: url }] },
    ...courses.map((c: any) => ({
      "@context": "https://schema.org", "@type": "Course", name: c.title, description: c.description || `A free ${l.name} course with native-speaker audio.`,
      url, inLanguage: LANG_CODES[l.slug], educationalLevel: c.level, isAccessibleForFree: true,
      provider: { "@type": "Organization", name: "Audio Arts Africa Language Academy", sameAs: SITE },
      offers: { "@type": "Offer", category: "Free", price: "0", priceCurrency: "NGN" } })),
  ];
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <JsonLd data={ld} />
      <nav className="text-sm text-white/60"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/learn" className="hover:text-white">Learn</Link> / {l.name}</nav>
      <section className="text-center space-y-3">
        <p className="text-accent font-display text-4xl font-bold">{l.greeting}!</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold">Learn {l.name} online, free</h1>
        <p className="text-white/75 max-w-xl mx-auto">{l.tagline}</p>
        <p className="text-sm text-white/60">{phrases.length} words and phrases with native audio · {courses.length} free {courses.length === 1 ? "course" : "courses"}</p>
        <Link href="/auth/register" className="inline-block px-7 py-3.5 rounded-xl bg-accent text-navy-900 font-bold text-lg hover:brightness-110">Start learning {l.name} free</Link>
      </section>

      {featured.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">Hear {l.name} now</h2>
          <div className="grid gap-3">{featured.map((p: any) => (
            <div key={p.slug} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 flex items-center gap-4">
              <Play src={p.audioUrl} />
              <div className="flex-1"><p className="font-display text-xl font-semibold">{p.text}</p><p className="text-white/70 text-sm">{p.translation}</p></div>
              <Link href={`/learn/${l.slug}/${p.slug}`} className="text-brand text-sm font-semibold hover:underline shrink-0">Details →</Link>
            </div>))}</div>
        </section>)}

      {l.history && <section className="space-y-3"><h2 className="font-display text-2xl font-bold">About the {l.name} language</h2>{paras(l.history).map((t, i) => <p key={i} className="text-white/80 leading-relaxed">{t}</p>)}</section>}
      {l.culture && <section className="space-y-3"><h2 className="font-display text-2xl font-bold">{l.name} culture</h2>{paras(l.culture).map((t, i) => <p key={i} className="text-white/80 leading-relaxed">{t}</p>)}</section>}
      {l.alphabet && <section className="space-y-3"><h2 className="font-display text-2xl font-bold">The {l.name} alphabet</h2>
        <div className="flex flex-wrap gap-2">{l.alphabet.split(/\s+/).filter(Boolean).map((a: string, i: number) => <span key={i} className="min-w-[3rem] text-center rounded-xl bg-brand/15 border border-brand/40 px-3 py-2 font-display text-xl font-semibold">{a}</span>)}</div></section>}
      {l.specialChars && <section className="space-y-3"><h2 className="font-display text-2xl font-bold">Special letters and sounds</h2>
        <div className="grid gap-3">{lines(l.specialChars).map((x, i) => { const [ch, ...rest] = x.split("|");
          return <div key={i} className="flex gap-4 items-start"><span className="shrink-0 min-w-[4rem] text-center rounded-xl bg-accent/15 border border-accent/40 px-3 py-2 font-display text-xl font-bold text-accent">{ch.trim()}</span><p className="text-white/80 text-sm pt-2">{rest.join("|").trim()}</p></div>; })}</div></section>}
      {l.funFacts && <section className="space-y-3"><h2 className="font-display text-2xl font-bold">Did you know?</h2><ul className="list-disc pl-5 space-y-2 text-white/80">{lines(l.funFacts).map((x, i) => <li key={i}>{x}</li>)}</ul></section>}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold">Browse {l.name} words and phrases</h2>
        {topics.map(t => (
          <div key={t}><h3 className="font-display font-semibold text-accent mb-2">{t}</h3>
            <div className="flex flex-wrap gap-2">{phrases.filter((p: any) => p.topic === t).map((p: any) => (
              <Link key={p.slug} href={`/learn/${l.slug}/${p.slug}`} className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm"><b>{p.text}</b> <span className="text-white/60">· {p.translation.replace(/[.?!]+$/, "")}</span></Link>))}</div></div>))}
      </section>

      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Ready to speak {l.name}?</h2>
        <p className="text-white/75">Create a free account to follow the full course, practise with flashcards and take quizzes.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link>
          <ShareButton className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20" />
        </div>
      </section>
    </div>
  );
}
