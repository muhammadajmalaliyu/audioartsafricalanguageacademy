"use client";
import { useRef, useState } from "react";

export const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5 ${className}`}>{children}</div>
);
export const Btn = ({ variant = "primary", className = "", ...p }: any) => (
  <button {...p} className={`rounded-xl px-4 py-2.5 font-semibold transition disabled:opacity-50 ${
    variant === "primary" ? "bg-brand text-navy-900 hover:brightness-110" :
    variant === "accent" ? "bg-accent text-navy-900 hover:brightness-110" :
    variant === "danger" ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-white/10 hover:bg-white/20"} ${className}`} />
);
export const Input = ({ className = "", ...p }: any) => (
  <input {...p} className={`w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 outline-none focus:border-brand placeholder:text-white/40 ${className}`} />
);
export const Bar = ({ pct }: { pct: number }) => (
  <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all" style={{ width: `${pct}%` }} /></div>
);
export const Err = ({ m }: { m?: string }) => m ? <p className="text-red-300 text-sm bg-red-500/10 rounded-lg px-3 py-2">{m}</p> : null;
export const Spin = () => <p className="text-white/60 p-8 text-center">Loading…</p>;

export function Play({ src }: { src?: string }) {
  const a = useRef<HTMLAudioElement | null>(null); const [on, setOn] = useState(false);
  if (!src) return <span className="text-xs text-white/40">No audio yet</span>;
  return (
    <button onClick={() => { if (!a.current) { a.current = new Audio(src); a.current.onended = () => setOn(false); }
      if (on) { a.current.pause(); a.current.currentTime = 0; setOn(false); } else { a.current.play(); setOn(true); } }}
      className="shrink-0 h-11 w-11 rounded-full bg-accent text-navy-900 font-bold hover:brightness-110" aria-label="Listen">{on ? "■" : "▶"}</button>
  );
}

export function PasswordInput(p: any) {
  const [show, setShow] = useState(false);
  const ic = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <div className="relative">
      <Input {...p} type={show ? "text" : "password"} className="pr-12" />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1">
        {show ? <svg {...ic}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22" /></svg>
          : <svg {...ic}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>}
      </button>
    </div>
  );
}
