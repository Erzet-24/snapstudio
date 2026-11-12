"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Aperture, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";
import { getSupabase } from "@/lib/supabase/client";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/photobooth", label: "Photobooth" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  async function logout() {
    await getSupabase().auth.signOut();
    setOpen(false);
    toast("Kamu sudah keluar", "success");
    router.push("/");
    router.refresh();
  }

  const linkCls = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      pathname === href ? "bg-lilac text-plum" : "text-plum-soft hover:bg-lilac/40 hover:text-plum"
    }`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white/85 px-4 py-2.5 shadow-soft ring-1 ring-lilac/60 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-plum">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-blush-deep text-white">
            <Aperture className="h-5 w-5" />
          </span>
          SnapStudio
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? null : user ? (
            <>
              <Link href="/profile" className="flex max-w-[210px] items-center gap-2 rounded-full bg-cream px-3 py-2 text-sm font-medium text-plum ring-1 ring-lilac/70 hover:bg-lilac/30">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.user_metadata?.full_name || user.email}</span>
              </Link>
              <button onClick={logout} className="btn btn-ghost" aria-label="Logout">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Login</Link>
              <Link href="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-full text-plum md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl animate-rise rounded-3xl bg-white p-3 shadow-soft ring-1 ring-lilac/60 md:hidden">
          <div className="flex flex-col gap-1" onClick={() => setOpen(false)}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls(l.href)}>{l.label}</Link>
            ))}
            {!loading && user && <Link href="/profile" className={linkCls("/profile")}>Profile ({user.email})</Link>}
          </div>
          <div className="mt-3 flex gap-2 border-t border-lilac/50 pt-3">
            {user ? (
              <button onClick={logout} className="btn btn-ghost w-full"><LogOut className="h-4 w-4" /> Logout</button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost flex-1">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
