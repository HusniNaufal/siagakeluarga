// Konten Mode Darurat.
//
// Konten di sini SENGAJA disimpan statis di frontend, bukan diambil dari API.
// Alasannya: layar "Bencana Sekarang" harus tetap berguna ketika jaringan mati
// (gempa memotong sinyal, kuota habis, server tidak terjangkau). Semua langkah
// "saat ini" adalah pengetahuan dasar BNPB/BMKG, bukan data milik pengguna.
//
// Rujukan gaya: design/siagakeluarga.fig — palet 5 warna bencana.

import type { JenisBencana } from "@/lib/types";

export interface LangkahDarurat {
  /** Judul singkat, tampil besar di layar darurat. */
  judul: string;
  /** Penjelasan satu-dua kalimat, tenang dan langsung. */
  detail: string;
}

export interface KontenDarurat {
  jenis: JenisBencana;
  /** Nama tombol, mis. "Gempa". */
  label: string;
  /** Nama panjang untuk judul layar. */
  judul: string;
  /** Satu kalimat: apa yang harus dilakukan pertama kali. */
  ringkas: string;
  /** Kunci warna Tailwind dari tema (lihat index.css). */
  warna: "gempa" | "tsunami" | "banjir" | "longsor" | "cuaca";
  /** Nama ikon lucide. */
  ikon: "waves" | "cloud-rain" | "mountain" | "sun" | "activity" | "alert-triangle";
  /** Langkah "saat ini", diurutkan dari yang paling kritis. */
  langkah: LangkahDarurat[];
  /** Hal yang harus dihindari. */
  hindari: string[];
}

export const KONTEN_DARURAT: Record<JenisBencana, KontenDarurat> = {
  GEMPA: {
    jenis: "GEMPA",
    label: "Gempa",
    judul: "Gempa bumi",
    ringkas: "Lindungi diri dulu, baru bantu orang lain.",
    warna: "gempa",
    ikon: "activity",
    langkah: [
      {
        judul: "Rebah, berlindung, pegang",
        detail:
          "Rebah ke bawah, berlindung di bawah meja yang kukuh, lalu pegang kakinya sampai guncangan berhenti.",
      },
      {
        judul: "Jangan lari ke luar",
        detail:
          "Pintu, jendela, dan barang yang jatuh lebih berbahaya daripada guncangan itu sendiri.",
      },
      {
        judul: "Hitung sampai 30 detik",
        detail:
          "Guncangan biasanya berhenti dalam 30 detik. Hitung sambil tetap terlindung, jangan bergerak dulu.",
      },
      {
        judul: "Keluar pelan-pelan",
        detail:
          "Setelah berhenti, pakai sendal, matikan kompor dan listrik, lalu keluar pelan-pelan sambil melindungi kepala.",
      },
      {
        judul: "Cek anggota keluarga",
        detail:
          "Hubungi satu per satu. Bayi, orang lanjut usia, dan penyandang disabilitas didatangkan paling awal.",
      },
      {
        judul: "Di daerah pesisir, naik ke daratan tinggi",
        detail:
          "Gempa besar bisa diikuti tsunami. Jangan menunggu sirene, langsung menuju titik kumpul.",
      },
    ],
    hindari: [
      "Jangan naik lift",
      "Jangan menyalakan kompor atau listrik",
      "Jangan berdiri di dekat jendela atau rak tinggi",
      "Jangan membakar sampah di luar rumah",
    ],
  },

  TSUNAMI: {
    jenis: "TSUNAMI",
    label: "Tsunami",
    judul: "Tsunami",
    ringkas: "Jangan menunggu sirene, tsunami bisa datang dalam hitungan menit.",
    warna: "tsunami",
    ikon: "waves",
    langkah: [
      {
        judul: "Rasakan guncangan atau lihat air surut",
        detail:
          "Guncangan kuat di pesisir berarti tsunami mungkin datang. Air yang tiba-tiba surut adalah tanda bahaya, bukan tanda aman.",
      },
      {
        judul: "Lari ke daratan tinggi",
        detail:
          "Tujuan pertama adalah tempat yang lebih tinggi, bukan melihat ombak. Minimal 10 sampai 15 meter di atas permukaan laut atau 30 meter dari garis pantai.",
      },
      {
        judul: "Jauhi sungai dan saluran air",
        detail:
          "Banjir tsunami bisa menyapu di sepanjang sungai dan parit besar, dan bisa lebih berbahaya dari ombaknya sendiri.",
      },
      {
        judul: "Ikuti jalur ke titik kumpul",
        detail:
          "Titik kumpul terdekat sudah tercatat di aplikasi ini. Ikuti penanda arah dan arahan petugas.",
      },
      {
        judul: "Pakai kendaraan yang tersedia",
        detail:
          "Motor, mobil, sepeda, atau berjalan kaki. Jangan menunggu kendaraan yang mungkin tidak datang.",
      },
      {
        judul: "Hitung anggota keluarga setelah aman",
        detail:
          "Jam-jam pertama adalah waktu paling berbahaya. Setelah tiba di tempat aman, hitung anggota keluarga satu per satu.",
      },
    ],
    hindari: [
      "Jangan menunggu sirene tsunami",
      "Jangan turun ke pantai untuk melihat ombak",
      "Jangan berenang menyeberangi arus",
    ],
  },

  BANJIR: {
    jenis: "BANJIR",
    label: "Banjir",
    judul: "Banjir",
    ringkas: "Naikkan barang, siapkan air bersih, jangan pernah menyeberahi air banjir.",
    warna: "banjir",
    ikon: "cloud-rain",
    langkah: [
      {
        judul: "Naikkan barang ke tempat tinggi",
        detail:
          "Dokumen, obat, laptop, dan foto keluarga naikkan ke lantai dua atau meja yang lebih tinggi.",
      },
      {
        judul: "Cek kondisi anggota keluarga",
        detail:
          "Pastikan semua orang sudah siap. Yang sakit, bayi, dan orang tua diperiksa lebih dulu.",
      },
      {
        judul: "Siapkan air bersih dan obat",
        detail:
          "Air bersih bisa langka. Sediakan minimal satu liter per orang per hari, plus obat rutin yang tidak boleh terlewat.",
      },
      {
        judul: "Matikan listrik bila air sudah masuk rumah",
        detail:
          "Jangan sentuh perangkat listrik yang basah. Putus dari MCB hanya bila aman untuk dijangkau.",
      },
      {
        judul: "Periksa lingkungan sekitar",
        detail:
          "Cek apakah ada kabel listrik jatuh di luar rumah. Bila ada, laporkan ke PLN atau petugas setempat.",
      },
      {
        judul: "Siapkan tas siaga lengkap",
        detail:
          "Obat, senter, power bank, uang tunai, fotokopi dokumen, dan air minum wajib ada di dalam tas.",
      },
    ],
    hindari: [
      "Jangan menyentuh air banjir yang dialiri listrik",
      "Jangan memancing atau menyeberahi genangan",
      "Jangan meninggalkan anak atau orang tua saat pindah",
    ],
  },

  LONGSOR: {
    jenis: "LONGSOR",
    label: "Longsor",
    judul: "Longsor",
    ringkas: "Jauhi lereng dan pohon, datangi rumah yang kokoh.",
    warna: "longsor",
    ikon: "mountain",
    langkah: [
      {
        judul: "Keluar dari rumah ke arah berlawanan",
        detail:
          "Longsor datang dari arah lereng. Keluar ke arah yang lebih tinggi dan berlawanan dengan arah aliran tanah.",
      },
      {
        judul: "Jauhi lereng dan pohon besar",
        detail:
          "Longsor bisa membawa batu besar dan pohon tumbang. Jangan berdiri di bawah tebing atau dasar lereng.",
      },
      {
        judul: "Kenali tanda-tanda awal",
        detail:
          "Retakan tanah, air keruh keluar dari dinding, dan bunyi gemuruh adalah tanda longsor datang.",
      },
      {
        judul: "Berhenti menunggu, segera pindah",
        detail:
          "Banjir dan tanah lunak bisa terjadi mendadak. Segera ke tempat tinggi dan jangan menunda.",
      },
      {
        judul: "Cek orang yang terjebak",
        detail:
          "Jangan masuk area aliran tanpa alasan kuat. Hubungi tim rescuers jika ada yang tertimpa.",
      },
      {
        judul: "Beri tanda lokasi",
        detail:
          "Bila rumah tertimpa, ketuk pipa atau dinding agar tim pencarian dapat menemukan lokasi.",
      },
    ],
    hindari: [
      "Jangan tinggalkan rumah saat tanah mulai bergerak",
      "Jangan naik ke lereng yang licin",
      "Jangan memarkir kendaraan di bawah tebing",
    ],
  },

  CUACA_EKSTREM: {
    jenis: "CUACA_EKSTREM",
    label: "Cuaca ekstrem",
    judul: "Cuaca ekstrem",
    ringkas: "Tahu lateinit, amankan dokumen, siapkan tenaga cadangan.",
    warna: "cuaca",
    ikon: "sun",
    langkah: [
      {
        judul: "Pindah ke ruangan paling aman",
        detail:
          "Untuk putaran panas: lantai bawah atau ruangan paling sejuk. Untuk angin dan badai: ruangan dalam tanpa jendela.",
      },
      {
        judul: "Jaga suhu tubuh tetap",
        detail:
          "Minum air secara rutin, pakai pakaian tipis dan berwarna terang, serta basahi tubuh bila panas memuncak.",
      },
      {
        judul: "Siapkan tenaga cadangan",
        detail:
          "Sediakan power bank, senter, radio, dan makanan siap saji. Listrik dan internet sering padam saat cuaca ekstrem.",
      },
      {
        judul: "Amankan barang berharga",
        detail:
          "Dokumen, obat, dan perangkat elektronik diberi jarak aman dari jendela dan pintu.",
      },
      {
        judul: "Pantau peringatan resmi",
        detail:
          "Ikuti akun resmi BMKG dan peringatan resmi BMKG. Jangan ikut tersebar rumors yang sumbernya tidak jelas.",
      },
      {
        judul: "Siapkan untuk pemadaman listrik",
        detail:
          "Matikan listrik dan charge daya. Untuk putaran panas, siapkan air minum secukupnya.",
      },
    ],
    hindari: [
      "Jangan keluar saat badai sudah berkecamuk",
      "Jangan berdiri di bawah pohon atau papan reklame saat angin kuat",
      "Jangan menyentuh kabel listrik yang tumbang",
    ],
  },
};

export const DAFTAR_JENIS_BENCANA: JenisBencana[] = [
  "GEMPA",
  "TSUNAMI",
  "BANJIR",
  "LONGSOR",
  "CUACA_EKSTREM",
];

/** Nomor darurat nasional. 112 adalah nomor tunggal untuk semua jenis darurat. */
export const NOMOR_DARURAT = {
  utama: "112",
  utamaLabel: "112 - Nomor Tunggal Darurat",
  ambulance: "119",
  ambulanceLabel: "119 - Ambulans dan Pemadam",
  listrik: "123",
  listrikLabel: "123 - PLN",
} as const;
