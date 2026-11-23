/**
 * Nomor layanan darurat NASIONAL. Hanya nomor yang berlaku di seluruh Indonesia yang boleh
 * tertulis tetap di kode. Nomor lokal (BPBD, puskesmas, RT) tidak boleh ditulis di sini:
 * itu berbeda tiap daerah dan harus diisi pengguna di halaman Keluarga.
 *
 * Sebelum rilis, cocokkan ulang daftar ini dengan sumber resmi (Kominfo/BNPB/Basarnas).
 */
export interface NomorDarurat {
  nama: string;
  nomor: string;
  untuk: string;
}

export const NOMOR_NASIONAL: NomorDarurat[] = [
  { nama: "Darurat umum", nomor: "112", untuk: "Semua keadaan darurat, gratis dari ponsel" },
  { nama: "Basarnas", nomor: "115", untuk: "Pencarian dan pertolongan" },
  { nama: "BNPB", nomor: "117", untuk: "Laporan dan informasi bencana" },
  { nama: "Polisi", nomor: "110", untuk: "Keamanan dan ketertiban" },
  { nama: "Pemadam kebakaran", nomor: "113", untuk: "Kebakaran dan evakuasi" },
];

/** Nomor yang selalu bisa ditampilkan paling atas. */
export const NOMOR_UTAMA = NOMOR_NASIONAL[0];
