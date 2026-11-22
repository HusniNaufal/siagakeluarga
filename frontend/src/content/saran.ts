import type { JenisBencana } from "@/lib/types";

export const SARAN_TINDAKAN: Record<JenisBencana, { judul: string; teks: string }> = {
  BANJIR: { judul: "Siapkan tas siaga", teks: "Pastikan senter, obat rutin, dan dokumen penting sudah ada di tas siaga." },
  GEMPA: { judul: "Kenali titik berlindung", teks: "Catat posisi meja kokoh di tiap ruangan untuk berlindung saat gempa." },
  LONGSOR: { judul: "Pantau tanda retakan tanah", teks: "Periksa kemiringan tanah dan pohon di sekitar rumah secara berkala." },
  CUACA_EKSTREM: { judul: "Pantau info resmi BPBD", teks: "Aktifkan notifikasi cuaca ekstrem dan ikuti arahan petugas setempat." },
  TSUNAMI: { judul: "Kenali jalur ke titik kumpul", teks: "Hafalkan rute tercepat menuju dataran tinggi dari rumahmu." },
};

export const DEFAULT_SARAN = { judul: "Kenali jalur ke titik kumpul", teks: "Pastikan seluruh keluarga tahu rute ke titik kumpul terdekat." };
