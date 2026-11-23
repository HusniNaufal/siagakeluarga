import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, MapPin } from "lucide-react";
import { useShareCard } from "@/hooks/useShare";
import { useKabarPublik, useKirimKabar, type StatusKabar } from "@/hooks/useKabar";
import { Logo } from "@/components/brand/Logo";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { KabarStatus, petaHref } from "@/components/app/KabarStatus";
import { NOMOR_UTAMA } from "@/content/kontak";
import { telHref } from "@/hooks/useKontak";
import { cn } from "@/lib/utils";

const UMUR: Record<string, string> = { BALITA: "Balita", ANAK: "Anak", DEWASA: "Dewasa", LANSIA: "Lansia" };

function jarakLabel(km: number | null | undefined) {
  if (km == null) return null;
  return km < 1 ? `${Math.round(km * 1000)} m dari rumah` : `${km.toFixed(1)} km dari rumah`;
}

const KUNCI = (token: string) => `siagakeluarga.kabar.${token}`;

/** Halaman publik hanya-baca yang dibuka anggota keluarga lewat tautan, tanpa login. */
export function Bagikan() {
  const { token } = useParams();
  const { data: card, isLoading, isError } = useShareCard(token);
  const { data: kabar } = useKabarPublik(token);
  const kirim = useKirimKabar(token);

  // Siapa kamu: id anggota, "lain", atau belum dipilih. Diingat di perangkat ini.
  const [siapa, setSiapa] = useState<string | null>(null);
  const [namaLain, setNamaLain] = useState("");
  const [sertakanLokasi, setSertakanLokasi] = useState(false);
  const [pesan, setPesan] = useState("");
  const [hasil, setHasil] = useState<string | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    try {
      const simpan = JSON.parse(localStorage.getItem(KUNCI(token)) ?? "null");
      if (simpan?.siapa) setSiapa(simpan.siapa);
      if (simpan?.namaLain) setNamaLain(simpan.namaLain);
    } catch {
      // abaikan penyimpanan rusak
    }
  }, [token]);

  function ingat(s: string | null, n: string) {
    if (!token) return;
    try {
      localStorage.setItem(KUNCI(token), JSON.stringify({ siapa: s, namaLain: n }));
    } catch {
      // penyimpanan dimatikan: tetap bekerja tanpa mengingat
    }
  }

  if (isLoading) {
    return <div className="flex min-h-svh items-center justify-center bg-paper text-[16px] text-ink-3">Memuat rencana…</div>;
  }

  if (isError || !card) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-paper px-6 text-center">
        <EmptyIllustration />
        <h1 className="t-h3 text-ink">Rencana tidak ditemukan</h1>
        <p className="mt-3 max-w-[40ch] text-[16px] leading-[1.6] text-ink-3">
          Tautan ini salah atau sudah diganti pemiliknya. Minta tautan terbaru ke anggota keluarga yang membagikannya.
        </p>
        <a
          href={telHref(NOMOR_UTAMA.nomor)}
          className="mt-6 inline-flex h-14 items-center rounded-full bg-bahaya px-8 text-[17px] font-semibold text-white"
        >
          Telepon {NOMOR_UTAMA.nomor}
        </a>
      </div>
    );
  }

  const konten = card.rencana_evakuasi?.konten;
  const titik = card.titik_kumpul?.[0];
  const tugas = konten?.pembagian_tugas_keluarga ?? [];
  const catatan = card.anggota.filter((a) => a.kebutuhan_khusus);
  const anggotaKabar = kabar?.anggota ?? [];

  const bisaKirim = siapa !== null && (siapa !== "lain" || namaLain.trim().length > 0);
  const identitas = siapa && siapa !== "lain" ? { member_id: siapa } : { nama: namaLain.trim() };

  function posisi(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((selesai) => {
      if (!sertakanLokasi || !("geolocation" in navigator)) return selesai(null);
      navigator.geolocation.getCurrentPosition(
        (p) => selesai({ lat: Number(p.coords.latitude.toFixed(5)), lng: Number(p.coords.longitude.toFixed(5)) }),
        () => selesai(null),
        { timeout: 8000, maximumAge: 60_000 },
      );
    });
  }

  async function kirimKabar(status: StatusKabar) {
    if (!bisaKirim) return;
    setGalat(null);
    setHasil(null);
    ingat(siapa, namaLain);
    const lokasi = await posisi();
    try {
      await kirim.mutateAsync({
        ...identitas,
        status,
        ...(lokasi ?? {}),
        ...(status === "BUTUH_BANTUAN" && pesan.trim() ? { pesan: pesan.trim() } : {}),
      });
      setHasil(
        status === "AMAN"
          ? "Kabarmu terkirim: kamu aman. Keluargamu bisa melihatnya sekarang."
          : "Permintaan bantuanmu terkirim ke keluarga. Hubungi 112 bila kamu dalam bahaya.",
      );
      if (sertakanLokasi && !lokasi) setHasil((h) => `${h} Lokasimu tidak bisa dibaca, jadi tidak ikut terkirim.`);
      setPesan("");
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Kabar belum terkirim. Coba lagi.");
    }
  }

  return (
    <div className="min-h-svh bg-paper print:bg-white">
      <div className="mx-auto max-w-[600px] px-5 pt-6 pb-16">
        <Link to="/" aria-label="SiagaKeluarga, beranda" className="inline-block print:hidden">
          <Logo />
        </Link>

        <p className="mt-8 text-[14px] text-muted">Rencana darurat (hanya baca)</p>
        <h1 className="t-h3 mt-1 text-ink">{card.keluarga}</h1>
        {card.lokasi && (
          <p className="mt-1 text-[15px] text-ink-3">
            Kec. {card.lokasi.kecamatan}, {card.lokasi.kab_kota}
          </p>
        )}

        {/* ---------- Kabar keluarga ---------- */}
        <section aria-labelledby="judul-kabar" className="mt-8 rounded-2xl border border-line bg-base p-5 print:hidden">
          <h2 id="judul-kabar" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            Kabar untuk keluarga
          </h2>
          <p className="mt-1 text-[15px] leading-[1.55] text-ink-3">
            Setelah bencana, beri tahu keluargamu kamu di mana dan bagaimana keadaanmu.
          </p>

          <fieldset className="mt-5">
            <legend className="text-[15px] font-medium text-ink">Siapa kamu?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {anggotaKabar.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={siapa === a.id}
                  onClick={() => setSiapa(a.id)}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full border px-4 text-[15px] transition-colors",
                    siapa === a.id ? "border-ink bg-ink text-white" : "border-line bg-base text-ink hover:border-ink/40",
                  )}
                >
                  {a.panggilan}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={siapa === "lain"}
                onClick={() => setSiapa("lain")}
                className={cn(
                  "inline-flex h-11 items-center rounded-full border px-4 text-[15px] transition-colors",
                  siapa === "lain" ? "border-ink bg-ink text-white" : "border-line bg-base text-ink hover:border-ink/40",
                )}
              >
                Orang lain
              </button>
            </div>
            {siapa === "lain" && (
              <div className="mt-3">
                <label htmlFor="nama-lain" className="block text-[15px] font-medium text-ink">
                  Namamu
                </label>
                <input
                  id="nama-lain"
                  value={namaLain}
                  onChange={(e) => setNamaLain(e.target.value)}
                  maxLength={40}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-line bg-base px-4 text-[16px] text-ink outline-none focus:border-ink"
                />
              </div>
            )}
          </fieldset>

          <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-ink">
            <input
              type="checkbox"
              checked={sertakanLokasi}
              onChange={(e) => setSertakanLokasi(e.target.checked)}
              className="size-5 accent-[var(--color-accent-dark)]"
            />
            Sertakan lokasiku (terlihat oleh yang memegang tautan ini)
          </label>

          <div className="mt-4">
            <label htmlFor="pesan-bantuan" className="block text-[15px] font-medium text-ink">
              Pesan singkat <span className="font-normal text-muted">(opsional, untuk permintaan bantuan)</span>
            </label>
            <input
              id="pesan-bantuan"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              maxLength={140}
              placeholder="Mis. terjebak di lantai 2"
              className="mt-1.5 h-12 w-full rounded-2xl border border-line bg-base px-4 text-[16px] text-ink outline-none focus:border-ink"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!bisaKirim || kirim.isPending}
              onClick={() => kirimKabar("AMAN")}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-aman text-[17px] font-semibold text-white disabled:opacity-40"
            >
              <Check className="size-5" strokeWidth={2.5} aria-hidden="true" />
              Saya aman
            </button>
            <button
              type="button"
              disabled={!bisaKirim || kirim.isPending}
              onClick={() => kirimKabar("BUTUH_BANTUAN")}
              className="inline-flex h-14 items-center justify-center rounded-full bg-bahaya text-[17px] font-semibold text-white disabled:opacity-40"
            >
              Saya butuh bantuan
            </button>
          </div>
          {!bisaKirim && <p className="mt-3 text-[14px] text-muted">Pilih namamu dulu untuk mengirim kabar.</p>}

          <div role="status" aria-live="polite">
            {hasil && <p className="mt-4 text-[15px] leading-[1.55] font-medium text-ink">{hasil}</p>}
            {galat && <p className="mt-4 text-[15px] text-bahaya">{galat}</p>}
          </div>

          {kabar && (
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {kabar.anggota.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <span className="text-[16px] font-medium text-ink">
                    {a.panggilan}
                    {siapa === a.id && <span className="ml-2 text-[13px] font-normal text-muted">(kamu)</span>}
                  </span>
                  <KabarStatus kabar={a.kabar} />
                </li>
              ))}
              {kabar.lainnya.map((l) => (
                <li key={l.nama} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                  <span className="text-[16px] font-medium text-ink">{l.nama}</span>
                  <KabarStatus kabar={l.kabar} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------- Rencana ---------- */}
        <section className="mt-6 rounded-2xl border border-line bg-base p-5">
          <h2 className="text-[14px] text-muted">Ringkasan risiko</h2>
          <p className="mt-2 text-[17px] leading-[1.5] text-ink">
            {konten?.ringkasan_risiko ??
              (card.zona_risiko.length
                ? `Wilayah ini rawan: ${card.zona_risiko
                    .map((z) => `${z.jenis_bencana.toLowerCase().replace("_", " ")} (${z.tingkat.toLowerCase()})`)
                    .join(", ")}.`
                : "Belum ada ringkasan risiko untuk wilayah ini.")}
          </p>
        </section>

        <section className="mt-4 rounded-2xl border border-line bg-base p-5">
          <h2 className="text-[14px] text-muted">Titik kumpul</h2>
          {titik ? (
            <>
              <p className="mt-2 text-[19px] leading-[1.3] font-semibold text-ink">{titik.nama}</p>
              {jarakLabel(titik.jarak_km) && <p className="mt-1 text-[15px] text-ink-3">{jarakLabel(titik.jarak_km)}</p>}
              <a
                href={petaHref(titik.lat, titik.lng)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[15px] font-semibold text-ink hover:bg-tint print:hidden"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Buka di peta
              </a>
            </>
          ) : (
            <p className="mt-2 text-[16px] leading-[1.5] text-ink-3">Belum ada titik kumpul tercatat. Tanyakan ke pemilik rencana.</p>
          )}
        </section>

        <section className="mt-4">
          <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Tugas tiap anggota</h2>
          <ul className="mt-3 space-y-3">
            {tugas.length > 0
              ? tugas.map((t, i) => (
                  <li key={i} className="rounded-2xl border border-line bg-base px-5 py-4">
                    <p className="text-[14px] text-muted">{t.anggota ?? `Anggota ${i + 1}`}</p>
                    <p className="mt-1 text-[17px] leading-[1.45] font-medium text-ink">{t.tugas ?? t.peran}</p>
                  </li>
                ))
              : card.anggota.map((a) => (
                  <li key={a.panggilan} className="rounded-2xl border border-line bg-base px-5 py-4">
                    <p className="text-[17px] font-semibold text-ink">
                      {a.panggilan} <span className="text-[14px] font-normal text-ink-3">({UMUR[a.kelompok_umur]})</span>
                    </p>
                  </li>
                ))}
          </ul>
        </section>

        {catatan.length > 0 && (
          <section className="mt-4 rounded-2xl border border-line bg-base p-5">
            <h2 className="text-[14px] text-muted">Catatan khusus</h2>
            {catatan.map((a) => (
              <p key={a.panggilan} className="mt-2 text-[16px] leading-[1.5] text-ink">
                <span className="font-semibold">{a.panggilan}:</span> {a.kebutuhan_khusus}
              </p>
            ))}
          </section>
        )}

        <a
          href={telHref(NOMOR_UTAMA.nomor)}
          className="mt-8 flex h-16 w-full items-center justify-center rounded-full bg-bahaya text-[20px] font-semibold text-white print:hidden"
        >
          Telepon {NOMOR_UTAMA.nomor}
        </a>

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-3 block min-h-12 w-full text-center text-[16px] font-semibold text-ink underline underline-offset-4 print:hidden"
        >
          Cetak atau simpan sebagai PDF
        </button>

        <p className="mt-8 text-center text-[13px] leading-[1.6] text-muted">
          Saat kejadian, ikuti arahan BPBD dan petugas di tempat. Dibuat dengan SiagaKeluarga.
        </p>
      </div>
    </div>
  );
}
