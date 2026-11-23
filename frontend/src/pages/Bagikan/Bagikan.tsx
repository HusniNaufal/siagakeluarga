import { useParams } from "react-router-dom";
import { useShareCard } from "@/hooks/useShare";
import { NOMOR_UTAMA } from "@/content/kontak";

const UMUR: Record<string, string> = {
  BALITA: "Balita",
  ANAK: "Anak",
  DEWASA: "Dewasa",
  LANSIA: "Lansia",
};

function jarakLabel(km: number | null | undefined) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m dari rumah` : `${km.toFixed(1)} km dari rumah`;
}

export function Bagikan() {
  const { token } = useParams();
  const { data: card, isLoading, isError } = useShareCard(token);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[16px] text-[#475569]">
        Memuat rencana...
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[390px] flex-col justify-center px-5">
        <h1 className="text-[24px] font-bold text-[#0B2545]">Rencana tidak ditemukan</h1>
        <p className="mt-2 text-[16px] leading-[1.5] text-[#475569]">
          Tautan ini salah atau sudah diganti oleh pemiliknya. Minta tautan terbaru ke anggota keluarga
          yang membagikannya.
        </p>
        <a
          href={`tel:${NOMOR_UTAMA.nomor}`}
          className="mt-6 flex h-[56px] items-center justify-center rounded-full bg-[#DC2626] text-[18px] font-bold text-white"
        >
          ☎ Telepon {NOMOR_UTAMA.nomor}
        </a>
      </div>
    );
  }

  const konten = card.rencana_evakuasi?.konten;
  const titik = card.titik_kumpul?.[0];
  const tugas = konten?.pembagian_tugas_keluarga ?? [];
  const catatan = card.anggota.filter((a) => a.kebutuhan_khusus);

  return (
    <div className="relative mx-auto min-h-screen max-w-[390px] overflow-hidden bg-white px-5 py-6">

      <div className="relative z-10">
        <p className="text-[13px] text-[#475569]">Rencana darurat (hanya baca)</p>
        <h1 className="mt-1 text-[28px] leading-tight font-bold text-[#0B2545]">{card.keluarga}</h1>
        {card.lokasi && (
          <p className="mt-1 text-[15px] text-[#475569]">
            Kec. {card.lokasi.kecamatan}, {card.lokasi.kab_kota}
          </p>
        )}

        <div className="mt-5 rounded-[20px] bg-[#F1F5F9] p-5">
          <p className="text-[13px] text-[#9A3412]">Ringkasan risiko</p>
          <p className="mt-2 text-[17px] leading-[1.4] text-[#0B2545]">
            {konten?.ringkasan_risiko ??
              (card.zona_risiko.length
                ? `Wilayah ini rawan: ${card.zona_risiko
                    .map((z) => `${z.jenis_bencana.toLowerCase().replace("_", " ")} (${z.tingkat.toLowerCase()})`)
                    .join(", ")}.`
                : "Belum ada ringkasan risiko untuk wilayah ini.")}
          </p>
        </div>

        <div className="mt-3.5 rounded-[20px] bg-[#F1F5F9] p-5">
          <p className="text-[13px] text-[#C2410C]">Titik kumpul</p>
          {titik ? (
            <>
              <p className="mt-1.5 text-[19px] leading-[1.25] font-bold text-[#0B2545]">{titik.nama}</p>
              {jarakLabel(titik.jarak_km) && (
                <p className="mt-1 text-[16px] text-[#475569]">{jarakLabel(titik.jarak_km)}</p>
              )}
            </>
          ) : (
            <p className="mt-1.5 text-[16px] leading-[1.4] text-[#475569]">
              Belum ada titik kumpul tercatat. Tanyakan ke pemilik rencana.
            </p>
          )}
        </div>

        <div className="mt-3.5 space-y-2.5">
          {tugas.length > 0
            ? tugas.map((t, i) => (
                <div key={i} className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3.5">
                  <p className="text-[13px] text-[#475569]">Tugas {t.anggota ?? `anggota ${i + 1}`}</p>
                  <p className="mt-1 text-[17px] leading-[1.35] font-medium text-[#0B2545]">
                    {t.tugas ?? t.peran}
                  </p>
                </div>
              ))
            : card.anggota.map((a) => (
                <div key={a.panggilan} className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3.5">
                  <p className="text-[17px] font-semibold text-[#0B2545]">
                    {a.panggilan} <span className="text-[14px] font-normal text-[#475569]">({UMUR[a.kelompok_umur]})</span>
                  </p>
                </div>
              ))}
        </div>

        {catatan.length > 0 && (
          <div className="mt-3.5 rounded-[20px] bg-[#F1F5F9] p-5">
            <p className="text-[13px] text-[#475569]">Catatan khusus</p>
            {catatan.map((a) => (
              <p key={a.panggilan} className="mt-2 text-[16px] leading-[1.4] text-[#0B2545]">
                <span className="font-semibold">{a.panggilan}:</span> {a.kebutuhan_khusus}
              </p>
            ))}
          </div>
        )}

        <a
          href={`tel:${NOMOR_UTAMA.nomor}`}
          className="mt-5 flex h-[64px] w-full items-center justify-center rounded-full bg-[#DC2626] text-[20px] font-bold text-white"
        >
          ☎ Telepon {NOMOR_UTAMA.nomor}
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-3.5 block min-h-11 w-full text-center text-[15px] font-semibold text-[#C2410C]"
        >
          Cetak atau simpan sebagai PDF
        </button>

        <div className="mt-6 text-center text-[12px] text-[#475569]">
          <p>Saat kejadian, ikuti arahan BPBD dan petugas di tempat.</p>
          <p className="mt-1 font-medium">Dibuat dengan SiagaKeluarga</p>
        </div>
      </div>
    </div>
  );
}
