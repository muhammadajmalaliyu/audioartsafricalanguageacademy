import ImpactStats from "@/components/ImpactStats";
import PartnerForm from "@/components/PartnerForm";
import Link from "next/link";

export const metadata = { title: "Sponsors & Partners | Audio Arts Africa Language Academy", description: "Partner with us to preserve Nigerian languages. Support free native-voice lessons for learners at home and in the diaspora." };
const WA = "https://wa.me/2348029609876?text=" + encodeURIComponent("Hello, I would like to discuss sponsoring or partnering with Audio Arts Africa Language Academy.");

// Edit these tiers freely: they are only suggestions to start the conversation.
const TIERS = [
  { name: "Community Supporter", icon: "🌱", color: "border-brand/50 bg-brand/10", perks: ["Thank-you mention on our Impact page and social media", "Regular impact updates by email", "Your support recognised in our community"] },
  { name: "Cultural Guardian", icon: "🛡️", color: "border-accent/50 bg-accent/10", perks: ["Your logo on this Sponsors page", "Sponsor a lesson set or a language, credited on it", "Quarterly impact report"] },
  { name: "Platinum Partner", icon: "🏆", color: "border-emerald-400/50 bg-emerald-400/10", perks: ["Featured partner on the home page and lessons", "Co-branded campaigns, events and content", "Custom impact reporting for your team"] },
];
const WHY = [
  ["🌍", "Cultural preservation", "Help keep Nigerian languages alive for the next generation, recorded in the voices of native speakers."],
  ["🏢", "Social impact", "Support free, accessible education that fits corporate social responsibility and community goals."],
  ["🧳", "Diaspora engagement", "Give families abroad a trusted way to teach their children the languages of home."],
];

export default function Sponsors() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <section className="text-center py-6">
        <p className="text-brand text-sm uppercase tracking-widest font-semibold">Support us</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">Sponsors &amp; partners</h1>
        <p className="text-white/70 mt-3 max-w-2xl mx-auto">Our mission is to make it easy for everyone, everywhere, to learn and preserve Nigerian languages for free. Partner with us to keep it free and help it grow.</p>
      </section>
      <section className="grid md:grid-cols-3 gap-4">{WHY.map(([i, t, d]) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6"><div className="text-3xl">{i}</div><h3 className="font-display font-semibold text-lg mt-2">{t}</h3><p className="text-sm text-white/70 mt-1">{d}</p></div>)}</section>
      <section><h2 className="font-display text-2xl font-bold text-center mb-4">Our impact so far</h2><ImpactStats compact /><p className="text-center mt-3"><Link href="/impact" className="text-accent text-sm hover:underline">See full impact →</Link></p></section>
      <section>
        <h2 className="font-display text-2xl font-bold text-center mb-5">Ways to partner</h2>
        <div className="grid md:grid-cols-3 gap-4">{TIERS.map(t => (
          <div key={t.name} className={`rounded-3xl border p-6 flex flex-col ${t.color}`}>
            <div className="text-3xl">{t.icon}</div><h3 className="font-display text-xl font-bold mt-2">{t.name}</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80 list-disc pl-5 flex-1">{t.perks.map(p => <li key={p}>{p}</li>)}</ul>
            <Link href={`/sponsors?tier=${encodeURIComponent(t.name)}#enquire`} className="mt-5 text-center rounded-xl bg-white/10 hover:bg-white/20 font-semibold py-2.5">Enquire →</Link>
          </div>))}</div>
      </section>
      <section id="enquire" className="max-w-2xl mx-auto w-full space-y-4 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold text-center">Start the conversation</h2>
        <PartnerForm />
        <p className="text-center text-sm text-white/65">Prefer to talk? <a href={WA} target="_blank" rel="noopener" className="text-accent hover:underline">WhatsApp 0802 960 9876</a> or <a href="mailto:audioartsafrica@gmail.com" className="text-accent hover:underline">audioartsafrica@gmail.com</a></p>
      </section>
    </div>
  );
}
