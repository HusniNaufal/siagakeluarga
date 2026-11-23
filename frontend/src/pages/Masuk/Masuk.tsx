import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Logo } from "@/components/brand/Logo";
import { AuthPhotoPanel } from "@/components/sections/AuthPhotoPanel";

export function Masuk() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const me = await login(email, password);
      const from = (location.state as { from?: Location })?.from?.pathname;
      const needsOnboarding = !me.household || me.household.jumlah_anggota === 0;
      navigate(from ?? (needsOnboarding ? "/onboarding" : "/beranda-saya"), {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-base">
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-auto lg:min-w-[560px] lg:px-[80px] xl:min-w-[620px] xl:px-[100px]">
        <div className="mx-auto w-full max-w-[420px]">
          <Link to="/" aria-label="SiagaKeluarga, beranda" className="inline-block transition-transform hover:opacity-90">
            <Logo />
          </Link>

          <div className="mt-10">
            <h1 className="font-heading text-[32px] font-bold tracking-[-0.02em] text-ink md:text-[38px]">
              Masuk ke akunmu
            </h1>
            <p className="mt-2 text-[16px] text-ink-3">
              Lanjutkan menyiapkan rencana dan keselamatan keluargamu.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {error && (
              <p role="alert" className="rounded-2xl border border-bahaya/30 bg-bahaya/10 px-4 py-3 text-[14px] text-bahaya">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[14px] font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-13 w-full rounded-2xl border border-line bg-base px-4 text-[16px] text-ink placeholder:text-muted outline-none transition-all focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15"
                placeholder="nama@email.com"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[14px] font-medium text-ink">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 w-full rounded-2xl border border-line bg-base pl-4 pr-12 text-[16px] text-ink placeholder:text-muted outline-none transition-all focus:border-accent-dark focus:ring-2 focus:ring-accent-dark/15"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:text-ink cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-13 w-full items-center justify-center rounded-full bg-accent-dark text-[16px] font-semibold text-white shadow-md transition-all hover:bg-accent-hover hover:shadow-lg active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <div className="pt-2 text-center text-[15px] text-ink-3">
              Belum punya akun?{" "}
              <Link to="/daftar" className="font-semibold text-accent-dark hover:text-accent-hover hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </form>
        </div>
      </div>

      <AuthPhotoPanel />
    </div>
  );
}
