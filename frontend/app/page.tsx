import Link from "next/link";

export default function Home() {
  const F = [["🎧", "Native voice audio", "Every word and sentence recorded by a professional Hausa voice artist."],
    ["📝", "Learn, practise, quiz", "Flashcards and instantly marked quizzes keep you moving forward."],
    ["📈", "Progress that stays", "Log out any time and pick up exactly where you stopped."]];
  return (
    <div>
      <section className="text-center py-10">
        <img src="/logo.png" alt="Audio Arts Africa Language Academy" className="mx-auto w-full max-w-xl rounded-2xl shadow-2xl shadow-brand/20" />
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-10">Hear it. Say it. <span className="text-accent">Speak it.</span></h1>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">Start with Hausa Beginner — real pronunciation, real sentences, real progress.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Start learning free</Link>
          <Link href="/auth/login" className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">I have an account</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4 mt-6">
        {F.map(([i, t, d]) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><div className="text-3xl">{i}</div><h3 className="font-display font-semibold text-lg mt-3">{t}</h3><p className="text-white/65 mt-1 text-sm">{d}</p></div>)}
      </section>
    </div>
  );
}
