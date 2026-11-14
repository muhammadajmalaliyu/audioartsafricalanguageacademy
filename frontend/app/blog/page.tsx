import Link from "next/link";
import { getJSON } from "@/lib/serverApi";

export const revalidate = 300;
export const metadata = { title: "Language Hub | Audio Arts Africa Language Academy", description: "Free articles on Nigerian languages and culture: greetings, phrases, names and more in Hausa, Yorùbá and Igbo." };

export default async function Blog() {
  const posts: any[] = (await getJSON("/posts")) || [];
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center py-6">
        <p className="text-brand text-sm uppercase tracking-widest font-semibold">Language Hub</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Learn &amp; explore</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">Short, free articles on Nigerian languages and culture.</p>
      </section>
      <div className="grid md:grid-cols-2 gap-4">
        {posts.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 hover:border-brand/60 transition block">
            {p.language && <span className="text-xs uppercase tracking-wider text-accent">{p.language}</span>}
            <h2 className="font-display text-xl font-semibold mt-1">{p.title}</h2>
            <p className="text-sm text-white/70 mt-2">{p.excerpt}</p>
            <span className="text-brand text-sm font-semibold mt-3 inline-block">Read article →</span>
          </Link>))}
      </div>
      {!posts.length && <p className="text-center text-white/60">New articles are coming soon.</p>}
    </div>
  );
}
