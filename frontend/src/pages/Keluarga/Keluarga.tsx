import { useState } from "react";
import {
  useAddMember,
  useDeleteMember,
  useHousehold,
} from "@/hooks/useHousehold";
import type { KelompokUmur } from "@/lib/types";

const UMUR_LABEL: Record<KelompokUmur, string> = {
  BALITA: "Balita",
  ANAK: "Anak",
  DEWASA: "Dewasa",
  LANSIA: "Lansia",
};

const DEFAULT_MEMBERS = [
  {
    id: "m-1",
    nama: "Budi, Ayah (42 thn)",
    sub: "Tidak ada kebutuhan khusus",
    avatar: "/images/avatar-budi.webp",
    initials: "BP",
    tags: [] as string[],
  },
  {
    id: "m-2",
    nama: "Sari, Ibu (39 thn)",
    sub: "",
    avatar: null,
    initials: "SP",
    tags: ["Ibu hamil"],
  },
  {
    id: "m-3",
    nama: "Nenek Aminah (72 thn)",
    sub: "",
    avatar: null,
    initials: "NA",
    tags: ["Lansia", "Obat darah tinggi rutin"],
  },
  {
    id: "m-4",
    nama: "Raka (6 thn)",
    sub: "Balita, perlu pendampingan saat evakuasi",
    avatar: null,
    initials: "RP",
    tags: [] as string[],
  },
];

interface EmergencyContact {
  id: string;
  nama: string;
  nomor: string;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: "c-1", nama: "Pak RT Dayeuhkolot", nomor: "(022) 512-7788" },
  { id: "c-2", nama: "Puskesmas Dayeuhkolot", nomor: "(022) 589-1122" },
];

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

  const [contacts, setContacts] = useState<EmergencyContact[]>(DEFAULT_CONTACTS);
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
    setContacts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nama: contactNama.trim(),
        nomor: contactNomor.trim(),
      },
    ]);
    setContactNama("");
    setContactNomor("");
    setShowAddContact(false);
  }

  const hasBackendMembers = (household.members?.length ?? 0) > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Kolom Kiri — Head + Daftar Kartu Anggota (persis siagakeluarga.fig Node 2109..2145) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
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
          ? household.members!.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  {idx === 0 ? (
                    <img
                      src="/images/avatar-budi.webp"
                      alt={m.panggilan}
                      className="size-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[20px] text-[#0B2545]">
                      {getInitials(m.panggilan)}
                    </div>
                  )}
                  <div>
                    <p className="text-[18px] font-semibold text-[#0F172A]">
                      {m.panggilan} ({UMUR_LABEL[m.kelompok_umur]})
                    </p>
                    {m.kebutuhan_khusus ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.kebutuhan_khusus.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[13px] font-medium text-[#C2410C]"
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
                  onClick={() => deleteMember.mutate(m.id)}
                  className="text-[14px] font-semibold text-[#C2410C] hover:underline"
                >
                  Ubah
                </button>
              </div>
            ))
          : DEFAULT_MEMBERS.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-6"
              >
                <div className="flex items-center gap-4">
                  {m.avatar ? (
                    <img
                      src={m.avatar}
                      alt={m.nama}
                      className="size-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[20px] text-[#0B2545]">
                      {m.initials}
                    </div>
                  )}
                  <div>
                    <p className="text-[18px] font-semibold text-[#0F172A]">
                      {m.nama}
                    </p>
                    {m.tags.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[13px] font-medium text-[#C2410C]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-[14px] text-[#475569]">{m.sub}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMember(true)}
                  className="text-[14px] font-semibold text-[#C2410C] hover:underline"
                >
                  Ubah
                </button>
              </div>
            ))}
      </div>

      {/* Kolom Kanan — Panel Alamat, Kontak Darurat Keluarga Besar, Ringkasan Profil (persis Node 2147..2167) */}
      <div className="space-y-4">
        {/* Panel Alamat (Node 2147) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">Lokasi rumah</p>
          <div className="relative mt-3 h-[220px] w-full overflow-hidden rounded-[16px]">
            <img
              src="/images/map-dayeuhkolot.webp"
              alt="Lokasi rumah Dayeuhkolot"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-[100px] left-[146px] size-5 rounded-full bg-[#C2410C]" />
          </div>
          <p className="mt-4 text-[17px] font-semibold text-[#0F172A]">
            Jl. Raya Dayeuhkolot No. 12
          </p>
          <p className="mt-1 text-[15px] text-[#475569]">
            Kel. Dayeuhkolot, Kab. Bandung
          </p>
          <p className="mt-2.5 text-[13px] font-semibold text-[#9A3412]">
            Zona waspada banjir (400 m dari Sungai Citarum)
          </p>
        </div>

        {/* Kontak Darurat Keluarga Besar (Node 2155) */}
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-6">
          <p className="text-[13px] text-[#475569]">
            Kontak darurat keluarga besar
          </p>
          <div className="mt-3 space-y-2.5">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5"
              >
                <span className="text-[14px] font-semibold text-[#0F172A]">
                  {c.nama}
                </span>
                <span className="text-[13px] text-[#475569]">{c.nomor}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setShowAddContact(true)}
              className="w-full rounded-[10px] border border-[#CBD5E1] bg-white py-2.5 text-center text-[13px] font-semibold text-[#C2410C] hover:bg-[#F4F1EA]/40"
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
              <span className="font-semibold text-[#0F172A]">
                {hasBackendMembers
                  ? `${household.members!.length} orang`
                  : "4 orang"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Kebutuhan khusus</span>
              <span className="font-semibold text-[#C2410C]">3 kondisi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Status profil</span>
              <span className="font-semibold text-[#0F766E]">Lengkap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Anggota (persis Node 2381) */}
      {showAddMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
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
                  placeholder="Mis. Raka"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4"
        >
          <div className="w-full max-w-[460px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0F172A]">
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
                  placeholder="Mis. Pak RT Dayeuhkolot"
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
                  placeholder="Mis. (022) 512-7788"
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
