import { useState } from "react";
import { useHousehold } from "@/hooks/useHousehold";
import { FASE_LABEL, type Fase } from "@/content/panduan";
import type { JenisBencana } from "@/lib/types";

const SECTIONS = [
  { id: "ringkasan", label: "Ringkasan risiko", active: true },
  { id: "titik-kumpul", label: "Titik kumpul", active: false },
  { id: "tugas", label: "Tugas tiap anggota", active: false },
  { id: "kontak", label: "Kontak darurat", active: false },
  { id: "catatan", label: "Catatan khusus", active: false },
];

const SCENARIOS: { jenis: JenisBencana; label: string; activeBg: string }[] = [
  { jenis: "BANJIR", label: "Banjir", activeBg: "bg-[#1D4ED8]" },
  { jenis: "GEMPA", label: "Gempa", activeBg: "bg-[#B91C1C]" },
  { jenis: "LONGSOR", label: "Longsor", activeBg: "bg-[#A16207]" },
];

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Rencana() {
  const { data: household, isLoading } = useHousehold();

  const [activeJenis, setActiveJenis] = useState<JenisBencana>("BANJIR");
  const [activeFase, setActiveFase] = useState<Fase>("sebelum");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted" />;
  }

  const plan = household.emergency_plans?.[0];
  const konten = plan?.konten;
  const shareUrl = `${window.location.origin}/r/${household.share_token}`;

  async function copyShareLink() {
    await navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
      {/* Dokumen Utama tanpa kartu pembungkus luar (persis siagakeluarga.fig Node 2444) */}
      <div className="space-y-4">
        {/* Head: Rencana darurat + Bagikan + Unduh (Node 2445) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]">
            Rencana darurat
          </h1>
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
            >
              Bagikan ke keluarga
            </button>
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="h-[44px] rounded-[12px] border border-[#0B2545] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
            >
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Tabs Skenario: Banjir, Gempa, Longsor (persis Node 2452) */}
        <div className="flex flex-wrap gap-2 pt-2 print:hidden">
          {SCENARIOS.map((s) => {
            const active = activeJenis === s.jenis;
            return (
              <button
                key={s.jenis}
                type="button"
                onClick={() => setActiveJenis(s.jenis)}
                className={`h-[40px] rounded-full px-5 text-[14px] transition-colors ${
                  active
                    ? `${s.activeBg} font-semibold text-white`
                    : "border border-[#E2E8F0] bg-white/80 font-medium text-[#475569] hover:bg-white"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Sub Tabs: Sebelum, Saat, Sesudah (persis Node 2459) */}
        <div className="flex w-full max-w-[320px] gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-[5px] print:hidden">
          {FASES.map((f) => {
            const active = activeFase === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFase(f)}
                className={`flex-1 rounded-[8px] py-1.5 text-[13px] transition-colors ${
                  active
                    ? "bg-[#0B2545] font-semibold text-white"
                    : "font-medium text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                {FASE_LABEL[f]}
              </button>
            );
          })}
        </div>

        {/* Ringkasan Risiko (persis Node 2466) */}
        <section
          id="ringkasan"
          className="rounded-[14px] border border-[#E2E8F0] bg-white px-6 py-5"
        >
          <p className="text-[13px] text-[#9A3412]">Ringkasan risiko</p>
          <p className="mt-1.5 text-[16px] leading-[1.45] text-[#0F172A]">
            {konten?.ringkasan_risiko ??
              "Rumah berada 400 m dari bantaran sungai. Banjir dapat naik cepat saat hujan lebat lebih dari 2 jam."}
          </p>
        </section>

        {/* Titik Kumpul (persis Node 2469) */}
        <section
          id="titik-kumpul"
          className="flex flex-col gap-5 rounded-[20px] border border-[#E2E8F0] bg-white p-6 sm:flex-row sm:items-center"
        >
          <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-[16px] sm:w-[160px]">
            <img
              src="/images/map-dayeuhkolot.webp"
              alt="Peta titik kumpul"
              className="h-full w-full object-cover"
            />
            <svg
              viewBox="0 0 160 120"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <path
                d="M28 96 L78 64 L126 32"
                stroke="#C2410C"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="122" cy="30" r="8" fill="#C2410C" />
            </svg>
          </div>
          <div>
            <p className="text-[12px] text-[#475569]">Titik kumpul</p>
            <p className="mt-1.5 text-[20px] font-bold text-[#0F172A]">
              Aula Masjid Agung Dayeuhkolot
            </p>
            <p className="mt-1.5 text-[16px] text-[#475569]">
              {konten?.rute_dan_titik_kumpul ??
                "400 meter, sekitar 5 menit berjalan kaki dari rumah"}
            </p>
          </div>
        </section>

        {/* Tugas Tiap Anggota (persis Node 2477..2494) */}
        <section id="tugas" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-[#0F172A]">
            Tugas tiap anggota
          </h2>
          {(konten?.pembagian_tugas_keluarga?.length
            ? konten.pembagian_tugas_keluarga
            : [
                {
                  anggota: "Budi (Ayah)",
                  tugas:
                    "Membawa tas siaga dan dokumen penting ke titik kumpul",
                },
                {
                  anggota: "Sari (Ibu)",
                  tugas:
                    "Mendampingi Raka dan memastikan obat Nenek Aminah terbawa",
                },
                {
                  anggota: "Nenek Aminah",
                  tugas:
                    "Tetap bersama Sari, jalan perlahan menuju titik kumpul",
                },
              ]
          ).map((t, i) => {
            const name = t.anggota ?? `Anggota ${i + 1}`;
            return (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[16px] border border-[#E2E8F0] bg-white p-5"
              >
                {i === 0 ? (
                  <img
                    src="/images/avatar-budi.webp"
                    alt={name}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[15px] text-[#0B2545]">
                    {getInitials(name)}
                  </div>
                )}
                <div>
                  <p className="text-[16px] font-bold text-[#0F172A]">{name}</p>
                  <p className="mt-1 text-[16px] text-[#475569]">
                    {t.tugas ?? t.peran}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Kontak Darurat (persis Node 2495..2501) */}
        <section id="kontak" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-bold text-[#0F172A]">
            Kontak darurat
          </h2>
          <div className="flex items-center justify-between rounded-[16px] border border-[#E2E8F0] bg-white p-5">
            <div>
              <p className="text-[17px] font-semibold text-[#0F172A]">
                BPBD Kab. Bandung
              </p>
              <p className="mt-1 text-[15px] text-[#475569]">(022) 589-2458</p>
            </div>
            <a
              href="tel:0225892458"
              className="flex size-[44px] items-center justify-center rounded-full bg-[#C2410C] text-[18px] text-white"
            >
              ☎
            </a>
          </div>
        </section>

        {/* Catatan Khusus (persis Node 2502..2505) */}
        <section id="catatan" className="space-y-3 pt-2">
          <h2 className="text-[22px] font-semibold text-[#0F172A]">
            Catatan khusus
          </h2>
          <div className="rounded-[20px] bg-[#F4F1EA] p-6">
            <p className="text-[17px] font-semibold text-[#0F172A]">
              Kebutuhan Nenek Aminah
            </p>
            <p className="mt-2 text-[15px] leading-[1.45] text-[#475569]">
              Obat darah tinggi harus selalu ada di tas siaga. Mobilitas
              terbatas, perlu dibantu berjalan menuju titik kumpul. Dokter
              keluarga: dr. Santi, (022) 701-4455.
            </p>
          </div>
        </section>
      </div>

      {/* Kolom Kanan — Daftar Isi & Status Cuaca Saat Ini (persis Node 2506 & 2513) */}
      <aside className="hidden h-fit space-y-5 lg:block print:hidden">
        <nav className="rounded-[14px] border border-[#E2E8F0] bg-white p-5">
          <p className="text-[12px] text-[#475569]">Daftar isi</p>
          <div className="mt-4 space-y-3">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`block text-[14px] ${
                  s.active
                    ? "font-medium text-[#C2410C]"
                    : "text-[#475569] hover:text-[#C2410C]"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5">
          <p className="text-[12px] font-semibold text-[#C2410C]">
            Status Cuaca Saat Ini
          </p>
          <p className="mt-2 text-[20px] font-semibold text-[#0B2545]">
            24°C, Hujan Lebat
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.35] text-[#475569]">
            Kel. Dayeuhkolot (Sumber BMKG). Pantau ketinggian air di teras.
          </p>
          <a
            href="tel:112"
            className="mt-4 block w-full rounded-[10px] bg-[#C2410C] py-2.5 text-center text-[13px] font-semibold text-white"
          >
            Hubungi Darurat 112
          </a>
        </div>
      </aside>

      {/* Modal Preview Unduh PDF (persis siagakeluarga.fig Node 2627) */}
      {showPdfModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden"
        >
          <div className="flex w-full max-w-[640px] flex-col gap-[18px] rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0B2545]">
                Preview Lembar Darurat (Siap Cetak A4)
              </h2>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]"
              >
                ×
              </button>
            </div>

            {/* Preview Kertas A4 (Node 2631) */}
            <div className="overflow-hidden rounded-[4px] border border-[#CBD5E1] bg-white pb-[22px] shadow-[0_8px_24px_rgba(11,37,69,0.11)]">
              <div className="flex h-12 items-center justify-between bg-[#0B2545] px-[22px]">
                <p className="text-[16px] font-bold text-white">
                  Rencana Darurat Keluarga Pratama
                </p>
                <span className="text-[12px] font-semibold text-[#93C5FD]">
                  Skenario Banjir
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2.5 px-[22px] pt-1.5">
                <p className="text-[12px] text-[#475569]">
                  Jl. Raya Dayeuhkolot No. 12, Kab. Bandung (Titik kumpul: Aula
                  Masjid Agung, 400 m)
                </p>
                <div className="h-px w-full bg-[#E2E8F0]" />
                <p className="text-[13px] font-semibold text-[#0F172A]">
                  Pembagian Tugas Anggota Keluarga
                </p>
                <p className="text-[12px] leading-[20px] text-[#475569]">
                  1. Budi (Ayah): Matikan MCB listrik, bawa tas siaga &amp;
                  dokumen kedap air.
                </p>
                <p className="text-[12px] leading-[20px] text-[#475569]">
                  2. Sari (Ibu): Dampingi Raka &amp; pastikan obat darah tinggi
                  Nenek Aminah terbawa.
                </p>
                <p className="text-[12px] leading-[20px] text-[#475569]">
                  3. Nenek Aminah: Evakuasi lebih dulu menuju Aula Masjid Agung
                  via jalur datar.
                </p>
                <div className="h-px w-full bg-[#E2E8F0]" />
                <p className="text-[12px] font-semibold text-[#9A3412]">
                  Nomor Darurat: 112 (Nasional) | BPBD Kab. Bandung (022)
                  589-2458 | Puskesmas (022) 589-1122
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-[#64748B]">
                Format: PDF A4 (1 halaman)
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfModal(false);
                    setTimeout(() => window.print(), 150);
                  }}
                  className="h-11 rounded-[8px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]"
                >
                  Cetak Langsung
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfModal(false);
                    setTimeout(() => window.print(), 150);
                  }}
                  className="h-11 rounded-[8px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white"
                >
                  Unduh PDF (120 KB)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bagikan ke Keluarga (persis siagakeluarga.fig Node 2759) */}
      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4 print:hidden"
        >
          <div className="flex w-full max-w-[540px] flex-col gap-[18px] rounded-[18px] border border-[#E2E8F0] bg-white px-9 py-8 shadow-[0_20px_48px_rgba(11,37,69,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#0B2545]">
                Bagikan Rencana Darurat Keluarga
              </h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]"
              >
                ×
              </button>
            </div>

            <p className="text-[13px] leading-[20px] text-[#475569]">
              Anggota keluarga bisa membuka rencana ini langsung dari ponsel
              tanpa perlu login (mode hanya baca).
            </p>

            <div className="flex h-[54px] items-center justify-between gap-2.5 rounded-[10px] border border-[#CBD5E1] bg-[#F8FAFC] py-2 pr-2 pl-4">
              <span className="truncate text-[14px] font-medium text-[#0B2545]">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={copyShareLink}
                className="h-9 shrink-0 rounded-[7px] bg-[#0B2545] px-4 text-[13px] font-semibold text-white"
              >
                {copied ? "Tersalin" : "Salin tautan"}
              </button>
            </div>

            {/* Tanpa kotak bersarang abu-abu/krem — tipografi tampil langsung dan rapi (Node 2768) */}
            <div className="space-y-1.5 py-1">
              <p className="text-[13px] font-semibold text-[#0B2545]">
                Yang dapat dilihat penerima tautan:
              </p>
              <p className="text-[12px] leading-[19px] text-[#475569]">
                Titik kumpul Aula Masjid Agung Dayeuhkolot, pembagian tugas
                anggota, catatan Nenek Aminah, dan tombol Telepon 112.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Rencana Darurat Keluarga Pratama: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 flex-1 items-center justify-center rounded-[8px] bg-[#0F766E] px-5 text-[14px] font-semibold text-white"
              >
                Kirim ke WhatsApp Keluarga
              </a>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="h-11 rounded-[8px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
