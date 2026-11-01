"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Nav() {
  const { user, logout } = useAuth(); const router = useRouter();
  const L = ({ href, children }: any) => <Link href={href} className="px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium">{children}</Link>;
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-navy-900/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center gap-2 px-4 py-2">
        <Link href="/" className="mr-auto"><img src="/logo.png" alt="Audio Arts Africa Language Academy" className="h-12 w-auto rounded" /></Link>
        {user ? (<>
          <L href="/courses">Courses</L><L href="/progress">Progress</L>
          {user.role === "admin" && <L href="/admin">Admin</L>}
          <button onClick={async () => { await logout(); router.push("/"); }} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Log out</button>
        </>) : (<><L href="/auth/login">Log in</L>
          <Link href="/auth/register" className="px-4 py-2 rounded-lg bg-accent text-navy-900 font-semibold text-sm">Join free</Link></>)}
      </div>
    </header>
  );
}
