import Link from "next/link";

const WA = "https://wa.me/2348029609876?text=" + encodeURIComponent("Hello, I would like to volunteer as a native-speaker voice for Audio Arts Africa Language Academy. My language is: ");

export default function Home() {
  const F = [["🎧", "Native voice audio", "Every word and sentence recorded by real native speakers."],
    ["📝", "Learn, practise, quiz", "Flashcards and instantly marked quizzes keep you moving forward."],
    ["📈", "Progress that stays", "Log out any time and pick up exactly where you stopped."]];
  return (
    <div>
      <section className="text-center py-10">
        <img src="/logo.png" alt="Audio Arts Africa Language Academy" className="mx-auto w-full max-w-xl rounded-2xl shadow-2xl shadow-brand/20" />
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-10">Hear it. Say it. <span className="text-accent">Speak it.</span></h1>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">Start learning Nigerian indigenous languages, beginning with <b className="text-white">Hausa</b>, <b className="text-white">Yorùbá</b> and <b className="text-white">Igbo</b>.</p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link>
          <Link href="/auth/login" className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">I have an account</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4 mt-6">
        {F.map(([i, t, d]) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><div className="text-3xl">{i}</div><h3 className="font-display font-semibold text-lg mt-3">{t}</h3><p className="text-white/65 mt-1 text-sm">{d}</p></div>)}
      </section>
      <section className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-brand/50 bg-brand/10 p-7">
          <p className="text-brand font-display font-bold text-xl">🎯 Our Mission</p>
          <p className="text-white/85 mt-2 leading-relaxed">To make it easy for everyone, everywhere, to learn and preserve Nigerian languages for free.</p>
        </div>
        <div className="rounded-3xl border border-accent/50 bg-accent/10 p-7">
          <p className="text-accent font-display font-bold text-xl">🌍 Our Vision</p>
          <p className="text-white/85 mt-2 leading-relaxed">To build a world where Nigerian languages are understood, spoken, celebrated, and preserved for generations to come.</p>
        </div>
        <p className="md:col-span-2 text-center text-white/70">We want Nigerian languages to remain alive, accessible, and loved by everyone, today and in the future. <Link href="/about" className="text-accent font-semibold hover:underline">Be part of it →</Link></p>
      </section>
      <section id="volunteer" className="mt-10 rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center scroll-mt-24">
        <div className="text-4xl">🎙️</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">Are you a native speaker? Lend us your voice.</h2>
        <p className="text-white/75 max-w-2xl mx-auto mt-3">We are looking for volunteer native speakers of Nigerian languages to record words and sentences for our lessons. Your voice will help thousands of learners connect with your language and culture.</p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Link href="/volunteer" className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Sign up to volunteer</Link>
          <a href={WA} target="_blank" rel="noopener" className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">WhatsApp us</a>
        </div>
      </section>
    </div>
  );
}
