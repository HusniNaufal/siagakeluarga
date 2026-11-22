import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Trash2 } from "lucide-react";
import { useAddMember, useUpdateHousehold } from "@/hooks/useHousehold";
import { useRegions } from "@/hooks/useRisk";
import { useGeneratePlan } from "@/hooks/usePlan";
import { TopoBackground } from "@/components/layout/TopoBackground";
import type { KelompokUmur } from "@/lib/types";

interface DraftMember {
  panggilan: string;
  kelompok_umur: KelompokUmur;
  kebutuhan_khusus: string;
}

const KONDISI_OPTIONS = [
  {
    value: "dekat-sungai",
    label: "Rumah dekat bantaran sungai",
  },
  {
    value: "satu-lantai",
    label: "Lantai 1 saja (tidak bertingkat)",
  },
  {
    value: "akses-tinggi",
    label: "Ada akses ke tempat lebih tinggi di dekat rumah",
  },
];

const AI_STEPS = [
  "Menilai risiko lokasi",
  "Menyusun tugas tiap anggota",
  "Menulis daftar tas siaga…",
  "Menyiapkan titik kumpul terdekat",
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [members, setMembers] = useState<DraftMember[]>([
    {
      panggilan: "Budi, Ayah (42 thn)",
      kelompok_umur: "DEWASA",
      kebutuhan_khusus: "",
    },
    {
      panggilan: "Nenek Aminah (72 thn)",
      kelompok_umur: "LANSIA",
      kebutuhan_khusus: "Lansia, obat darah tinggi rutin",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPanggilan, setNewPanggilan] = useState("");
  const [newUmur, setNewUmur] = useState<KelompokUmur>("DEWASA");
  const [newKebutuhan, setNewKebutuhan] = useState("");

  const [alamat, setAlamat] = useState(
    "Jl. Raya Dayeuhkolot No. 12, RT 03/RW 05",
  );
  const [regionId, setRegionId] = useState<number | null>(null);
  const [selectedKondisi, setSelectedKondisi] = useState<string[]>([
    "dekat-sungai",
    "akses-tinggi",
  ]);
  const [aiStepIndex, setAiStepIndex] = useState(2);
  const [aiError, setAiError] = useState<string | null>(null);

  const { data: regions } = useRegions();
  const addMember = useAddMember();
  const updateHousehold = useUpdateHousehold();
  const generatePlan = useGeneratePlan();

  function handleAddDraftMember(e: React.FormEvent) {
    e.preventDefault();
    if (!newPanggilan.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        panggilan: newPanggilan.trim(),
        kelompok_umur: newUmur,
        kebutuhan_khusus: newKebutuhan.trim(),
      },
    ]);
    setNewPanggilan("");
    setNewKebutuhan("");
    setNewUmur("DEWASA");
    setShowAddForm(false);
  }

  function toggleKondisi(val: string) {
    setSelectedKondisi((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  }

  async function finish() {
    setStep(4);
    setAiError(null);
    try {
      setAiStepIndex(1);
      for (const m of members.filter((m) => m.panggilan.trim())) {
        await addMember.mutateAsync({
          panggilan: m.panggilan.trim(),
          kelompok_umur: m.kelompok_umur,
          kebutuhan_khusus: m.kebutuhan_khusus.trim() || null,
        });
      }
      setAiStepIndex(2);
      await updateHousehold.mutateAsync({
        region_id: regionId ?? regions?.[0]?.id ?? null,
        lat: -6.9889,
        lng: 107.6269,
      });
      setAiStepIndex(3);
      await generatePlan.mutateAsync();
      navigate("/beranda-saya", { replace: true });
    } catch {
      setAiError(
        "Gagal menyusun rencana otomatis. Kamu tetap bisa mencoba lagi dari halaman Rencana Darurat.",
      );
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F4F1EA]">
      <TopoBackground variant="warm" />

      {/* Top Header (persis siagakeluarga.fig Node 1722 / 1758 / 1795 / 1824) */}
      <header className="relative z-10 flex h-[72px] w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 md:px-12">
        <Link to="/" className="text-[18px] font-semibold text-[#0B2545]">
          ← Kembali ke SiagaKeluarga
        </Link>
        <p className="text-[13px] font-medium text-[#475569]">
          {step <= 3
            ? `Pengaturan Rencana Keluarga (Langkah ${step} dari 3)`
            : "Menyusun Rencana Darurat Keluarga"}
        </p>
      </header>

      <main className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-10">
        <div
          className={`w-full rounded-[28px] border border-[#E2E8F0] bg-white p-8 md:p-12 ${
            step === 4 ? "max-w-[560px]" : "max-w-[760px]"
          }`}
        >
          {/* Stepper Lingkaran 1 - 2 - 3 di dalam Card (persis siagakeluarga.fig Node 1693) */}
          {step <= 3 && (
            <div className="mb-8 flex items-center">
              {[1, 2, 3].map((s, idx) => {
                const done = s < step;
                const active = s === step;
                return (
                  <div key={s} className="flex items-center">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-[13px] ${
                        done || active
                          ? "bg-[#C2410C] text-white"
                          : "border border-[#E2E8F0] bg-[#F4F1EA] text-[#475569]"
                      }`}
                    >
                      {done ? "✓" : s}
                    </span>
                    {idx < 2 && (
                      <span
                        className={`h-[2px] w-[72px] ${
                          done ? "bg-[#C2410C]" : "bg-[#CBD5E1]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Langkah 1 — Anggota Keluarga (persis Node 1687) */}
          {step === 1 && (
            <div className="space-y-8">
              <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]">
                Siapa saja yang tinggal di rumahmu?
              </h1>

              <div className="space-y-3">
                {members.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-[16px] bg-[#F4F1EA] p-4"
                  >
                    <div className="flex items-center gap-4">
                      {i === 0 ? (
                        <img
                          src="/images/avatar-budi.webp"
                          alt={m.panggilan}
                          className="size-[44px] shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-xs font-semibold text-white">
                          NA
                        </span>
                      )}
                      <div>
                        <p className="text-[16px] font-semibold text-[#0F172A]">
                          {m.panggilan}
                        </p>
                        <p
                          className={`mt-0.5 text-[14px] ${
                            m.kebutuhan_khusus
                              ? "text-[#9A3412]"
                              : "text-[#475569]"
                          }`}
                        >
                          {m.kebutuhan_khusus || "Tidak ada kebutuhan khusus"}
                        </p>
                      </div>
                    </div>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setMembers((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="text-[#475569] hover:text-[#DC2626]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}

                {showAddForm ? (
                  <form
                    onSubmit={handleAddDraftMember}
                    className="space-y-3 rounded-[16px] border border-[#E2E8F0] bg-[#F4F1EA] p-4"
                  >
                    <input
                      value={newPanggilan}
                      onChange={(e) => setNewPanggilan(e.target.value)}
                      placeholder="Nama panggilan & usia (mis. Sari, Ibu (39 thn))"
                      required
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none focus-visible:border-[#C2410C]"
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                      <select
                        value={newUmur}
                        onChange={(e) =>
                          setNewUmur(e.target.value as KelompokUmur)
                        }
                        className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none"
                      >
                        <option value="DEWASA">Dewasa</option>
                        <option value="LANSIA">Lansia</option>
                        <option value="ANAK">Anak</option>
                        <option value="BALITA">Balita</option>
                      </select>
                      <input
                        value={newKebutuhan}
                        onChange={(e) => setNewKebutuhan(e.target.value)}
                        placeholder="Kebutuhan khusus (opsional)"
                        className="h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="rounded-full px-4 py-1.5 text-xs text-[#475569]"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="rounded-full bg-[#C2410C] px-4 py-1.5 text-xs font-semibold text-white"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#E2E8F0] text-[15px] font-medium text-[#475569] hover:bg-[#F8FAFC]"
                  >
                    + Tambah anggota
                  </button>
                )}
              </div>

              <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]">
                Data anggota dipakai untuk membagi tugas evakuasi sesuai usia dan kebutuhan khusus (lansia/anak).
              </div>
            </div>
          )}

          {/* Langkah 2 — Alamat dan Kelurahan (persis Node 1725) */}
          {step === 2 && (
            <div className="space-y-8">
              <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]">
                Di mana alamat rumahmu?
              </h1>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-[#0F172A]">
                    Alamat lengkap
                  </label>
                  <textarea
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    rows={2}
                    className="h-[80px] w-full resize-none rounded-[12px] border border-[#E2E8F0] bg-white p-[18px] text-[15px] text-[#0F172A] outline-none focus-visible:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[14px] font-medium text-[#0F172A]">
                    Kelurahan
                  </label>
                  <select
                    value={regionId ?? ""}
                    onChange={(e) =>
                      setRegionId(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    className="h-[52px] w-full rounded-[12px] border border-[#E2E8F0] bg-white px-[18px] text-[15px] text-[#0F172A] outline-none focus-visible:border-[#C2410C]"
                  >
                    <option value="">Dayeuhkolot, Kab. Bandung</option>
                    {regions?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.kecamatan}, {r.kab_kota}
                      </option>
                    ))}
                  </select>
                  <p className="text-[13px] text-[#475569]">
                    Dipakai untuk menghitung risiko bencana lokasimu
                  </p>
                </div>
              </div>

              <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]">
                Kelurahan digunakan untuk memetakan titik kumpul terdekat &amp; prakiraan cuaca BMKG otomatis.
              </div>
            </div>
          )}

          {/* Langkah 3 — Kondisi Rumah (persis Node 1761) */}
          {step === 3 && (
            <div className="space-y-8">
              <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]">
                Bagaimana kondisi rumahmu?
              </h1>

              <div className="space-y-3">
                {KONDISI_OPTIONS.map((o) => {
                  const checked = selectedKondisi.includes(o.value);
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleKondisi(o.value)}
                      className="flex h-[56px] w-full items-center gap-3 rounded-[14px] bg-[#F4F1EA] px-4 text-left"
                    >
                      <span
                        className={`flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${
                          checked
                            ? "bg-[#C2410C] text-white"
                            : "border-[1.5px] border-[#E2E8F0] bg-white"
                        }`}
                      >
                        {checked && <Check className="size-3.5 stroke-[3]" />}
                      </span>
                      <span className="text-[16px] font-normal text-[#0F172A]">
                        {o.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]">
                Kondisi rumah menentukan langkah penyelamatan awal (MCB listrik, lantai atas, &amp; jalur keluar).
              </div>
            </div>
          )}

          {/* Langkah 4 — AI Menyusun Rencana (persis Node 1798) */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-7 text-center">
              <div className="size-[96px] animate-spin rounded-full border-8 border-[#E2E8F0] border-t-[#C2410C]" />
              <h1 className="text-[24px] font-semibold text-[#0F172A]">
                AI sedang menyusun rencanamu
              </h1>

              <div className="w-full space-y-4 text-left">
                {AI_STEPS.map((s, i) => {
                  const done = i < aiStepIndex;
                  const active = i === aiStepIndex;
                  return (
                    <div key={s} className="flex items-center gap-3 text-[15px]">
                      {done ? (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-xs text-white">
                          ✓
                        </span>
                      ) : active ? (
                        <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#C2410C]" />
                      ) : (
                        <span className="size-5 shrink-0 rounded-full border border-[#CBD5E1]" />
                      )}
                      <span
                        className={
                          done || active
                            ? "font-medium text-[#0F172A]"
                            : "text-[#64748B]"
                        }
                      >
                        {s}
                      </span>
                    </div>
                  );
                })}
              </div>

              {aiError && (
                <div className="w-full space-y-3 text-center">
                  <p className="text-sm text-[#DC2626]">{aiError}</p>
                  <button
                    type="button"
                    onClick={() => navigate("/beranda-saya", { replace: true })}
                    className="rounded-full bg-[#C2410C] px-6 py-2.5 text-xs font-semibold text-white"
                  >
                    Lanjut ke Beranda Saya
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigasi Bawah: Lewati dulu & Lanjut / Selesai, susun rencanaku (Node 1718 / 1754 / 1791) */}
          {step <= 3 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  step < 3
                    ? setStep((s) => s + 1)
                    : navigate("/beranda-saya", { replace: true })
                }
                className="text-[15px] font-normal text-[#475569] hover:text-[#0F172A]"
              >
                Lewati dulu
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-semibold text-white"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  className="inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-semibold text-white"
                >
                  Selesai, susun rencanaku
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
