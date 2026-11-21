import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/prisma.js';

async function main() {
  console.log('🌱 Memulai proses seeding SiagaKeluarga (Kota Bengkulu)...');

  // Bersihkan data lama dengan urutan relasi yang aman (agar idempotent & aman dijalankan berulang kali)
  await prisma.drill.deleteMany();
  await prisma.kitItem.deleteMany();
  await prisma.emergencyPlan.deleteMany();
  await prisma.member.deleteMany();
  await prisma.household.deleteMany();
  await prisma.hazardZone.deleteMany();
  await prisma.assemblyPoint.deleteMany();
  await prisma.region.deleteMany();
  await prisma.guideChunk.deleteMany();

  // 1. Seed Wilayah Percontohan Kota Bengkulu (Region, HazardZone, AssemblyPoint)
  const regionTelukSegara = await prisma.region.create({
    data: {
      kode_wilayah: '17.71.04.1005', // Kel. Malabero, Kec. Teluk Segara, Kota Bengkulu
      kecamatan: 'Teluk Segara',
      kab_kota: 'Kota Bengkulu',
      hazard_zones: {
        create: [
          {
            jenis_bencana: 'GEMPA',
            tingkat: 'TINGGI',
            sumber: 'BNPB Inarisk & Peta Zona Megathrust Enggano-Bengkulu',
          },
          {
            jenis_bencana: 'TSUNAMI',
            tingkat: 'TINGGI',
            sumber: 'BMKG Peta Inundasi Tsunami Pesisir Pantai Malabero - Tapak Paderi',
          },
          {
            jenis_bencana: 'CUACA_EKSTREM',
            tingkat: 'SEDANG',
            sumber: 'BMKG Stasiun Meteorologi Fatmawati Soekarno Bengkulu',
          },
        ],
      },
      assembly_points: {
        create: [
          {
            nama: 'Lapangan Merdeka Kota Bengkulu (View Tower)',
            lat: -3.7888,
            lng: 102.2512,
          },
          {
            nama: 'Benteng Marlborough (Titik Evakuasi Sementara Bukit Tinggi)',
            lat: -3.7872,
            lng: 102.2484,
          },
        ],
      },
    },
  });

  const regionRatuSamban = await prisma.region.create({
    data: {
      kode_wilayah: '17.71.06.1001', // Kel. Penurunan, Kec. Ratu Samban, Kota Bengkulu
      kecamatan: 'Ratu Samban',
      kab_kota: 'Kota Bengkulu',
      hazard_zones: {
        create: [
          {
            jenis_bencana: 'GEMPA',
            tingkat: 'TINGGI',
            sumber: 'BNPB Inarisk & Zona Subduksi Sunda Megathrust',
          },
          {
            jenis_bencana: 'TSUNAMI',
            tingkat: 'TINGGI',
            sumber: 'BMKG & BPBD Kota Bengkulu (Kawasan Pantai Panjang)',
          },
          {
            jenis_bencana: 'BANJIR',
            tingkat: 'SEDANG',
            sumber: 'BPBD Kota Bengkulu',
          },
        ],
      },
      assembly_points: {
        create: [
          {
            nama: 'Masjid Raya Baitul Izzah Provinsi Bengkulu',
            lat: -3.8165,
            lng: 102.2755,
          },
          {
            nama: 'Halaman Gedung Daerah / Balai Raya Semarak Bengkulu',
            lat: -3.7946,
            lng: 102.2571,
          },
        ],
      },
    },
  });

  const regionGadingCempaka = await prisma.region.create({
    data: {
      kode_wilayah: '17.71.02.1002', // Kel. Jalan Gedang, Kec. Gading Cempaka, Kota Bengkulu
      kecamatan: 'Gading Cempaka',
      kab_kota: 'Kota Bengkulu',
      hazard_zones: {
        create: [
          {
            jenis_bencana: 'GEMPA',
            tingkat: 'TINGGI',
            sumber: 'BNPB Inarisk Kota Bengkulu',
          },
          {
            jenis_bencana: 'TSUNAMI',
            tingkat: 'SEDANG',
            sumber: 'BMKG & BPBD Kota Bengkulu',
          },
          {
            jenis_bencana: 'BANJIR',
            tingkat: 'SEDANG',
            sumber: 'BPBD Kota Bengkulu (Kawasan Cekungan & Drainase Perkotaan)',
          },
        ],
      },
      assembly_points: {
        create: [
          {
            nama: 'Halaman Kantor Gubernur Bengkulu',
            lat: -3.8214,
            lng: 102.2842,
          },
          {
            nama: 'Stadion Semarak Sawah Lebar Bengkulu',
            lat: -3.8091,
            lng: 102.2768,
          },
        ],
      },
    },
  });

  console.log('✅ Data Wilayah Kota Bengkulu (Region, HazardZone, AssemblyPoint) berhasil dibuat.');

  // 2. Seed Akun Admin
  const adminPasswordHash = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@siagakeluarga.id' },
    update: {
      nama: 'Administrator SiagaKeluarga',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      nama: 'Administrator SiagaKeluarga',
      email: 'admin@siagakeluarga.id',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Akun Admin (admin@siagakeluarga.id) berhasil dibuat.');

  // 3. Seed Akun Demo Wajib Lomba beserta Household, 4 Anggota Keluarga, 1 EmergencyPlan, dan 5 KitItem
  const demoPasswordHash = await bcrypt.hash('demo1234', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@siagakeluarga.id' },
    update: {
      nama: 'Keluarga Budi Santoso (Demo Bengkulu)',
      password_hash: demoPasswordHash,
      role: 'USER',
    },
    create: {
      nama: 'Keluarga Budi Santoso (Demo Bengkulu)',
      email: 'demo@siagakeluarga.id',
      password_hash: demoPasswordHash,
      role: 'USER',
    },
  });

  const demoHousehold = await prisma.household.create({
    data: {
      user_id: demoUser.id,
      region_id: regionTelukSegara.id,
      lat: -3.7912,
      lng: 102.2535,
      share_token: 'demo-bengkulu-siagakeluarga-2026',
      members: {
        create: [
          {
            panggilan: 'Ayah Budi',
            kelompok_umur: 'DEWASA',
            kebutuhan_khusus: null,
          },
          {
            panggilan: 'Ibu Sari',
            kelompok_umur: 'DEWASA',
            kebutuhan_khusus: 'Asma ringan (butuh inhaler cadangan di tas siaga)',
          },
          {
            panggilan: 'Nenek Rahma',
            kelompok_umur: 'LANSIA',
            kebutuhan_khusus: 'Hipertensi & mobilitas terbatas (menggunakan tongkat jalan, butuh obat rutin Amlodipine)',
          },
          {
            panggilan: 'Adik Rafa',
            kelompok_umur: 'BALITA',
            kebutuhan_khusus: 'Usia 2 tahun (butuh susu formula, popok, dan gendongan bayi saat evakuasi)',
          },
        ],
      },
      emergency_plans: {
        create: [
          {
            model_ai: 'gemini-2.5-flash',
            konten: {
              ringkasan_risiko:
                'Rumah berada di Kecamatan Teluk Segara, Kota Bengkulu yang memiliki tingkat risiko TINGGI terhadap Gempa Bumi Megathrust dan Tsunami pesisir.',
              titik_kumpul_utama: {
                nama: 'Lapangan Merdeka Kota Bengkulu (View Tower)',
                lat: -3.7888,
                lng: 102.2512,
                rute_evakuasi:
                  'Keluar rumah menuju Jl. Jenderal Ahmad Yani ke arah dataran lebih tinggi menuju kawasan Lapangan Merdeka / View Tower (hindari jalur tepi Pantai Malabero).',
              },
              pembagian_tugas_keluarga: [
                {
                  anggota: 'Ayah Budi (DEWASA)',
                  tugas:
                    'Mematikan MCB listrik & katup gas LPG jika sempat (maks 10 detik), mengambil Tas Siaga Bencana, dan membantu memapah Nenek Rahma.',
                },
                {
                  anggota: 'Ibu Sari (DEWASA)',
                  tugas:
                    'Menggendong Adik Rafa (BALITA) menggunakan gendongan depan agar kedua tangan tetap bebas untuk berlindung dan memegang tas perlengkapan bayi.',
                },
                {
                  anggota: 'Nenek Rahma (LANSIA)',
                  tugas:
                    'Melindungi kepala dengan bantal saat guncangan, memakai alas kaki tertutup di dekat pintu, dan dievakuasi bersama Ayah Budi.',
                },
                {
                  anggota: 'Adik Rafa (BALITA)',
                  tugas: 'Berada dalam gendongan dan pengawasan penuh Ibu Sari menuju titik kumpul.',
                },
              ],
              langkah_darurat_20_20_20: [
                '20 Detik Gempa: Jika guncangan gempa berlangsung lebih dari 20 detik atau sangat kuat hingga sulit berdiri, jangan tunggu peringatan resmi.',
                '20 Menit Waktu Evakuasi: Segera evakuasi mandiri bersama keluarga dalam waktu kurang dari 20 menit sebelum gelombang tsunami tiba di pesisir Bengkulu.',
                '20 Meter Ketinggian: Menuju tempat evakuasi dengan ketinggian minimal 20 meter di atas permukaan laut atau menjauhi garis pantai.',
              ],
              kontak_darurat: [
                { instansi: 'BPBD Kota Bengkulu', nomor: '112 / (0736) 21074' },
                { instansi: 'Basarnas Bengkulu', nomor: '115 / (0736) 5500666' },
                { instansi: 'PMI Kota Bengkulu', nomor: '(0736) 21118' },
              ],
            },
          },
        ],
      },
      kit_items: {
        create: [
          {
            nama_item: 'Air Minum Kemasan & Makanan Siap Saji (Kebutuhan 3 Hari)',
            status: true,
            kadaluarsa: new Date('2027-06-30T00:00:00.000Z'),
          },
          {
            nama_item: 'Kotak P3K, Obat Hipertensi Nenek Rahma & Inhaler Ibu Sari',
            status: true,
            kadaluarsa: new Date('2027-03-15T00:00:00.000Z'),
          },
          {
            nama_item: 'Susu Formula, Popok & Perlengkapan Darurat Balita (Adik Rafa)',
            status: true,
            kadaluarsa: new Date('2027-01-20T00:00:00.000Z'),
          },
          {
            nama_item: 'Dokumen Penting Keluarga (KK, KTP, Akta, Surat Tanah dalam Map Kedap Air)',
            status: true,
            kadaluarsa: null,
          },
          {
            nama_item: 'Senter LED, Peluit Darurat, Powerbank & Radio Portabel Baterai',
            status: false,
            kadaluarsa: null,
          },
        ],
      },
      drills: {
        create: [
          {
            jadwal: new Date('2026-12-01T09:00:00.000Z'),
            skor: 85,
          },
        ],
      },
    },
  });

  console.log(`✅ Akun Demo (demo@siagakeluarga.id) & Household (${demoHousehold.id}) berhasil dibuat.`);

  // 4. Seed Potongan Panduan Resmi BNPB (GuideChunk)
  await prisma.guideChunk.createMany({
    data: [
      {
        sumber: 'Buku Saku BNPB: Tanggap Tangkas Tangguh Menghadapi Bencana - Gempa Bumi',
        isi: 'Saat terjadi gempa bumi di dalam rumah: Berlindunglah di bawah meja yang kokoh (Drop, Cover, Hold On), lindungi kepala dan leher dengan bantal atau lengan, jauhi kaca, lemari tinggi, dan benda yang mudah jatuh. Setelah guncangan berhenti, matikan kompor dan listrik, lalu segera keluar melalui jalur evakuasi menuju titik kumpul terbuka.',
      },
      {
        sumber: 'Panduan Kesiapsiagaan Tsunami BNPB & BMKG (Prinsip 20-20-20 Pesisir Barat Sumatera)',
        isi: 'Bagi warga di pesisir pantai seperti Kota Bengkulu, gunakan prinsip 20-20-20: Jika merasakan gempa bumi kuat atau guncangan berlangsung lebih dari 20 detik, Anda memiliki waktu sekitar 20 menit untuk segera melakukan evakuasi mandiri menuju dataran tinggi minimal 20 meter di atas permukaan laut atau gedung evakuasi vertikal (TES) tanpa menunggu sirine.',
      },
      {
        sumber: 'Buku Saku BNPB: Kesiapsiagaan Evakuasi Kelompok Rentan (Lansia, Balita, Ibu Hamil, Disabilitas)',
        isi: 'Keluarga yang memiliki anggota kelompok rentan wajib menetapkan pendamping khusus (sistem buddy) sebelum bencana. Lansia dengan keterbatasan gerak harus tidur di kamar lantai dasar dekat jalur keluar dan disiapkan obat rutin minimal untuk 7 hari. Balita dievakuasi menggunakan gendongan kain/ergonomis di dada agar kedua tangan orang tua tetap bebas untuk berpegangan.',
      },
      {
        sumber: 'Standar Tas Siaga Bencana (TSB) BNPB untuk Ketahanan 72 Jam Pertama',
        isi: 'Tas Siaga Bencana (TSB) harus diletakkan di tempat yang mudah dijangkau dekat pintu keluar dan berisi kebutuhan bertahan hidup selama 3 hari (72 jam): dokumen penting dalam plastik kedap air, air minum minimal 2-3 liter per orang per hari, makanan tahan lama siap saji, kotak P3K dan obat pribadi, senter, peluit, powerbank, radio baterai, pakaian ganti, masker, serta uang tunai secukupnya.',
      },
      {
        sumber: 'Buku Saku BNPB: Kesiapsiagaan dan Penyelamatan Diri Saat Banjir & Cuaca Ekstrem',
        isi: 'Saat peringatan dini banjir atau hujan ekstrem: Pantau informasi cuaca resmi BMKG, pindahkan barang elektronik dan dokumen ke tempat lebih tinggi, serta segera cabut peralatan listrik dan matikan MCB utama jika air mulai masuk ke rumah. Jangan berjalan atau mengemudi menerobos arus banjir karena arus setinggi 15-30 cm sudah dapat menjatuhkan orang dewasa.',
      },
      {
        sumber: 'Panduan Rencana Siaga Keluarga & Latihan Simulasi Evakuasi Mandiri BNPB',
        isi: 'Setiap keluarga harus menyepakati dua titik kumpul: satu titik aman di luar rumah (seperti lapangan terbuka bebas tiang listrik) saat terjadi gempa, dan satu titik evakuasi akhir di luar lingkungan (seperti gedung tinggi atau bukit evakuasi) saat terjadi ancaman tsunami atau banjir besar. Lakukan simulasi/drill keluarga minimal setiap 3-6 bulan sekali.',
      },
    ],
  });

  console.log('✅ 6 Potongan Panduan Resmi BNPB (GuideChunk) berhasil dibuat.');
  console.log('🎉 Proses seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
