import Link from "next/link";
import ImpactStats from "@/components/ImpactStats";
import ShareButton from "@/components/ShareButton";

export const metadata = { title: "Our Impact | Audio Arts Africa Language Academy", description: "Live, open numbers on the words recorded, lessons published and learners reached by Audio Arts Africa Language Academy." };

export default function Impact() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="text-center py-6">
        <p className="text-brand text-sm uppercase tracking-widest font-semibold">Transparency</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Our impact</h1>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">Live numbers from the Academy, shared openly so learners, volunteers and sponsors can see real progress.</p>
      </section>
      <ImpactStats />
      <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-sm text-white/70 space-y-2">
        <h2 className="font-display font-semibold text-white text-base">How we count</h2>
        <p><b className="text-white/90">Words &amp; phrases recorded:</b> published words and sentences that have a native-speaker recording.</p>
        <p><b className="text-white/90">Active learners:</b> learners who studied at least one lesson in the last 30 days.</p>
        <p><b className="text-white/90">Volunteer voices:</b> native-speaker volunteers whose recordings have been added.</p>
        <p>Numbers refresh every few minutes. We never share any learner's personal details.</p>
      </section>
      <section className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/15 to-brand/10 p-8 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Help these numbers grow</h2>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/sponsors" className="px-6 py-3 rounded-xl bg-accent text-navy-900 font-bold hover:brightness-110">Sponsor or partner</Link>
          <Link href="/volunteer" className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20">Volunteer your voice</Link>
          <ShareButton className="px-6 py-3 rounded-xl bg-white/10 font-semibold hover:bg-white/20" />
        </div>
      </section>
    </div>
  );
}
