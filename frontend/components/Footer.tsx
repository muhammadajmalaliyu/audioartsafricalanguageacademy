import Link from "next/link";

const WA = "https://wa.me/2348029609876";
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-navy-900/80">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <img src="/logo.png" alt="Audio Arts Africa Language Academy" className="h-14 w-auto rounded" />
          <p className="mt-3 text-sm text-white/60">Learn a Language. Connect with a People.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/courses" className="hover:text-white">Learn</Link></li>
            <li><Link href="/about" className="hover:text-white">Our mission &amp; vision</Link></li>
            <li><Link href="/auth/register" className="hover:text-white">Join free</Link></li>
            <li><Link href="/auth/login" className="hover:text-white">Log in</Link></li>
            <li><Link href="/volunteer" className="hover:text-white">Volunteer your voice</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contact us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>✉️ <a href="mailto:audioartsafrica@gmail.com" className="hover:text-white">audioartsafrica@gmail.com</a></li>
            <li>💬 <a href={WA} target="_blank" rel="noopener" className="hover:text-white">WhatsApp: 0802 960 9876</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Audio Arts Africa Language Academy. All rights reserved.
      </div>
    </footer>
  );
}
