// Tipe-tipe ini mengikuti bentuk respons backend persis (lihat docs/api-contract.md
// dan backend/src/controllers/*). Jangan tambah field yang tidak benar-benar
// dikirim backend.

export type Role = "USER" | "ADMIN";
export type JenisBencana = "GEMPA" | "TSUNAMI" | "BANJIR" | "LONGSOR" | "CUACA_EKSTREM";
export type TingkatRisiko = "RENDAH" | "SEDANG" | "TINGGI";
export type KelompokUmur = "BALITA" | "ANAK" | "DEWASA" | "LANSIA";

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface AdminGuide {
  id: number;
  sumber: string;
  isi: string;
}

export interface HazardZoneWithRegion extends HazardZone {
  region: Region;
}

export interface AssemblyPointWithRegion extends AssemblyPoint {
  region: Region;
}

export interface Region {
  id: number;
  kode_wilayah: string;
  kecamatan: string;
  kab_kota: string;
  hazard_zones?: HazardZone[];
  assembly_points?: AssemblyPoint[];
}

export interface HazardZone {
  id: number;
  region_id: number;
  jenis_bencana: JenisBencana;
  tingkat: TingkatRisiko;
  sumber: string;
}

export interface AssemblyPoint {
  id: number;
  region_id: number;
  nama: string;
  lat: number;
  lng: number;
  jarak_km?: number | null;
}

export interface Member {
  id: string;
  household_id: string;
  panggilan: string;
  kelompok_umur: KelompokUmur;
  kebutuhan_khusus?: string | null;
}

export interface KitItem {
  id: string;
  household_id: string;
  nama_item: string;
  status: boolean;
  kadaluarsa?: string | null;
}

export interface Drill {
  id: string;
  household_id: string;
  jadwal: string;
  skor?: number | null;
}

// Bentuk `konten` rencana AI longgar dengan sengaja — baris lama (mis. data seed)
// bisa punya bentuk berbeda dari skema Zod yang berlaku sekarang. Selalu render
// secara defensif (optional chaining / fallback), jangan asumsikan field selalu ada.
export interface EmergencyPlanKonten {
  ringkasan_risiko?: string;
  rencana_sebelum_bencana?: string[];
  langkah_saat_bencana?: string[];
  pembagian_tugas_keluarga?: {
    anggota?: string;
    peran?: string;
    fokus_pendampingan?: string;
    tugas?: string; // bentuk lama (seed) pakai `tugas` alih-alih peran/fokus_pendampingan
  }[];
  rute_dan_titik_kumpul?: string;
  kontak_darurat?: (string | { instansi?: string; nomor?: string })[];
  [key: string]: unknown;
}

export interface EmergencyPlan {
  id: string;
  household_id?: string;
  konten: EmergencyPlanKonten;
  model_ai: string;
  created_at: string;
}

export interface KesiapanTas {
  total: number;
  siap: number;
  persentase: number;
}

export interface Household {
  id: string;
  user_id: string;
  region_id: number | null;
  lat: number | null;
  lng: number | null;
  share_token: string;
  region?: Region | null;
  members?: Member[];
  kit_items?: KitItem[];
  drills?: Drill[];
  emergency_plans?: EmergencyPlan[];
  kesiapan_tas: KesiapanTas;
}

export interface BmkgForecastEntry {
  waktu_lokal: string;
  suhu_c: number;
  cuaca: string;
  cuaca_en: string;
  kelembapan: number;
  kecepatan_angin_kmj: number;
  arah_angin: string;
  curah_hujan_mm: number;
  ikon: string;
}

export type BmkgForecast =
  | {
      tersedia: true;
      sumber: "BMKG";
      lokasi: { desa: string; kecamatan: string; kotkab: string; provinsi: string } | null;
      saat_ini: BmkgForecastEntry;
      prakiraan: BmkgForecastEntry[];
      diperbarui?: string | null;
      /** Ambang buatan aplikasi, bukan peringatan dini resmi BMKG. */
      status?: {
        tingkat: "aman" | "waspada" | "bahaya";
        waktu_lokal: string | null;
        cuaca: string | null;
        curah_hujan_mm: number | null;
      };
    }
  | {
      tersedia: false;
      alasan: string;
      sumber: "BMKG";
      saat_ini: null;
      prakiraan: [];
    };

export interface RiskData {
  wilayah: { id: number; kode_wilayah: string; kecamatan: string; kab_kota: string };
  zona_risiko: HazardZone[];
  titik_kumpul: AssemblyPoint[];
  cuaca: BmkgForecast;
}

export interface QuizQuestion {
  id: number;
  pertanyaan: string;
  pilihan: [string, string, string, string];
  jawaban_benar_index: number;
  penjelasan: string;
}

export interface QuizShape {
  jenis_bencana: JenisBencana | null;
  soal: QuizQuestion[];
}

export interface AskReferensi {
  id: number;
  sumber: string;
  similarity: number;
}

export interface AskResponse {
  jawaban: string;
  referensi: AskReferensi[];
}

export interface ShareCard {
  keluarga: string;
  lokasi: { kecamatan: string; kab_kota: string } | null;
  anggota: Pick<Member, "panggilan" | "kelompok_umur" | "kebutuhan_khusus">[];
  zona_risiko: Pick<HazardZone, "jenis_bencana" | "tingkat">[];
  titik_kumpul: Pick<AssemblyPoint, "nama" | "lat" | "lng" | "jarak_km">[];
  rencana_evakuasi: { dibuat_pada: string; model_ai: string; konten: EmergencyPlanKonten } | null;
}

export interface AuthResponseRegister {
  token: string;
  user: User;
  household_id: string;
}

export interface AuthResponseLogin {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
  household:
    | null
    | {
        id: string;
        region: Region | null;
        jumlah_anggota: number;
        kesiapan_tas: KesiapanTas;
        jumlah_simulasi: number;
        share_token: string;
      };
}
