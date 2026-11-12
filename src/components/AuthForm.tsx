"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

interface Props {
  mode: "login" | "register";
  next?: string;
}

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/gallery";
}

export default function AuthForm({ mode, next }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLogin = mode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isLogin && password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    setBusy(true);
    try {
      const supabase = getSupabase();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast("Selamat datang kembali!", "success");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() || undefined }, emailRedirectTo: `${location.origin}/login` },
        });
        if (error) throw error;
        if (!data.session) {
          toast("Cek emailmu untuk konfirmasi akun, lalu login.", "info");
          router.push("/login");
          return;
        }
        toast("Akun berhasil dibuat!", "success");
      }
      router.replace(safeNext(next));
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg === "Invalid login credentials" ? "Email atau password salah." : msg);
    } finally {
      setBusy(false);
    }
  }

  const other = isLogin ? "/register" : "/login";
  const otherQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-md rounded-[2rem] bg-white p-7 shadow-paper ring-1 ring-lilac/70 sm:p-9">
      <h1 className="text-3xl font-extrabold tracking-tight text-plum">{isLogin ? "Masuk ke SnapStudio" : "Buat akun SnapStudio"}</h1>
      <p className="mt-1.5 text-sm text-plum-soft">
        {isLogin ? "Lihat strip yang pernah kamu simpan." : "Simpan strip favoritmu di gallery pribadi."}
      </p>

      <div className="mt-6 space-y-4">
        {!isLogin && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-plum">Nama panggilan</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" className="input" placeholder="Opsional" />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-plum">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="input" placeholder="kamu@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-plum">Password</span>
          <input type="password" required minLength={isLogin ? 1 : 8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} className="input" placeholder={isLogin ? "Password" : "Minimal 8 karakter"} />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLogin ? "Login" : "Register"}
      </button>

      <p className="mt-5 text-center text-sm text-plum-soft">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <Link href={`${other}${otherQuery}`} className="font-semibold text-lilac-deep hover:underline">
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </form>
  );
}
