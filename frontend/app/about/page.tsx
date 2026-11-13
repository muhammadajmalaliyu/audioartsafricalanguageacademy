import Link from "next/link";
import ShareButton from "@/components/ShareButton";

export const metadata = { title: "Our Mission & Vision | Audio Arts Africa Language Academy" };
const WA = (t: string) => "https://wa.me/2348029609876?text=" + encodeURIComponent(t);
const MAIL = "mailto:audioartsafrica@gmail.com?subject=";

export default function About() {
  const ways = [
    { i: "📚", t: "Learn", d: "Start a free course today and keep a language alive by speaking it.", a: <Link href="/auth/register" className="text-accent font-semibold hover:underline">Join free →</Link> },
    { i: "🎙️", t: "Lend your voice", d: "Native speakers: record words and sentences so learners hear the real language.", a: <Link href="/volunteer" className="text-accent font-semibold hover:underline">Volunteer →</Link> },
    { i: "🤝", t: "Sponsor or partner", d: "Help us add more languages, lessons and learning games for everyone.", a: <a href={WA("Hello, I would like to sponsor or partner with Audio Arts Africa Language Academy.")} target="_blank" rel="noopener" className="text-accent font-semibold hover:underline">Talk to us →</a> },
  ];
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section className="text-center py-6">
        <p className="text-brand text-sm uppercase tracking-widest font-semibold">About us</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Our mission &amp; vision</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">Learn a Language. Connect with a People.</p>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-brand/50 bg-brand/10 p-8">
          <div className="text-4xl">🎯</div>
          <h2 className="font-display text-2xl font-bold mt-3 text-brand">Our Mission</h2>
          <p className="text-lg text-white/90 mt-3 leading-relaxed">To make it easy for everyone, everywhere, to learn and preserve Nigerian languages for free.</p>
        </div>
        <div className="rounded-3xl border border-accent/50 bg-accent/10 p-8">
          <div className="text-4xl">🌍</div>
          <h2 className="font-display text-2xl font-bold mt-3 text-accent">Our Vision</h2>
          <p className="text-lg text-white/90 mt-3 leading-relaxed">To build a world where Nigerian languages are understood, spoken, celebrated, and preserved for generations to come.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">
        <h2 className="font-display text-xl font-bold">In simple terms</h2>
        <p className="text-xl md:text-2xl font-display mt-3 leading-snug">We want Nigerian languages to remain <span className="text-accent">alive</span>, <span className="text-brand">accessible</span>, and <span className="text-accent">loved</span> by everyone, today and in the future.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-center mb-5">Be part of the project</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {ways.map(w => (
            <div key={w.t} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 space-y-2">
              <div className="text-3xl">{w.i}</div><h3 className="font-display font-semibold text-lg">{w.t}</h3>
              <p className="text-sm text-white/70">{w.d}</p><div>{w.a}</div>
            </div>))}
        </div>
      </section>

      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Help us reach more people</h2>
        <p className="text-white/75 max-w-xl mx-auto">Every learner, voice and sponsor brings a Nigerian language closer to the next generation. Tell a friend, share the link, or write to us.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <ShareButton className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110" />
          <a href={WA("Hello, I would like to support Audio Arts Africa Language Academy.")} target="_blank" rel="noopener" className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">WhatsApp us</a>
          <a href={MAIL + encodeURIComponent("Supporting the Academy")} className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">Email us</a>
        </div>
      </section>
    </div>
  );
}
