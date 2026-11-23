import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Mail,
  MapPin,
  Users,
  Backpack,
  FileText,
  LogOut,
  Edit2,
  Check,
  Award,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, logout, updateProfile } = useAuth();
  const { data: household } = useHousehold();
  const navigate = useNavigate();

  const [isEditingNama, setIsEditingNama] = useState(false);
  const [namaInput, setNamaInput] = useState(user?.nama ?? "");
  const [loadingSimpan, setLoadingSimpan] = useState(false);
  const [pesanSukses, setPesanSukses] = useState<string | null>(null);
  const [errorNama, setErrorNama] = useState<string | null>(null);

  useEffect(() => {
    if (user?.nama) setNamaInput(user.nama);
  }, [user?.nama]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSimpanNama(e: React.FormEvent) {
    e.preventDefault();
    if (!namaInput.trim()) {
      setErrorNama("Nama tidak boleh kosong.");
      return;
    }
    setErrorNama(null);
    setLoadingSimpan(true);
    try {
      await updateProfile(namaInput.trim());
      setIsEditingNama(false);
      setPesanSukses("Nama berhasil diperbarui!");
      setTimeout(() => setPesanSukses(null), 3000);
    } catch (err) {
      setErrorNama(err instanceof Error ? err.message : "Gagal memperbarui nama.");
    } finally {
      setLoadingSimpan(false);
    }
  }

  function handleLogout() {
    onClose();
    logout();
    navigate("/masuk");
  }

  const inisial = (user?.nama ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const wilayah = household?.region
    ? `Kec. ${household.region.kecamatan}, ${household.region.kab_kota}`
    : household?.lat != null
      ? "Lokasi tersimpan di peta"
      : "Lokasi belum diatur";

  const jumlahAnggota = household?.members?.length ?? 0;
  const pctTas = household?.kesiapan_tas?.persentase ?? 0;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-profil"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-night/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-line bg-base p-6 shadow-2xl md:p-8 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup profil"
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-tint hover:text-ink cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Header Profil */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative">
            <span
              aria-hidden="true"
              className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-accent-dark via-siaga to-accent-hover font-display text-[26px] font-bold text-white shadow-md"
            >
              {inisial}
            </span>
            <span
              title="Akun Terverifikasi"
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-aman text-white shadow-sm ring-2 ring-base"
            >
              <ShieldCheck className="size-3.5" />
            </span>
          </div>

          {/* Nama Pengguna & Form Edit */}
          <div className="mt-4 w-full">
            {isEditingNama ? (
              <form onSubmit={handleSimpanNama} className="mt-2 space-y-2">
                <input
                  type="text"
                  value={namaInput}
                  onChange={(e) => setNamaInput(e.target.value)}
                  placeholder="Nama lengkap"
                  autoFocus
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2 text-center text-[16px] font-semibold text-ink focus:border-ink focus:outline-none"
                />
                {errorNama && <p className="text-[13px] text-bahaya">{errorNama}</p>}
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="submit"
                    disabled={loadingSimpan}
                    className="inline-flex h-8 items-center gap-1 rounded-full bg-accent-dark px-4 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer disabled:opacity-50"
                  >
                    <Check className="size-3.5" />
                    <span>{loadingSimpan ? "Menyimpan…" : "Simpan"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingNama(false);
                      setNamaInput(user?.nama ?? "");
                      setErrorNama(null);
                    }}
                    className="inline-flex h-8 items-center rounded-full border border-line bg-base px-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-tint cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 id="judul-profil" className="font-display text-[22px] font-bold text-ink">
                  {user?.nama ?? "Pengguna"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingNama(true)}
                  aria-label="Ubah nama"
                  title="Ubah nama"
                  className="rounded-full p-1 text-ink-3 transition-colors hover:bg-tint hover:text-ink cursor-pointer"
                >
                  <Edit2 className="size-3.5" />
                </button>
              </div>
            )}

            {pesanSukses && (
              <p className="mt-1 text-[13px] font-medium text-aman flex items-center justify-center gap-1">
                <Check className="size-3.5" />
                {pesanSukses}
              </p>
            )}

            <p className="mt-1 flex items-center justify-center gap-1.5 text-[14px] text-ink-3">
              <Mail className="size-3.5" />
              <span>{user?.email ?? "email@contoh.com"}</span>
            </p>
          </div>
        </div>

        {/* Ringkasan Akun & Status Rumah */}
        <div className="rounded-2xl border border-line/80 bg-surface/70 p-4 space-y-3">
          <div className="flex items-center justify-between text-[14px]">
            <div className="flex items-center gap-2.5 text-ink-2">
              <MapPin className="size-4 text-accent-dark shrink-0" />
              <span className="font-medium text-ink truncate max-w-[240px]">{wilayah}</span>
            </div>
            <Link
              to="/keluarga"
              onClick={onClose}
              className="text-[13px] font-semibold text-accent-dark hover:underline"
            >
              Ubah
            </Link>
          </div>

          <div className="flex items-center justify-between text-[14px] border-t border-line/60 pt-2.5">
            <div className="flex items-center gap-2.5 text-ink-2">
              <Users className="size-4 text-accent-dark shrink-0" />
              <span>{jumlahAnggota > 0 ? `${jumlahAnggota} Anggota Keluarga` : "Belum ada anggota"}</span>
            </div>
            <Link
              to="/keluarga"
              onClick={onClose}
              className="text-[13px] font-semibold text-accent-dark hover:underline"
            >
              Kelola
            </Link>
          </div>

          <div className="flex items-center justify-between text-[14px] border-t border-line/60 pt-2.5">
            <div className="flex items-center gap-2.5 text-ink-2">
              <Backpack className="size-4 text-accent-dark shrink-0" />
              <span>Kesiapan Tas Siaga: <strong>{pctTas}%</strong></span>
            </div>
            <Link
              to="/tas-siaga"
              onClick={onClose}
              className="text-[13px] font-semibold text-accent-dark hover:underline"
            >
              Lihat
            </Link>
          </div>
        </div>

        {/* Pintasan Aksi Cepat */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to="/rencana"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-base p-3 text-[14px] font-semibold text-ink transition-colors hover:bg-tint"
          >
            <FileText className="size-4 text-ink-3" />
            <span>Rencana darurat</span>
          </Link>
          <Link
            to="/latihan"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl border border-line bg-base p-3 text-[14px] font-semibold text-ink transition-colors hover:bg-tint"
          >
            <Award className="size-4 text-ink-3" />
            <span>Latihan simulasi</span>
          </Link>
        </div>

        {/* Tombol Logout */}
        <div className="border-t border-line pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-bahaya/30 bg-bahaya/5 py-3 text-[15px] font-semibold text-bahaya transition-colors hover:bg-bahaya/10 cursor-pointer"
          >
            <LogOut className="size-4" strokeWidth={2} />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
