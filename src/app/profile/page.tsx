"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, Save } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName((user.user_metadata?.full_name as string) ?? "");
    getSupabase()
      .from("photo_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => setCount(count ?? 0));
  }, [user]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await getSupabase().auth.updateUser({ data: { full_name: name.trim() } });
    setSaving(false);
    if (error) toast(error.message, "error");
    else toast("Profil diperbarui", "success");
  }

  async function logout() {
    await getSupabase().auth.signOut();
    toast("Kamu sudah keluar", "success");
    router.push("/");
    router.refresh();
  }

  if (loading || !user) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-lilac-deep" />
      </div>
    );
  }

  const initial = (name || user.email || "?").charAt(0).toUpperCase();
  const joined = new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <div className="rounded-[2rem] bg-white p-7 shadow-paper ring-1 ring-lilac/70 sm:p-9">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-blush-deep text-2xl font-bold text-white">{initial}</span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{name || "Profil kamu"}</h1>
            <p className="truncate text-sm text-plum-soft">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-cream p-4">
            <dt className="text-plum-soft">Bergabung</dt>
            <dd className="mt-0.5 font-semibold">{joined}</dd>
          </div>
          <Link href="/gallery" className="rounded-2xl bg-lilac/50 p-4 transition hover:bg-lilac">
            <dt className="text-plum-soft">Photo strip</dt>
            <dd className="mt-0.5 font-semibold">{count === null ? "…" : count}</dd>
          </Link>
        </dl>

        <form onSubmit={saveName} className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-plum">Nama panggilan</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="input" />
          </label>
          <button type="submit" disabled={saving} className="btn btn-primary w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan perubahan
          </button>
        </form>

        <button onClick={logout} className="btn btn-ghost mt-3 w-full">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
