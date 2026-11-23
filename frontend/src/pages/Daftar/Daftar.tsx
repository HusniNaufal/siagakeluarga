import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Logo } from "@/components/brand/Logo";
import { GrafisRumah } from "@/components/ui/Grafis";
import { AuthPhotoPanel } from "@/components/sections/AuthPhotoPanel";

export function Daftar() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(nama, email, password);
      navigate("/onboarding", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal mendaftar. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative flex w-full flex-col justify-center overflow-hidden px-6 py-16 lg:w-auto lg:min-w-[640px] lg:px-[100px]">
        <GrafisRumah className="absolute bottom-8 left-[100px] hidden w-[220px] xl:[@media(min-height:840px)]:block" />

        <div className="relative z-10">
          <Link to="/" aria-label="SiagaKeluarga, beranda" className="inline-block">
            <Logo />
          </Link>

          <form onSubmit={onSubmit} className="mt-12 w-full max-w-[440px] space-y-7">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#0B2545]">
              Buat akun baru
            </h1>

            {error && (
              <p className="rounded-xl bg-bahaya/10 px-4 py-3 text-sm text-bahaya">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label htmlFor="nama" className="block text-sm font-medium text-ink-2">
                Nama panggilan
              </label>
              <input
                id="nama"
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark"
                placeholder="Nama lengkapmu"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-ink-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark"
                placeholder="budi@email.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink-2"
              >
                Kata sandi
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus-visible:border-accent-dark"
                placeholder="••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-full bg-accent-dark text-base font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar gratis"}
            </button>

            <Link to="/masuk" className="block text-sm text-accent-dark">
              Sudah punya akun? Masuk
            </Link>
          </form>
        </div>
      </div>

      <AuthPhotoPanel />
    </div>
  );
}
