export const FASE_LABEL = {
    sebelum: "Sebelum",
    saat: "Saat",
    sesudah: "Sesudah",
};
export const GUIDES = [
    {
        jenis: "BANJIR",
        label: "Banjir",
        color: "#1D4ED8",
        softBg: "#EFF6FF",
        image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan banjir.",
        kontak: "Jangan menunda evakuasi saat air mencapai mata kaki. Hubungi Darurat Nasional 112 atau BPBD setempat.",
        fase: {
            sebelum: {
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan gempa bumi.",
        kontak: "Jangan gunakan lift saat gempa atau sesudahnya. Hubungi Darurat Nasional 112 atau BPBD setempat.",
        fase: {
            sebelum: {
                image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah rawan tanah longsor.",
        kontak: "Jangan tinggal di bawah lereng curam saat musim hujan. Hubungi Darurat Nasional 112 atau BPBD setempat.",
        fase: {
            sebelum: {
                image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1511289081-d06dda19034d?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Panduan resmi BNPB untuk keluarga menghadapi cuaca ekstrem.",
        kontak: "Jangan berteduh di bawah pohon besar atau baliho saat angin kencang. Hubungi Darurat Nasional 112 atau BPBD setempat.",
        fase: {
            sebelum: {
                image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1511289081-d06dda19034d?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=80",
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
        image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
        deskripsi: "Panduan resmi BNPB untuk keluarga di wilayah pesisir rawan tsunami.",
        kontak: "Jangan menunggu di tepi pantai untuk melihat air laut surut tiba-tiba. Hubungi Darurat Nasional 112 atau BPBD setempat.",
        fase: {
            sebelum: {
                image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
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
                image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
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
export function findGuide(jenis) {
    return GUIDES.find((g) => g.jenis === jenis);
}
