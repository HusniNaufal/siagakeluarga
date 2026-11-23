import type { JenisBencana } from "@/lib/types";

export type Fase = "sebelum" | "saat" | "sesudah";

export interface GuidePhase {
  ringkasan: string;
  langkah: string[];
  checklist: string[];
}

export interface Guide {
  jenis: JenisBencana;
  label: string;
  color: string; // warna label jenis, sesuai FigCraft (Node 151)
  softBg: string;
  deskripsi: string;
  kontak: string;
  fase: Record<Fase, GuidePhase>;
}

export const FASE_LABEL: Record<Fase, string> = {
  sebelum: "Sebelum",
  saat: "Saat",
  sesudah: "Sesudah",
};

export const GUIDES: Guide[] = [
  {
    jenis: "BANJIR",
    label: "Banjir",
    color: "#1D4ED8",
    softBg: "#EFF6FF",
    deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan banjir.",
    kontak:
      "Jangan menunda evakuasi saat air mencapai mata kaki. Hubungi Darurat Nasional 112 atau BPBD setempat.",
    fase: {
      sebelum: {
        ringkasan: "Siapkan tas siaga dan kenali jalur evakuasi",
        langkah: [
          "Siapkan tas siaga berisi dokumen penting, obat rutin, dan senter.",
          "Kenali jalur dan titik kumpul evakuasi terdekat dari rumah.",
          "Pindahkan barang berharga dan elektronik ke tempat lebih tinggi.",
        ],
        checklist: [
          "Tas siaga 72 jam",
          "Nomor darurat BPBD",
          "Dokumen penting dalam plastik kedap air",
        ],
      },
      saat: {
        ringkasan: "Matikan listrik dan menuju titik kumpul",
        langkah: [
          "Matikan listrik dan gas utama di rumah.",
          "Dahulukan anggota keluarga lansia, balita, dan berkebutuhan khusus.",
          "Hindari berjalan atau berkendara melewati genangan yang arusnya deras.",
        ],
        checklist: [
          "Listrik dan gas dimatikan",
          "Tas siaga dibawa",
          "Semua anggota keluarga ikut bergerak",
        ],
      },
      sesudah: {
        ringkasan: "Periksa air bersih dan waspada penyakit pasca banjir",
        langkah: [
          "Jangan masuk rumah sebelum dinyatakan aman oleh petugas.",
          "Periksa instalasi listrik sebelum dinyalakan kembali.",
          "Gunakan air bersih dan waspadai penyakit pasca banjir seperti diare dan leptospirosis.",
        ],
        checklist: [
          "Instalasi listrik diperiksa",
          "Air minum dari sumber aman",
          "Laporkan kerusakan ke RT/RW",
        ],
      },
    },
  },
  {
    jenis: "GEMPA",
    label: "Gempa",
    color: "#B91C1C",
    softBg: "#FEF2F2",
    deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan gempa bumi.",
    kontak:
      "Jangan gunakan lift saat gempa atau sesudahnya. Hubungi Darurat Nasional 112 atau BPBD setempat.",
    fase: {
      sebelum: {
        ringkasan: "Amankan perabot berat ke dinding",
        langkah: [
          "Amankan lemari dan perabot berat agar tidak mudah roboh.",
          "Catat dan tempelkan nomor darurat di tempat yang mudah terlihat.",
          "Latih seluruh anggota keluarga posisi berlindung: merunduk, lindungi kepala, berpegangan.",
        ],
        checklist: [
          "Perabot berat diamankan",
          "Nomor darurat terpasang",
          "Titik berlindung dalam rumah diketahui",
        ],
      },
      saat: {
        ringkasan: "Berlindung di bawah meja kokoh",
        langkah: [
          "Merunduk dan berlindung di bawah meja yang kokoh.",
          "Jauhi jendela, kaca, dan benda yang mudah jatuh.",
          "Tetap di tempat sampai getaran benar-benar berhenti.",
        ],
        checklist: [
          "Berlindung di bawah meja",
          "Jauh dari kaca/jendela",
          "Tenang dan tidak berlari keluar saat guncangan",
        ],
      },
      sesudah: {
        ringkasan: "Periksa bangunan sebelum masuk kembali ke rumah",
        langkah: [
          "Periksa retakan dan kondisi bangunan sebelum masuk kembali.",
          "Waspada gempa susulan dan siapkan rencana evakuasi ulang.",
          "Bantu anggota keluarga yang cedera dan hubungi layanan medis bila perlu.",
        ],
        checklist: [
          "Kondisi bangunan diperiksa",
          "Waspada gempa susulan",
          "Cek kondisi seluruh anggota keluarga",
        ],
      },
    },
  },
  {
    jenis: "LONGSOR",
    label: "Longsor",
    color: "#A16207",
    softBg: "#FEFCE8",
    deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan tanah longsor.",
    kontak:
      "Jangan tinggal di bawah lereng curam saat musim hujan. Hubungi Darurat Nasional 112 atau BPBD setempat.",
    fase: {
      sebelum: {
        ringkasan: "Kenali tanda retakan tanah di sekitar rumah",
        langkah: [
          "Kenali tanda retakan tanah atau kemiringan pohon di sekitar rumah.",
          "Hindari membangun di bawah atau di atas lereng curam.",
          "Siapkan jalur evakuasi menuju tempat yang lebih datar dan stabil.",
        ],
        checklist: [
          "Tanda retakan tanah dipantau",
          "Jalur evakuasi diketahui",
          "Drainase sekitar rumah lancar",
        ],
      },
      saat: {
        ringkasan: "Jauhi lereng dan menuju tempat lebih tinggi",
        langkah: [
          "Segera menjauh dari lereng saat hujan deras berkepanjangan.",
          "Menuju tempat yang lebih tinggi dan stabil, bukan searah aliran longsoran.",
          "Bantu anggota keluarga lansia dan anak lebih dulu.",
        ],
        checklist: [
          "Menjauh dari lereng",
          "Menuju tempat lebih tinggi",
          "Anggota rentan didampingi",
        ],
      },
      sesudah: {
        ringkasan: "Jauhi area longsor susulan dan laporkan ke RT/RW",
        langkah: [
          "Jauhi area yang baru longsor karena berisiko longsor susulan.",
          "Laporkan kondisi ke RT/RW atau BPBD setempat.",
          "Tunggu informasi resmi sebelum kembali ke rumah.",
        ],
        checklist: [
          "Area longsor dihindari",
          "Kondisi dilaporkan",
          "Menunggu info resmi untuk kembali",
        ],
      },
    },
  },
  {
    jenis: "CUACA_EKSTREM",
    label: "Cuaca ekstrem",
    color: "#0F766E",
    softBg: "#F0FDFA",
    deskripsi: "Panduan resmi BNPB untuk keluarga menghadapi cuaca ekstrem.",
    kontak:
      "Jangan berteduh di bawah pohon besar atau baliho saat angin kencang. Hubungi Darurat Nasional 112 atau BPBD setempat.",
    fase: {
      sebelum: {
        ringkasan: "Pantau prakiraan BMKG tiap 3 jam",
        langkah: [
          "Pantau prakiraan cuaca BMKG secara berkala, terutama saat musim pancaroba.",
          "Periksa atap dan talang air agar tidak bocor saat hujan lebat.",
          "Siapkan penerangan cadangan untuk antisipasi listrik padam.",
        ],
        checklist: [
          "Prakiraan BMKG dipantau",
          "Atap dan talang diperiksa",
          "Penerangan cadangan siap",
        ],
      },
      saat: {
        ringkasan: "Tetap di dalam rumah dan jauhi pohon serta tiang listrik",
        langkah: [
          "Tetap di dalam rumah dan jauhi jendela saat angin kencang.",
          "Hindari berteduh di bawah pohon besar, baliho, atau tiang listrik.",
          "Cabut peralatan elektronik saat petir untuk menghindari korsleting.",
        ],
        checklist: [
          "Tetap di dalam rumah",
          "Menjauh dari pohon/tiang listrik",
          "Elektronik dicabut saat petir",
        ],
      },
      sesudah: {
        ringkasan: "Periksa kondisi rumah dan laporkan kerusakan",
        langkah: [
          "Periksa kondisi atap, pohon, dan kabel listrik di sekitar rumah.",
          "Laporkan kerusakan fasilitas umum ke RT/RW atau BPBD.",
          "Tunggu hingga kondisi benar-benar aman sebelum beraktivitas normal.",
        ],
        checklist: [
          "Kondisi rumah diperiksa",
          "Kerusakan dilaporkan",
          "Area sekitar dipastikan aman",
        ],
      },
    },
  },
  {
    jenis: "TSUNAMI",
    label: "Tsunami",
    color: "#0E7490",
    softBg: "#ECFEFF",
    deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah pesisir rawan tsunami.",
    kontak:
      "Jangan menunggu di tepi pantai untuk melihat air laut surut tiba-tiba. Hubungi Darurat Nasional 112 atau BPBD setempat.",
    fase: {
      sebelum: {
        ringkasan: "Kenali jalur evakuasi vertikal terdekat",
        langkah: [
          "Kenali jalur evakuasi vertikal (tempat tinggi) terdekat dari rumah.",
          "Pelajari tanda alam peringatan dini: gempa kuat di pesisir, air laut surut tiba-tiba.",
          "Ikuti sosialisasi dan latihan evakuasi tsunami dari BPBD setempat.",
        ],
        checklist: [
          "Jalur evakuasi vertikal diketahui",
          "Tanda alam dikenali",
          "Pernah ikut latihan evakuasi",
        ],
      },
      saat: {
        ringkasan: "Segera menuju dataran tinggi, jangan menunggu aba-aba",
        langkah: [
          "Setelah gempa kuat di pesisir, segera menuju dataran tinggi tanpa menunggu peringatan resmi.",
          "Jangan kembali ke pantai untuk melihat kondisi air laut.",
          "Bawa serta anggota keluarga yang membutuhkan bantuan evakuasi.",
        ],
        checklist: [
          "Segera menuju dataran tinggi",
          "Tidak kembali ke pantai",
          "Anggota rentan dibantu evakuasi",
        ],
      },
      sesudah: {
        ringkasan: "Tunggu info resmi sebelum kembali ke wilayah pesisir",
        langkah: [
          "Tunggu informasi resmi dari BPBD/BMKG sebelum kembali ke wilayah pesisir.",
          "Waspadai gelombang susulan yang bisa datang berjam-jam setelah yang pertama.",
          "Periksa kondisi tempat tinggal dan laporkan kerusakan ke petugas setempat.",
        ],
        checklist: [
          "Menunggu info resmi",
          "Waspada gelombang susulan",
          "Kondisi tempat tinggal diperiksa",
        ],
      },
    },
  },
];

export function findGuide(jenis: string | undefined) {
  return GUIDES.find((g) => g.jenis === jenis);
}
