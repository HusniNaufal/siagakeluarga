import { useParams } from "react-router-dom";
import { useShareCard } from "@/hooks/useShare";
import { TopoBackground } from "@/components/layout/TopoBackground";

const FALLBACK_TASKS: { anggota?: string; tugas?: string; peran?: string }[] = [
  {
    anggota: "Tugas Budi (Ayah)",
    tugas: "Mematikan listrik dan gas, lalu membawa dokumen penting keluarga.",
  },
  {
    anggota: "Tugas Sari (Ibu)",
    tugas: "Mendampingi Raka dan memastikan obat Nenek Aminah terbawa.",
  },
  {
    anggota: "Tugas untuk Nenek Aminah",
    tugas:
      "Dievakuasi lebih dulu dengan bantuan kursi roda, obat rutin dibawakan Sari.",
  },
];

export function Bagikan() {
  const { token } = useParams();
  const { data: card, isLoading } = useShareCard(token);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-[#475569]">
        Memuat rencana...
      </div>
    );
  }

  const keluargaNama = card?.keluarga || "Keluarga Pratama";
  const titikUtama =
    card?.titik_kumpul?.[0]?.nama || "Aula Masjid Agung Dayeuhkolot";
  const tugasList =
    card?.rencana_evakuasi?.konten?.pembagian_tugas_keluarga?.length
      ? card.rencana_evakuasi.konten.pembagian_tugas_keluarga
      : FALLBACK_TASKS;

  return (
    /* Rencana Publik (Mobile) — persis siagakeluarga.fig Node 3785..3815 */
    <div className="relative mx-auto min-h-screen max-w-[390px] overflow-hidden bg-white px-5 py-6">
      <TopoBackground variant="light" />

      <div className="relative z-10">
        <p className="text-[12px] text-[#475569]">
          Rencana darurat (hanya baca)
        </p>
        <h1 className="mt-1 text-[28px] leading-tight font-bold text-[#0F172A]">
          {keluargaNama}
        </h1>

        {/* Ringkasan Risiko (Node 3791) */}
        <div className="mt-5 rounded-[20px] bg-[#F4F1EA] p-5">
          <p className="text-[20px] font-bold text-[#92400E]">
            ⚠ Waspada banjir
          </p>
          <p className="mt-2 text-[17px] leading-[1.35] text-[#92400E]">
            {card?.rencana_evakuasi?.konten?.ringkasan_risiko ??
              "Hujan lebat diperkirakan sore ini di Dayeuhkolot."}
          </p>
        </div>

        {/* Titik Kumpul (Node 3794) */}
        <div className="mt-3.5 rounded-[20px] bg-[#F4F1EA] p-5">
          <p className="text-[12px] text-[#C2410C]">Titik kumpul</p>
          <p className="mt-1.5 text-[18px] leading-[1.25] font-bold text-[#0F172A]">
            {titikUtama}
          </p>
          <p className="mt-1 text-[16px] text-[#475569]">400 meter dari rumah</p>
        </div>

        {/* Tugasmu (Node 3798, 3801, 3804) */}
        <div className="mt-3.5 space-y-2.5">
          {tugasList.map((t, i) => {
            const label = t.anggota?.startsWith("Tugas")
              ? t.anggota
              : `Tugas ${t.anggota}`;
            return (
              <div
                key={i}
                className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3.5"
              >
                <p className="text-[12px] text-[#475569]">{label}</p>
                <p className="mt-1 text-[16px] leading-[1.3] font-medium text-[#0F172A]">
                  {t.tugas ?? t.peran}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tombol Telepon 112 (Node 3807) */}
        <a
          href="tel:112"
          className="mt-5 flex h-[64px] w-full items-center justify-center rounded-full bg-[#DC2626] text-[20px] font-bold text-white"
        >
          ☎ Telepon 112
        </a>

        {/* Unduh sebagai PDF (Node 3809) */}
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-3.5 block w-full text-center text-[15px] font-semibold text-[#C2410C]"
        >
          Unduh sebagai PDF
        </button>

        {/* Footer Credit (Node 3812) */}
        <div className="mt-6 text-center text-[12px] text-[#475569]">
          <p>Data cuaca BMKG &amp; data bencana BNPB</p>
          <p className="mt-1 font-medium">Dibuat dengan SiagaKeluarga</p>
        </div>
      </div>
    </div>
  );
}
