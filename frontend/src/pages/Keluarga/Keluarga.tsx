import { useState } from "react";
import {
  useAddMember,
  useDeleteMember,
  useHousehold,
} from "@/hooks/useHousehold";
import type { KelompokUmur } from "@/lib/types";
import { useKontakKeluarga } from "@/hooks/useKontak";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";

const UMUR_LABEL: Record<KelompokUmur, string> = {
  BALITA: "Balita",
  ANAK: "Anak",
  DEWASA: "Dewasa",
  LANSIA: "Lansia",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Keluarga() {
  const { data: household, isLoading } = useHousehold();
  const addMember = useAddMember();
  const deleteMember = useDeleteMember();

  const [showAddMember, setShowAddMember] = useState(false);
  const [panggilan, setPanggilan] = useState("");
  const [kelompokUmur, setKelompokUmur] = useState<KelompokUmur>("DEWASA");
  const [kebutuhan, setKebutuhan] = useState("");

  const { kontak: contacts, tambah: tambahKontak, hapus: hapusKontak } = useKontakKeluarga();
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactNama, setContactNama] = useState("");
  const [contactNomor, setContactNomor] = useState("");

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  async function onAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!panggilan.trim()) return;
    await addMember.mutateAsync({
      panggilan: panggilan.trim(),
      kelompok_umur: kelompokUmur,
      kebutuhan_khusus: kebutuhan.trim() || null,
    });
    setPanggilan("");
    setKebutuhan("");
    setKelompokUmur("DEWASA");
    setShowAddMember(false);
  }

  function onAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contactNama.trim() || !contactNomor.trim()) return;
    tambahKontak(contactNama, contactNomor);
    setContactNama("");
    setContactNomor("");
    setShowAddContact(false);
  }

  const hasBackendMembers = (household.members?.length ?? 0) > 0;
  const profilLengkap = hasBackendMembers && Boolean(household.region_id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Kolom Kiri — Head + Daftar Kartu Anggota (persis siagakeluarga.fig Node 2109..2145) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0B2545]">
            Profil keluarga
          </h1>
          <button
            type="button"
            onClick={() => setShowAddMember(true)}
            className="h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            + Tambah anggota
          </button>
        </div>

        {hasBackendMembers
          ? household.members!.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[20px] text-[#0B2545]">
                      {getInitials(m.panggilan)}
                    </div>
                  <div>
                    <p className="text-[18px] font-semibold text-[#0B2545]">
                      {m.panggilan} ({UMUR_LABEL[m.kelompok_umur]})
                    </p>
                    {m.kebutuhan_khusus ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.kebutuhan_khusus.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[6px] bg-[#F1F5F9] px-2.5 py-1 text-[13px] font-medium text-[#C2410C]"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-[14px] text-[#475569]">
                        Tidak ada kebutuhan khusus
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus ${m.panggilan} dari keluarga?`)) deleteMember.mutate(m.id);
                  }}
                  aria-label={`Hapus ${m.panggilan}`}
                  className="text-[14px] font-semibold text-[#B91C1C] hover:underline"
                >
                  Hapus
                </button>
              </div>
            ))
          : (
              <div className="rounded-[20px] border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
                <EmptyIllustration />
                <p className="text-[18px] font-semibold text-[#0B2545]">Belum ada anggota keluarga</p>
                <p className="mx-auto mt-2 max-w-[44ch] text-[15px] leading-[1.6] text-[#475569]">
                  Tambahkan semua orang yang tinggal di rumah. Usia dan kebutuhan khusus menentukan
                  isi tas siaga dan tugas masing-masing.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddMember(true)}
                  className="mt-5 h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white hover:bg-[#9A3412]"
                >
                  + Tambah anggota pertama
                </button>
              </div>
            )}
      </div>

      {/* Kolom Kanan — Panel Alamat, Kontak Darurat Keluarga Besar, Ringkasan Profil (persis Node 2147..2167) */}
      <div className="space-y-4">
        {/* Panel Alamat (Node 2147) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">Lokasi rumah</p>
          <p className="mt-3 text-[17px] font-semibold text-[#0B2545]">
            {household.region
              ? `Kec. ${household.region.kecamatan}`
              : "Lokasi belum diisi"}
          </p>
          <p className="mt-1 text-[15px] text-[#475569]">
            {household.region
              ? household.region.kab_kota
              : "Isi wilayah di Onboarding supaya titik kumpul dan cuaca sesuai rumahmu."}
          </p>
          {household.region?.hazard_zones?.length ? (
            <p className="mt-2.5 text-[13px] font-semibold text-[#9A3412]">
              Rawan: {household.region.hazard_zones.map((z) => z.jenis_bencana.toLowerCase().replace("_", " ")).join(", ")}
            </p>
          ) : null}
        </div>

        {/* Kontak Darurat Keluarga Besar (Node 2155) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">
            Kontak darurat keluarga besar
          </p>
          <div className="mt-3 space-y-2.5">
            {contacts.length === 0 && (
              <p className="text-[13px] leading-[1.6] text-[#475569]">
                Belum ada kontak. Tambahkan RT, puskesmas, atau BPBD setempat. Nomor 112 selalu tersedia di
                halaman rencana. Kontak ini tersimpan di perangkat ini saja.
              </p>
            )}
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5"
              >
                <span className="text-[14px] font-semibold text-[#0B2545]">
                  {c.nama}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-[13px] text-[#475569]">{c.nomor}</span>
                  <button
                    type="button"
                    onClick={() => hapusKontak(c.id)}
                    aria-label={`Hapus kontak ${c.nama}`}
                    className="text-[13px] font-semibold text-[#B91C1C] hover:underline"
                  >
                    Hapus
                  </button>
                </span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowAddContact(true)}
              className="w-full rounded-[10px] border border-[#CBD5E1] bg-white py-2.5 text-center text-[13px] font-semibold text-[#C2410C] hover:bg-[#F1F5F9]/40"
            >
              + Tambah kontak darurat
            </button>
          </div>
        </div>

        {/* Ringkasan Profil (Node 2167) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">Ringkasan profil</p>
          <div className="mt-3 space-y-3 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Anggota terdaftar</span>
              <span className="font-semibold text-[#0B2545]">
                {hasBackendMembers
                  ? `${household.members!.length} orang`
                  : "0 orang"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Kebutuhan khusus</span>
              <span className="font-semibold text-[#C2410C]">
                {(household.members ?? []).filter((m) => m.kebutuhan_khusus).length} orang
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Status profil</span>
              <span className={profilLengkap ? "font-semibold text-[#0F766E]" : "font-semibold text-[#B45309]"}>
                {profilLengkap ? "Lengkap" : "Belum lengkap"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Anggota (persis Node 2381) */}
      {showAddMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#060B14]/55 p-4"
        >
          <div className="w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0B2545]">
                Tambah anggota keluarga
              </h2>
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className="flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]"
              >
                ×
              </button>
            </div>
            <form onSubmit={onAddMember} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Nama panggilan
                </label>
                <input
                  value={panggilan}
                  onChange={(e) => setPanggilan(e.target.value)}
                  placeholder="Nama panggilan"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Kelompok umur
                </label>
                <select
                  value={kelompokUmur}
                  onChange={(e) =>
                    setKelompokUmur(e.target.value as KelompokUmur)
                  }
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                >
                  {Object.entries(UMUR_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Kebutuhan khusus (opsional)
                </label>
                <input
                  value={kebutuhan}
                  onChange={(e) => setKebutuhan(e.target.value)}
                  placeholder="Mis. Lansia, obat darah tinggi rutin"
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white"
                >
                  Simpan anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kontak Darurat (persis Node 2280) */}
      {showAddContact && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#060B14]/55 p-4"
        >
          <div className="w-full max-w-[460px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0B2545]">
                Tambah kontak darurat
              </h2>
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className="flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]"
              >
                ×
              </button>
            </div>
            <form onSubmit={onAddContact} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Nama kontak / instansi
                </label>
                <input
                  value={contactNama}
                  onChange={(e) => setContactNama(e.target.value)}
                  placeholder="Mis. Pak RT, Puskesmas, BPBD setempat"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#475569]">
                  Nomor telepon
                </label>
                <input
                  value={contactNomor}
                  onChange={(e) => setContactNomor(e.target.value)}
                  placeholder="Mis. 0812-3456-7890"
                  required
                  className="h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white"
                >
                  Simpan kontak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
