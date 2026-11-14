import Link from "next/link";
import { notFound } from "next/navigation";
import { getJSON, SITE } from "@/lib/serverApi";
import ShareButton from "@/components/ShareButton";

export const revalidate = 300;
export async function generateMetadata({ params }: any) {
  const p = await getJSON(`/posts/${params.slug}`);
  if (!p) return { title: "Article | Audio Arts Africa Language Academy" };
  return { title: `${p.title} | Audio Arts Africa Language Academy`, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, type: "article" } };
}

function Body({ text }: { text: string }) {
  return <>{(text || "").split(/\n\s*\n/).filter(b => b.trim()).map((b, i) => {
    const lines = b.split("\n");
    // "## Heading" optionally followed by paragraph/bullet lines in the same block
    if (lines[0].startsWith("## ")) return <div key={i}><h2 className="font-display text-2xl font-bold mt-8 mb-2">{lines[0].slice(3)}</h2>{lines.length > 1 && <Body text={lines.slice(1).join("\n")} />}</div>;
    if (lines.every(l => l.startsWith("- "))) return <ul key={i} className="list-disc pl-6 space-y-1 text-white/85">{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i} className="text-white/85 leading-relaxed">{b}</p>;
  })}</>;
}

export default async function Post({ params }: any) {
  const p = await getJSON(`/posts/${params.slug}`);
  if (!p) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, datePublished: p.publishedAt, inLanguage: "en", publisher: { "@type": "Organization", name: "Audio Arts Africa Language Academy" }, mainEntityOfPage: `${SITE}/blog/${p.slug}` };
  return (
    <article className="max-w-2xl mx-auto space-y-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Link href="/blog" className="text-sm text-white/60 hover:text-white">← Language Hub</Link>
      {p.language && <p className="text-xs uppercase tracking-wider text-accent">{p.language}</p>}
      <h1 className="font-display text-3xl md:text-4xl font-bold">{p.title}</h1>
      {p.publishedAt && <p className="text-sm text-white/50">{new Date(p.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>}
      <div className="space-y-4 pt-2"><Body text={p.body} /></div>
      <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-6 text-center space-y-3 mt-10">
        <h3 className="font-display text-xl font-bold">Hear it spoken by native speakers</h3>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/auth/register" className="px-5 py-2.5 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link>
          <ShareButton className="px-5 py-2.5 rounded-xl bg-white/10 font-semibold hover:bg-white/20" />
        </div>
      </div>
    </article>
  );
}
