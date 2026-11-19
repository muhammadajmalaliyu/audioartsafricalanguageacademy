import Link from "next/link";

export function Legal({ title, updated, intro, children }: { title: string; updated: string; intro?: string; children: React.ReactNode }) {
  return (
    <article className="max-w-3xl mx-auto space-y-4 pb-6">
      <Link href="/" className="text-sm text-white/60 hover:text-white">← Home</Link>
      <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="text-sm text-white/50">Last updated: {updated}</p>
      {intro && <p className="text-white/85 leading-relaxed">{intro}</p>}
      <div className="text-white/80 leading-relaxed space-y-3">{children}</div>
    </article>
  );
}
export const H = ({ children }: any) => <h2 className="font-display text-xl font-bold text-white pt-5">{children}</h2>;
export const UL = ({ items }: { items: React.ReactNode[] }) => <ul className="list-disc pl-6 space-y-1.5">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
export const Mail = () => <a href="mailto:audioartsafrica@gmail.com" className="text-accent hover:underline">audioartsafrica@gmail.com</a>;
