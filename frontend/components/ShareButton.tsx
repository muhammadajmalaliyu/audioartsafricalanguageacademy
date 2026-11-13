"use client";
import { useState } from "react";

export default function ShareButton({ className = "" }: { className?: string }) {
  const [msg, setMsg] = useState("");
  return (
    <button className={className} onClick={async () => {
      const data = { title: "Audio Arts Africa Language Academy", text: "Learn Nigerian languages for free: Hausa, Yorùbá and Igbo.", url: location.origin };
      try {
        if (navigator.share) await navigator.share(data);
        else { await navigator.clipboard.writeText(location.origin); setMsg("Link copied!"); setTimeout(() => setMsg(""), 2500); }
      } catch {}
    }}>{msg || "Share this project"}</button>
  );
}
