import { useEffect, useMemo, useRef, useState } from "react";
import { Check, LocateFixed, Maximize2, Minimize2, Pencil, Search, Trash2, X } from "lucide-react";
import {
  useAddMember,
  useDeleteMember,
  useHousehold,
  useUpdateHousehold,
  useUpdateMember,
} from "@/hooks/useHousehold";
import type { KelompokUmur, Member } from "@/lib/types";
import { telHref, useKontakKeluarga } from "@/hooks/useKontak";
import { useCuaca } from "@/hooks/useCuaca";
import { useLokasi } from "@/hooks/useLokasi";
import { useCariLokasi } from "@/hooks/useCariLokasi";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { AppHero } from "@/components/app/AppHero";
import { PetaLeaflet } from "@/components/map/PetaLeaflet";
import { cn } from "@/lib/utils";

const UMUR: { value: KelompokUmur; label: string; hint: string }[] = [
  { value: "DEWASA", label: "Dewasa", hint: "18 tahun ke atas" },
  { value: "LANSIA", label: "Lansia", hint: "60 tahun ke atas" },
  { value: "ANAK", label: "Anak", hint: "6 sampai 17 tahun" },
  { value: "BALITA", label: "Balita", hint: "di bawah 6 tahun" },
];
const UMUR_LABEL: Record<KelompokUmur, string> = {
  BALITA: "Balita",
  ANAK: "Anak",
  DEWASA: "Dewasa",
  LANSIA: "Lansia",
};

const KEBUTUHAN_CEPAT = [
  "Ibu hamil",
  "Penyandang disabilitas",
  "Obat rutin",
  "Butuh bantuan berjalan",
  "Alergi",
];

const TOMBOL_UTAMA =
  "inline-flex items-center justify-center rounded-full bg-accent-dark font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40";
const TOMBOL_SEKUNDER =
  "inline-flex items-center justify-center rounded-full border border-line bg-base font-semibold text-ink transition-colors hover:bg-tint disabled:opacity-40";
const INPUT =
  "h-12 w-full rounded-2xl border border-line bg-base px-4 text-[16px] text-ink outline-none transition-colors focus:border-ink";

function inisial(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Pisahkan string kebutuhan_khusus menjadi pilihan cepat dan teks bebas. */
function uraiKebutuhan(s: string | null | undefined) {
  const bagian = (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return {
    chips: bagian.filter((b) => KEBUTUHAN_CEPAT.includes(b)),
    bebas: bagian.filter((b) => !KEBUTUHAN_CEPAT.includes(b)).join(", "),
  };
}

function Dialog({
  judul,
  onTutup,
  children,
}: {
  judul: string;
  onTutup: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onTutup();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTutup]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-night/60 p-4"
    >
      <div className="max-h-full w-full max-w-[520px] overflow-y-auto rounded-2xl border border-line bg-base p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="judul-dialog" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            {judul}
          </h2>
          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup"
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Keluarga() {
  const { data: household, isLoading } = useHousehold();
  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const updateHousehold = useUpdateHousehold();

  // Anggota: formulir dipakai untuk tambah (editId null) dan ubah.
  const [formAnggota, setFormAnggota] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [panggilan, setPanggilan] = useState("");
  const [kelompokUmur, setKelompokUmur] = useState<KelompokUmur>("DEWASA");
  const [chips, setChips] = useState<string[]>([]);
  const [bebas, setBebas] = useState("");
  const [galatAnggota, setGalatAnggota] = useState<string | null>(null);

  // Kontak darurat (tersimpan di perangkat ini).
  const { kontak: contacts, tambah: tambahKontak, hapus: hapusKontak } = useKontakKeluarga();
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactNama, setContactNama] = useState("");
  const [contactNomor, setContactNomor] = useState("");

  // Lokasi rumah.
  const lokasi = useLokasi();
  const cari = useCariLokasi();
  const [q, setQ] = useState("");
  const [petaBesar, setPetaBesar] = useState(false);
  const [modalPetaFull, setModalPetaFull] = useState(false);
  const menungguGps = useRef(false);
  const adaTitik = household?.lat != null && household?.lng != null;
  const { data: cuaca } = useCuaca(household?.lat ?? 0, household?.lng ?? 0, adaTitik);
  const namaLokasi = cuaca
    ? [cuaca.wilayah.desa, cuaca.wilayah.kecamatan, cuaca.wilayah.kotkab].filter(Boolean).join(", ")
    : null;

  const titikPeta = useMemo(
    () =>
      household?.lat != null && household?.lng != null
        ? [{ lat: household.lat, lng: household.lng, label: "Rumahmu", jenis: "rumah" as const }]
        : [],
    [household?.lat, household?.lng],
  );

  const { mutate: simpanKoordinat } = updateHousehold;
  useEffect(() => {
    if (menungguGps.current && lokasi.status === "gps") {
      menungguGps.current = false;
      simpanKoordinat({ lat: lokasi.lat, lng: lokasi.lng });
    } else if (menungguGps.current && (lokasi.status === "ditolak" || lokasi.status === "gagal" || lokasi.status === "tidak-didukung")) {
      menungguGps.current = false;
    }
  }, [lokasi.status, lokasi.lat, lokasi.lng, simpanKoordinat]);

  if (isLoading || !household) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface" />;
  }

  const anggota = household.members ?? [];
  const adaAnggota = anggota.length > 0;
  const jumlahButuhKhusus = anggota.filter((m) => m.kebutuhan_khusus).length;
  const profilLengkap = adaAnggota && Boolean(household.region_id);
  const sedangSimpanAnggota = addMember.isPending || updateMember.isPending;

  function bukaTambah() {
    setEditId(null);
    setPanggilan("");
    setKelompokUmur("DEWASA");
    setChips([]);
    setBebas("");
    setGalatAnggota(null);
    setFormAnggota(true);
  }

  function bukaUbah(m: Member) {
    const u = uraiKebutuhan(m.kebutuhan_khusus);
    setEditId(m.id);
    setPanggilan(m.panggilan);
    setKelompokUmur(m.kelompok_umur);
    setChips(u.chips);
    setBebas(u.bebas);
    setGalatAnggota(null);
    setFormAnggota(true);
  }

  function toggleChip(k: string) {
    setChips((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  async function onSimpanAnggota(e: React.FormEvent) {
    e.preventDefault();
    if (!panggilan.trim()) return;
    const gabungan = [...chips, ...bebas.split(",").map((x) => x.trim()).filter(Boolean)].join(", ");
    const body = {
      panggilan: panggilan.trim(),
      kelompok_umur: kelompokUmur,
      kebutuhan_khusus: gabungan || null,
    };
    setGalatAnggota(null);
    try {
      if (editId) await updateMember.mutateAsync({ id: editId, ...body });
      else await addMember.mutateAsync(body);
      setFormAnggota(false);
    } catch (err) {
      setGalatAnggota(err instanceof Error && err.message ? err.message : "Belum bisa menyimpan. Coba lagi.");
    }
  }

  function onAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!contactNama.trim() || !contactNomor.trim()) return;
    tambahKontak(contactNama, contactNomor);
    setContactNama("");
    setContactNomor("");
    setShowAddContact(false);
  }

  function simpanLokasi(lat: number, lng: number) {
    updateHousehold.mutate({ lat, lng });
  }

  function pakaiLokasiku() {
    menungguGps.current = true;
    lokasi.minta();
  }

  return (
    <div className="mx-auto max-w-[960px] space-y-8">
      <AppHero
        variasi="rumah"
        aksi={
          <button type="button" onClick={bukaTambah} className={cn(TOMBOL_UTAMA, "h-11 px-6 text-[15px]")}>
            Tambah anggota
          </button>
        }
      >
        <h1>Profil keluarga</h1>
        <p className="mt-1 max-w-[56ch] text-[16px] text-ink-3">
          Data anggota, kebutuhan khusus, dan kontak darurat yang dipakai untuk menyusun rencana keluargamu.
        </p>
      </AppHero>

      {/* Ringkasan */}
      <section aria-label="Ringkasan profil" className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-ink p-5 text-white">
          <p className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em]">
            {anggota.length}
          </p>
          <p className="mt-2 text-[15px] text-white/75">Anggota</p>
        </div>
        <div className="rounded-2xl bg-accent-dark p-5 text-white">
          <p className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em]">
            {jumlahButuhKhusus}
          </p>
          <p className="mt-2 text-[15px] text-white/75">Punya kebutuhan khusus</p>
        </div>
        <div className="rounded-2xl border border-line bg-base p-5">
          <p className="font-display text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink">
            {profilLengkap ? "Lengkap" : "Belum lengkap"}
          </p>
          <p className="mt-2 text-[15px] text-ink-3">Status profil</p>
        </div>
      </section>

      {/* Anggota */}
      <section aria-labelledby="judul-anggota">
        <h2 id="judul-anggota" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
          Anggota keluarga
        </h2>
        {adaAnggota ? (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {anggota.map((m) => (
              <li key={m.id} className="flex items-start gap-4 rounded-2xl border border-line bg-base p-5">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-tint text-[16px] font-semibold text-ink"
                >
                  {inisial(m.panggilan)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[17px] font-semibold text-ink">{m.panggilan}</p>
                  <p className="text-[15px] text-ink-3">{UMUR_LABEL[m.kelompok_umur]}</p>
                  <p className="mt-2 text-[15px] leading-[1.5] text-ink-3">
                    {m.kebutuhan_khusus ? `Kebutuhan khusus: ${m.kebutuhan_khusus}` : "Tidak ada kebutuhan khusus"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => bukaUbah(m)}
                    aria-label={`Ubah ${m.panggilan}`}
                    className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-ink"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Hapus ${m.panggilan} dari keluarga?`)) deleteMember.mutate(m.id);
                    }}
                    aria-label={`Hapus ${m.panggilan}`}
                    className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-bahaya"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-2xl border border-line bg-base p-8 text-center">
            <EmptyIllustration />
            <p className="text-[20px] font-semibold tracking-[-0.015em] text-ink">Belum ada anggota keluarga</p>
            <p className="mx-auto mt-2 max-w-[44ch] text-[16px] leading-[1.6] text-ink-3">
              Tambahkan semua orang yang tinggal di rumah. Usia dan kebutuhan khusus menentukan isi tas siaga dan
              tugas masing-masing.
            </p>
            <button type="button" onClick={bukaTambah} className={cn(TOMBOL_UTAMA, "mt-5 h-12 px-6 text-[16px]")}>
              Tambah anggota pertama
            </button>
          </div>
        )}
      </section>

      {/* Lokasi rumah */}
      <section aria-labelledby="judul-lokasi" className="rounded-3xl border border-line/80 bg-base/95 p-6 shadow-sm backdrop-blur-sm">
        <div>
          <h2 id="judul-lokasi" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            Lokasi rumah
          </h2>
          <p className="mt-1 text-[15px] leading-[1.6] text-ink-3">
            Ketuk peta untuk menandai rumahmu. Lokasi dipakai untuk titik kumpul terdekat dan prakiraan cuaca BMKG.
          </p>
        </div>

        <div className="mt-4" role="status" aria-live="polite">
          {adaTitik ? (
            <p className="text-[16px] font-semibold text-ink">
              {namaLokasi ?? "Membaca nama wilayah…"}
            </p>
          ) : (
            <p className="text-[16px] text-ink-3">Lokasi rumah belum ditandai.</p>
          )}
          {household.region && (
            <p className="mt-1 text-[15px] text-ink-3">
              Data titik kumpul: Kec. {household.region.kecamatan}, {household.region.kab_kota}
              {household.region.hazard_zones?.length
                ? `. Rawan ${household.region.hazard_zones
                    .map((z) => z.jenis_bencana.toLowerCase().replace("_", " "))
                    .join(", ")}.`
                : "."}
            </p>
          )}
          {updateHousehold.isPending && <p className="mt-1 text-[15px] text-muted">Menyimpan lokasi…</p>}
          {updateHousehold.isSuccess && !updateHousehold.isPending && (
            <p className="mt-1 flex items-center gap-1.5 text-[15px] text-aman">
              <Check className="size-4" aria-hidden="true" />
              Lokasi rumah tersimpan.
            </p>
          )}
          {updateHousehold.isError && (
            <p className="mt-1 text-[15px] text-bahaya">Lokasi belum bisa disimpan. Coba lagi.</p>
          )}
        </div>

        <div className="relative mt-4">
          <PetaLeaflet
            titik={titikPeta}
            onPilih={simpanLokasi}
            tinggi={petaBesar ? 580 : 380}
            className="transition-all duration-300"
          />

          {/* Tombol ukuran di sudut kanan atas peta */}
          <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPetaBesar((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line/80 bg-base/90 px-3 text-[12px] font-semibold text-ink shadow-sm backdrop-blur-md transition-colors hover:bg-base hover:shadow cursor-pointer"
              title={petaBesar ? "Kecilkan tinggi peta" : "Perbesar tinggi peta"}
            >
              {petaBesar ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              <span>{petaBesar ? "Kecilkan" : "Perbesar"}</span>
            </button>
            <button
              type="button"
              onClick={() => setModalPetaFull(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink/90 px-3 text-[12px] font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-ink hover:shadow cursor-pointer"
              title="Buka peta layar penuh"
            >
              <Maximize2 className="size-3.5" />
              <span>Layar penuh</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={pakaiLokasiku}
            disabled={lokasi.status === "meminta"}
            className={cn(TOMBOL_SEKUNDER, "h-12 gap-2 px-5 text-[16px]")}
          >
            <LocateFixed className="size-5" aria-hidden="true" />
            {lokasi.status === "meminta" ? "Menunggu izin lokasi…" : "Pakai lokasiku"}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim().length >= 3) cari.mutate(q.trim());
            }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-base p-1 pl-4 focus-within:border-ink"
          >
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="lokasi-q" className="sr-only">
              Cari kelurahan atau kota
            </label>
            <input
              id="lokasi-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari kelurahan atau kota"
              className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={q.trim().length < 3 || cari.isPending}
              className={cn(TOMBOL_UTAMA, "h-10 px-5 text-[15px]")}
            >
              {cari.isPending ? "Mencari…" : "Cari"}
            </button>
          </form>
        </div>

        <div role="status" aria-live="polite">
          {(lokasi.status === "ditolak" || lokasi.status === "gagal" || lokasi.status === "tidak-didukung") && (
            <p className="mt-3 text-[15px] text-ink-3">
              Lokasimu belum bisa dibaca. Cari nama tempatnya, atau ketuk langsung di peta.
            </p>
          )}
          {cari.isError && (
            <p className="mt-3 text-[15px] text-bahaya">
              {cari.error instanceof Error ? cari.error.message : "Pencarian belum bisa dilakukan."}
            </p>
          )}
          {cari.isSuccess && (cari.data ?? []).length === 0 && (
            <p className="mt-3 text-[15px] text-ink-3">Tidak ditemukan. Coba nama kelurahan atau kecamatan.</p>
          )}
          {(cari.data ?? []).length > 0 && (
            <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-base">
              {(cari.data ?? []).map((h) => (
                <li key={`${h.lat},${h.lng}`}>
                  <button
                    type="button"
                    onClick={() => {
                      simpanLokasi(h.lat, h.lng);
                      cari.reset();
                      setQ("");
                    }}
                    className="block min-h-12 w-full px-4 py-3 text-left text-[16px] text-ink hover:bg-tint"
                  >
                    {h.nama}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Kontak darurat */}
      <section aria-labelledby="judul-kontak" className="rounded-2xl border border-line bg-base p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="judul-kontak" className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
            Kontak darurat keluarga
          </h2>
          <button
            type="button"
            onClick={() => setShowAddContact(true)}
            className={cn(TOMBOL_SEKUNDER, "h-10 px-5 text-[15px]")}
          >
            Tambah kontak
          </button>
        </div>
        <p className="mt-2 text-[15px] leading-[1.6] text-ink-3">
          Kontak ini hanya tersimpan di perangkat ini. Tidak ikut ke perangkat lain dan tidak muncul di tautan yang
          kamu bagikan. Nomor 112 selalu tersedia di halaman rencana.
        </p>
        {contacts.length === 0 ? (
          <p className="mt-4 text-[16px] text-ink-3">
            Belum ada kontak. Tambahkan RT, puskesmas, atau BPBD setempat.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-ink">{c.nama}</p>
                  <a
                    href={telHref(c.nomor)}
                    className="inline-flex min-h-11 items-center text-[15px] text-accent-dark hover:underline"
                  >
                    {c.nomor}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => hapusKontak(c.id)}
                  aria-label={`Hapus kontak ${c.nama}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-tint hover:text-bahaya"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Formulir anggota */}
      {formAnggota && (
        <Dialog judul={editId ? "Ubah anggota keluarga" : "Tambah anggota keluarga"} onTutup={() => setFormAnggota(false)}>
          <form onSubmit={onSimpanAnggota} className="mt-5 space-y-5">
            <div>
              <label htmlFor="angg-nama" className="block text-[15px] font-medium text-ink">
                Nama panggilan
              </label>
              <input
                id="angg-nama"
                value={panggilan}
                onChange={(e) => setPanggilan(e.target.value)}
                placeholder="Mis. Ibu, Bapak, atau nama anak"
                autoComplete="off"
                required
                className={cn(INPUT, "mt-2")}
              />
            </div>

            <fieldset>
              <legend className="text-[15px] font-medium text-ink">Kelompok umur</legend>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {UMUR.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setKelompokUmur(u.value)}
                    aria-pressed={kelompokUmur === u.value}
                    className={cn(
                      "min-h-12 rounded-2xl border px-4 py-2.5 text-left transition-colors",
                      kelompokUmur === u.value
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-base text-ink hover:border-ink/40",
                    )}
                  >
                    <span className="block text-[16px] font-semibold">{u.label}</span>
                    <span className={cn("block text-[13px]", kelompokUmur === u.value ? "text-white/70" : "text-muted")}>
                      {u.hint}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-[15px] font-medium text-ink">
                Kebutuhan khusus <span className="font-normal text-muted">(boleh dikosongkan)</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {KEBUTUHAN_CEPAT.map((k) => {
                  const on = chips.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleChip(k)}
                      aria-pressed={on}
                      className={cn(
                        "inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-[15px] transition-colors",
                        on
                          ? "border-accent-dark bg-accent-soft text-accent-hover"
                          : "border-line bg-base text-ink-3 hover:border-ink/40",
                      )}
                    >
                      {on && <Check className="size-4" aria-hidden="true" />}
                      {k}
                    </button>
                  );
                })}
              </div>
              <label htmlFor="angg-bebas" className="mt-4 block text-[15px] font-medium text-ink">
                Catatan lain
              </label>
              <input
                id="angg-bebas"
                value={bebas}
                onChange={(e) => setBebas(e.target.value)}
                placeholder="Mis. obat darah tinggi setiap pagi"
                className={cn(INPUT, "mt-2")}
              />
            </fieldset>

            <div role="alert">
              {galatAnggota && <p className="text-[15px] text-bahaya">{galatAnggota}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormAnggota(false)}
                className={cn(TOMBOL_SEKUNDER, "h-12 px-6 text-[16px]")}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!panggilan.trim() || sedangSimpanAnggota}
                className={cn(TOMBOL_UTAMA, "h-12 px-6 text-[16px]")}
              >
                {sedangSimpanAnggota ? "Menyimpan…" : editId ? "Simpan perubahan" : "Simpan anggota"}
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Formulir kontak */}
      {showAddContact && (
        <Dialog judul="Tambah kontak darurat" onTutup={() => setShowAddContact(false)}>
          <form onSubmit={onAddContact} className="mt-5 space-y-5">
            <div>
              <label htmlFor="kontak-nama" className="block text-[15px] font-medium text-ink">
                Nama kontak atau instansi
              </label>
              <input
                id="kontak-nama"
                value={contactNama}
                onChange={(e) => setContactNama(e.target.value)}
                placeholder="Mis. Pak RT, puskesmas, BPBD setempat"
                required
                className={cn(INPUT, "mt-2")}
              />
            </div>
            <div>
              <label htmlFor="kontak-nomor" className="block text-[15px] font-medium text-ink">
                Nomor telepon
              </label>
              <input
                id="kontak-nomor"
                type="tel"
                value={contactNomor}
                onChange={(e) => setContactNomor(e.target.value)}
                placeholder="Mis. 0812-3456-7890"
                required
                className={cn(INPUT, "mt-2")}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddContact(false)}
                className={cn(TOMBOL_SEKUNDER, "h-12 px-6 text-[16px]")}
              >
                Batal
              </button>
              <button type="submit" className={cn(TOMBOL_UTAMA, "h-12 px-6 text-[16px]")}>
                Simpan kontak
              </button>
            </div>
          </form>
        </Dialog>
      )}
      {/* Modal Peta Layar Penuh */}
      {modalPetaFull && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-3 backdrop-blur-sm animate-in fade-in md:p-6">
          <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-line bg-base shadow-2xl">
            <div className="flex items-center justify-between border-b border-line bg-base px-6 py-4">
              <div>
                <h3 className="text-[18px] font-semibold text-ink">Peta Lokasi Rumah (Layar Penuh)</h3>
                <p className="text-[13px] text-ink-3">
                  Ketuk langsung pada peta untuk menandai atau memindahkan titik lokasi rumahmu.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalPetaFull(false)}
                className="flex size-10 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-tint hover:text-ink cursor-pointer"
                aria-label="Tutup peta layar penuh"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <PetaLeaflet
                titik={titikPeta}
                onPilih={simpanLokasi}
                tinggi="100%"
                className="size-full rounded-none border-none"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-line bg-base/95 p-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={pakaiLokasiku}
                disabled={lokasi.status === "meminta"}
                className={cn(TOMBOL_SEKUNDER, "h-11 gap-2 px-5 text-[15px]")}
              >
                <LocateFixed className="size-4" aria-hidden="true" />
                {lokasi.status === "meminta" ? "Menunggu izin lokasi…" : "Pakai lokasiku"}
              </button>

              {namaLokasi && (
                <p className="truncate text-[14px] font-medium text-ink sm:max-w-md">
                  📍 {namaLokasi}
                </p>
              )}

              <button
                type="button"
                onClick={() => setModalPetaFull(false)}
                className={cn(TOMBOL_UTAMA, "h-11 px-6 text-[15px] sm:ml-auto cursor-pointer")}
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
