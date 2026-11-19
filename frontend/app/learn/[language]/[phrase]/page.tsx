import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublic, SITE, LANG_CODES } from "@/lib/serverApi";
import { Play } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import ShareButton from "@/components/ShareButton";

export const revalidate = 3600;
const clean = (t: string) => t.replace(/[.?!]+$/, "").trim();

export async function generateMetadata({ params }: any) {
  const d = await getPublic(`/public/phrase/${params.language}/${params.phrase}`);
  if (!d) return { title: "Phrase | Audio Arts Africa Language Academy" };
  const { language: l, phrase: p } = d;
  return {
    title: `How to say “${clean(p.translation)}” in ${l.name}: ${p.text} (with audio)`,
    description: `Learn how to say “${clean(p.translation)}” in ${l.name}. Hear the native-speaker pronunciation of “${clean(p.text)}” and explore related ${l.name} phrases.`,
    alternates: { canonical: `/learn/${l.slug}/${p.slug}` },
    openGraph: { title: `How to say “${clean(p.translation)}” in ${l.name}`, description: `${p.text}: hear it spoken by a native speaker.`, type: "article" },
  };
}

export default async function PhrasePage({ params }: any) {
  const d = await getPublic(`/public/phrase/${params.language}/${params.phrase}`);
  if (!d) notFound();
  const { language: l, phrase: p, related, total } = d;
  const url = `${SITE}/learn/${l.slug}/${p.slug}`;
  const ld: any[] = [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: "Learn", item: `${SITE}/learn` },
    { "@type": "ListItem", position: 3, name: l.name, item: `${SITE}/learn/${l.slug}` }, { "@type": "ListItem", position: 4, name: clean(p.translation), item: url }] }];
  if (p.audioUrl) ld.push({ "@context": "https://schema.org", "@type": "AudioObject", name: `${p.text}: how to say “${clean(p.translation)}” in ${l.name}`, contentUrl: p.audioUrl, inLanguage: LANG_CODES[l.slug], description: `Native-speaker pronunciation of “${p.text}”, meaning “${clean(p.translation)}” in ${l.name}.` });
  return (
    <article className="max-w-2xl mx-auto space-y-6">
      <JsonLd data={ld} />
      <nav className="text-sm text-white/60"><Link href="/learn" className="hover:text-white">Learn</Link> / <Link href={`/learn/${l.slug}`} className="hover:text-white">{l.name}</Link> / {clean(p.translation)}</nav>
      <h1 className="font-display text-3xl md:text-4xl font-bold">How to say “{clean(p.translation)}” in {l.name}</h1>
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center space-y-3">
        <div className="flex justify-center items-center gap-4"><p className="font-display text-4xl md:text-5xl font-bold">{p.text}</p><Play src={p.audioUrl || undefined} /></div>
        <p className="text-2xl text-accent">{p.translation}</p>
        <p className="text-xs text-white/50">{p.audioUrl ? "Tap play to hear a native speaker." : `${l.name} ${p.kind === "sentence" ? "sentence" : "word"}`}</p>
      </div>
      <p className="text-white/80 leading-relaxed">In {l.name}, “{clean(p.translation)}” is <b>{p.text}</b>. This {p.kind === "sentence" ? "phrase" : "word"} is part of the “{p.topic}” lesson in our free {l.name} beginner course, where every word and sentence is recorded by native speakers so you can hear the correct pronunciation.</p>
      {related.length > 0 && (
        <section className="space-y-3"><h2 className="font-display text-xl font-bold">More from “{p.topic}”</h2>
          <div className="flex flex-wrap gap-2">{related.map((r: any) => <Link key={r.slug} href={`/learn/${l.slug}/${r.slug}`} className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm"><b>{r.text}</b> <span className="text-white/60">· {clean(r.translation)}</span></Link>)}</div></section>)}
      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-6 text-center space-y-3">
        <h2 className="font-display text-xl font-bold">Learn {total - 1} more {l.name} words and phrases</h2>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/register" className="px-5 py-2.5 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link>
          <Link href={`/learn/${l.slug}`} className="px-5 py-2.5 rounded-xl bg-white/10 font-semibold hover:bg-white/20">All {l.name} phrases</Link>
          <ShareButton className="px-5 py-2.5 rounded-xl bg-white/10 font-semibold hover:bg-white/20" />
        </div>
      </section>
    </article>
  );
}
