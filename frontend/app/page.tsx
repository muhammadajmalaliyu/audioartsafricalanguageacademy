import Link from "next/link";
import ImpactStats from "@/components/ImpactStats";
import TryLesson from "@/components/TryLesson";

const WA =
  "https://wa.me/2348029609876?text=" +
  encodeURIComponent(
    "Hello, I would like to volunteer as a native-speaker voice for Audio Arts Africa Language Academy. My language is: ",
  );

export default function Home() {
  const F = [
    [
      "🎧",
      "Native voice audio:",
      "Hear natural pronunciation, tone, and rhythm from real speakers -  noy robotic text-to-speech.",
    ],
    [
      "📝",
      "Learn, practise, quiz:",
      "Build confidence with bite-sized flashcards and instant feedback quizzes.",
    ],
    [
      "📈",
      "Progress that stays:",
      "Create a free account to save your spot and return anytime on any device and pick up exactly where you stopped.",
    ],
  ];
  return (
    <div>
      <section className="text-center pb-2">
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          Hear it. Say it. <span className="text-accent">Speak it.</span>
        </h1>
        <p className="mt-3 text-white/70 max-w-xl mx-auto">
          Learn real Nigerian languages through native audio, flashcards, and
          quick quizzes - starting with <b className="text-white">Hausa</b>,{" "}
          <b className="text-white">Yorùbá</b> and{" "}
          <b className="text-white">Igbo,</b> and growing across more languages
          every week.
        </p>
      </section>
      <section id="try" className="mt-5 max-w-md mx-auto space-y-3">
        <h2 className="font-display text-2xl font-bold text-center">
          Try a lesson
        </h2>
        <p className="text-center text-sm text-white/60">
          Pick a language and tap play. No sign-up needed.
        </p>
        <TryLesson />
      </section>
      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <Link
          href="/auth/register"
          className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110"
        >
          Start learning free
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20"
        >
          I have an account
        </Link>
      </div>
      <section className="grid md:grid-cols-3 gap-4 mt-10">
        {F.map(([i, t, d]) => (
          <div
            key={t}
            className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"
          >
            <div className="text-3xl">{i}</div>
            <h3 className="font-display font-semibold text-lg mt-3">{t}</h3>
            <p className="text-white/65 mt-1 text-sm">{d}</p>
          </div>
        ))}
      </section>
      <section className="mt-10 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">Browse free phrases</h2>
        <div className="flex gap-2 justify-center flex-wrap">
          <Link
            href="/learn/igbo"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold"
          >
            Learn Igbo
          </Link>
          <Link
            href="/learn/hausa"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold"
          >
            Learn Hausa
          </Link>
          <Link
            href="/learn/yoruba"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold"
          >
            Learn Yorùbá
          </Link>
        </div>
        <p className="text-center text-sm text-white/60">
          More Nigerian Languages are on the way.
        </p>
      </section>
      <section className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-brand/50 bg-brand/10 p-7">
          <p className="text-brand font-display font-bold text-xl">
            🎯 Our Mission
          </p>
          <p className="text-white/85 mt-2 leading-relaxed">
            To make it easy for everyone, everywhere, to learn and preserve
            Nigerian languages for free.
          </p>
        </div>
        <div className="rounded-3xl border border-accent/50 bg-accent/10 p-7">
          <p className="text-accent font-display font-bold text-xl">
            🌍 Our Vision
          </p>
          <p className="text-white/85 mt-2 leading-relaxed">
            To build a world where Nigerian languages are understood, spoken,
            celebrated, and preserved for generations to come.
          </p>
        </div>
        <p className="md:col-span-2 text-center text-white/70">
          We want Nigerian languages to remain alive, and accessible today and
          in the future. Every voice clip helps someone reconnect with home.{" "}
          <Link
            href="/about"
            className="text-accent font-semibold hover:underline"
          >
            Be part of it →
          </Link>
        </p>
      </section>
      <section className="mt-10 space-y-4">
        <h2 className="font-display text-2xl font-bold text-center">
          Our impact so far
        </h2>
        <ImpactStats compact />
        <p className="text-center">
          <Link
            href="/impact"
            className="text-accent font-semibold hover:underline"
          >
            See the full impact →
          </Link>{" "}
          <span className="text-white/40 mx-2">|</span>{" "}
          <Link
            href="/sponsors"
            className="text-accent font-semibold hover:underline"
          >
            Sponsor or partner with us →
          </Link>
        </p>
      </section>
      <section
        id="volunteer"
        className="mt-10 rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center scroll-mt-24"
      >
        <div className="text-4xl">🎙️</div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">
          Are you a native speaker? Lend us your voice.
        </h2>
        <p className="text-white/75 max-w-2xl mx-auto mt-3">
          We are looking for volunteer native speakers of Nigerian languages to
          record words and sentences for our lessons. Your voice will help
          thousands of learners connect with your language and culture.
        </p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          <Link
            href="/volunteer"
            className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110"
          >
            Sign up to volunteer
          </Link>
          <a
            href={WA}
            target="_blank"
            rel="noopener"
            className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20"
          >
            WhatsApp us
          </a>
        </div>
      </section>
    </div>
  );
}
