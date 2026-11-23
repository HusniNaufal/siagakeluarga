import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { Logo } from "@/components/brand/Logo";
import { GrafisRumah } from "@/components/ui/Grafis";
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
    <div className="flex min-h-screen bg-white">
      <div className="relative flex w-full flex-col justify-center overflow-hidden px-6 py-16 lg:w-auto lg:min-w-[640px] lg:px-[100px]">
        <GrafisRumah className="absolute bottom-8 left-[100px] hidden w-[220px] xl:[@media(min-height:840px)]:block" />

        <div className="relative z-10">
          <Link to="/" aria-label="SiagaKeluarga, beranda" className="inline-block">
            <Logo />
          </Link>

          <form onSubmit={onSubmit} className="mt-12 w-full max-w-[440px] space-y-7">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#0B2545]">
              Masuk ke akunmu
            </h1>

            {error && (
              <p className="rounded-xl bg-bahaya/10 px-4 py-3 text-sm text-bahaya">
                {error}
              </p>
            )}

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
                className="h-[52px] w-full rounded-xl border border-line bg-white px-4 text-base text-ink placeholder:text-muted outline-none focus-visible:border-accent-dark"
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-line bg-white pl-4 pr-12 text-base text-ink placeholder:text-muted outline-none focus-visible:border-accent-dark"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-full bg-accent-dark text-base font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <Link to="/daftar" className="block text-sm text-accent-dark">
              Belum punya akun? Daftar
            </Link>

            {/* Trust Strip khusus tampilan Mobile (persis siagakeluarga.fig Node 1683) */}
            <div className="mt-6 flex items-center rounded-xl bg-paper px-4 py-3 text-xs text-ink-2 lg:hidden">
              <span>
                Data keluargamu terenkripsi, disusun dari panduan resmi BNPB
              </span>
            </div>
          </form>
        </div>
      </div>

      <AuthPhotoPanel />
    </div>
  );
}
