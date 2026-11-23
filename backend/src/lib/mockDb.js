import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';

// Hanya dipakai saat pengembangan lokal tanpa database (lihat lib/prisma.js).
// Sandi akun demo dari SEED_DEMO_PASSWORD (bawaan lokal: demo1234). Sandi admin dari SEED_ADMIN_PASSWORD;
// bila kosong dibuat acak sehingga akun admin tiruan tidak bisa dipakai masuk.
const DEMO_PASSWORD_HASH = bcrypt.hashSync(process.env.SEED_DEMO_PASSWORD || 'demo1234', 10);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD || randomBytes(18).toString('base64url'), 10);

class MockDatabase {
  constructor() {
    this.reset();
  }

  reset() {
    this.regions = [
      {
        id: 1,
        kode_wilayah: '17.71.04.1005',
        kecamatan: 'Teluk Segara',
        kab_kota: 'Kota Bengkulu',
      },
      {
        id: 2,
        kode_wilayah: '17.71.06.1001',
        kecamatan: 'Ratu Samban',
        kab_kota: 'Kota Bengkulu',
      },
      {
        id: 3,
        kode_wilayah: '17.71.02.1002',
        kecamatan: 'Gading Cempaka',
        kab_kota: 'Kota Bengkulu',
      },
    ];

    this.hazardZones = [
      { id: 1, region_id: 1, jenis_bencana: 'GEMPA', tingkat: 'TINGGI', sumber: 'BNPB Inarisk & Peta Zona Megathrust Enggano-Bengkulu' },
      { id: 2, region_id: 1, jenis_bencana: 'TSUNAMI', tingkat: 'TINGGI', sumber: 'BMKG Peta Inundasi Tsunami Pesisir Pantai Malabero - Tapak Paderi' },
      { id: 3, region_id: 1, jenis_bencana: 'CUACA_EKSTREM', tingkat: 'SEDANG', sumber: 'BMKG Stasiun Meteorologi Fatmawati Soekarno Bengkulu' },
      { id: 4, region_id: 2, jenis_bencana: 'GEMPA', tingkat: 'TINGGI', sumber: 'BNPB Inarisk & Zona Subduksi Sunda Megathrust' },
      { id: 5, region_id: 2, jenis_bencana: 'TSUNAMI', tingkat: 'TINGGI', sumber: 'BMKG & BPBD Kota Bengkulu (Kawasan Pantai Panjang)' },
      { id: 6, region_id: 2, jenis_bencana: 'BANJIR', tingkat: 'SEDANG', sumber: 'BPBD Kota Bengkulu' },
      { id: 7, region_id: 3, jenis_bencana: 'GEMPA', tingkat: 'TINGGI', sumber: 'BNPB Inarisk Kota Bengkulu' },
      { id: 8, region_id: 3, jenis_bencana: 'TSUNAMI', tingkat: 'SEDANG', sumber: 'BMKG & BPBD Kota Bengkulu' },
      { id: 9, region_id: 3, jenis_bencana: 'BANJIR', tingkat: 'TINGGI', sumber: 'BPBD Kota Bengkulu (Kawasan Cekungan & Drainase Perkotaan)' },
    ];

    this.assemblyPoints = [
      { id: 1, region_id: 1, nama: 'Lapangan Merdeka Kota Bengkulu (View Tower)', lat: -3.7888, lng: 102.2512 },
      { id: 2, region_id: 1, nama: 'Benteng Marlborough (Titik Evakuasi Sementara Bukit Tinggi)', lat: -3.7872, lng: 102.2484 },
      { id: 3, region_id: 2, nama: 'Masjid Raya Baitul Izzah Provinsi Bengkulu', lat: -3.8165, lng: 102.2755 },
      { id: 4, region_id: 2, nama: 'Halaman Gedung Daerah / Balai Raya Semarak Bengkulu', lat: -3.7946, lng: 102.2571 },
      { id: 5, region_id: 3, nama: 'Halaman Kantor Gubernur Bengkulu', lat: -3.8214, lng: 102.2842 },
      { id: 6, region_id: 3, nama: 'Stadion Semarak Sawah Lebar Bengkulu', lat: -3.8091, lng: 102.2768 },
    ];

    this.users = [
      {
        id: 'demo-user-id-001',
        nama: 'Keluarga Budi Santoso (Demo Bengkulu)',
        email: 'demo@siagakeluarga.id',
        password_hash: DEMO_PASSWORD_HASH,
        role: 'USER',
        created_at: new Date('2026-11-20T10:00:00Z').toISOString(),
      },
      {
        id: 'admin-user-id-001',
        nama: 'Administrator SiagaKeluarga',
        email: 'admin@siagakeluarga.id',
        password_hash: ADMIN_PASSWORD_HASH,
        role: 'ADMIN',
        created_at: new Date('2026-11-20T10:00:00Z').toISOString(),
      },
    ];

    this.households = [
      {
        id: 'demo-household-id-001',
        user_id: 'demo-user-id-001',
        region_id: 1,
        lat: -3.7912,
        lng: 102.2535,
        share_token: 'demo-bengkulu-siagakeluarga-2026',
        created_at: new Date('2026-11-20T10:00:00Z').toISOString(),
      },
    ];

    this.members = [
      { id: 'm-1', household_id: 'demo-household-id-001', panggilan: 'Ayah Budi', kelompok_umur: 'DEWASA', kebutuhan_khusus: null },
      { id: 'm-2', household_id: 'demo-household-id-001', panggilan: 'Ibu Sari', kelompok_umur: 'DEWASA', kebutuhan_khusus: 'Asma ringan (butuh inhaler cadangan di tas siaga)' },
      { id: 'm-3', household_id: 'demo-household-id-001', panggilan: 'Nenek Rahma', kelompok_umur: 'LANSIA', kebutuhan_khusus: 'Hipertensi & mobilitas terbatas (menggunakan tongkat jalan, butuh obat rutin Amlodipine)' },
      { id: 'm-4', household_id: 'demo-household-id-001', panggilan: 'Adik Rafa', kelompok_umur: 'BALITA', kebutuhan_khusus: 'Usia 2 tahun (butuh susu formula, popok, dan gendongan bayi saat evakuasi)' },
    ];

    this.kitItems = [
      { id: 'k-1', household_id: 'demo-household-id-001', nama_item: 'Air Minum Kemasan & Makanan Siap Saji (Kebutuhan 3 Hari)', status: true, kadaluarsa: new Date('2027-06-30') },
      { id: 'k-2', household_id: 'demo-household-id-001', nama_item: 'Kotak P3K, Obat Hipertensi Nenek Rahma & Inhaler Ibu Sari', status: true, kadaluarsa: new Date('2027-03-15') },
      { id: 'k-3', household_id: 'demo-household-id-001', nama_item: 'Susu Formula, Popok & Perlengkapan Darurat Balita (Adik Rafa)', status: true, kadaluarsa: new Date('2027-01-20') },
      { id: 'k-4', household_id: 'demo-household-id-001', nama_item: 'Dokumen Penting Keluarga (KK, KTP, Akta, Surat Tanah dalam Map Kedap Air)', status: true, kadaluarsa: null },
      { id: 'k-5', household_id: 'demo-household-id-001', nama_item: 'Senter LED, Peluit Darurat, Powerbank & Radio Portabel Baterai', status: true, kadaluarsa: null },
      { id: 'k-6', household_id: 'demo-household-id-001', nama_item: 'Pakaian Ganti, Jas Hujan & Selimut Termal', status: false, kadaluarsa: null },
      { id: 'k-7', household_id: 'demo-household-id-001', nama_item: 'Masker Medis N95 & Hand Sanitizer', status: true, kadaluarsa: new Date('2026-12-31') },
    ];

    this.drills = [
      { id: 'd-1', household_id: 'demo-household-id-001', jadwal: new Date('2026-11-15T09:00:00Z'), skor: 92, catatan: 'Simulasi evakuasi gempa dan evakuasi Nenek Rahma sukses' },
      { id: 'd-2', household_id: 'demo-household-id-001', jadwal: new Date('2026-12-05T10:00:00Z'), skor: null, catatan: 'Rencana drill tsunami pesisir bersama BPBD' },
    ];

    this.emergencyPlans = [
      {
        id: 'ep-1',
        household_id: 'demo-household-id-001',
        model_ai: 'gemini-3.8-flash',
        created_at: new Date('2026-11-20T10:05:00Z'),
        konten: {
          ringkasan_risiko: 'Rumah berada di Kecamatan Teluk Segara, Kota Bengkulu yang memiliki tingkat risiko TINGGI terhadap Gempa Bumi Megathrust dan Tsunami pesisir.',
          titik_kumpul_utama: {
            nama: 'Lapangan Merdeka Kota Bengkulu (View Tower)',
            lat: -3.7888,
            lng: 102.2512,
            rute_evakuasi: 'Keluar rumah menuju Jl. Jenderal Ahmad Yani ke arah dataran lebih tinggi menuju kawasan Lapangan Merdeka / View Tower (hindari jalur tepi Pantai Malabero).',
          },
          pembagian_tugas_keluarga: [
            { anggota: 'Ayah Budi (DEWASA)', tugas: 'Mematikan MCB listrik & katup gas LPG, mengambil Tas Siaga Bencana, dan memapah Nenek Rahma.' },
            { anggota: 'Ibu Sari (DEWASA)', tugas: 'Menggendong Adik Rafa dengan gendongan depan agar kedua tangan bebas berlindung dan membawa tas bayi.' },
            { anggota: 'Nenek Rahma (LANSIA)', tugas: 'Melindungi kepala dengan bantal saat guncangan, memakai alas kaki tertutup, dan dievakuasi bersama Ayah Budi.' },
            { anggota: 'Adik Rafa (BALITA)', tugas: 'Berada dalam gendongan dan pengawasan penuh Ibu Sari menuju titik kumpul.' },
          ],
          langkah_darurat_20_20_20: [
            '20 Detik Gempa: Jika guncangan berlangsung lebih dari 20 detik atau sulit berdiri, jangan tunggu peringatan resmi.',
            '20 Menit Waktu Evakuasi: Segera evakuasi mandiri bersama keluarga dalam waktu kurang dari 20 menit sebelum gelombang tsunami tiba.',
            '20 Meter Ketinggian: Menuju tempat evakuasi dengan ketinggian minimal 20 meter di atas permukaan laut atau menjauhi garis pantai.',
          ],
          kontak_darurat: [
            { instansi: 'BPBD Kota Bengkulu', nomor: '112 / (0736) 21074' },
            { instansi: 'Basarnas Bengkulu', nomor: '115 / (0736) 5500666' },
            { instansi: 'PMI Kota Bengkulu', nomor: '(0736) 21118' },
          ],
        },
      },
    ];

    this.checkIns = [];

    this.guides = [
      { id: 1, sumber: 'BNPB Pedoman Kesiapsiagaan Gempa Bumi', isi: 'Saat terjadi gempa bumi, lakukan Drop, Cover, and Hold On (Merunduk, Berlindung di bawah meja kokoh, dan Berpegangan). Jauhi kaca, jendela, dan benda berat yang mudah runtuh.' },
      { id: 2, sumber: 'BMKG Pedoman Evakuasi Mandiri Tsunami', isi: 'Jika merasakan gempa kuat lebih dari 20 detik di daerah pesisir, segera lari menuju tempat yang lebih tinggi (minimal ketinggian 20 meter dpl) dalam waktu kurang dari 20 menit.' },
      { id: 3, sumber: 'BNPB Panduan Tas Siaga Bencana (TSB)', isi: 'Siapkan Tas Siaga Bencana kedap air berisi: Air minum 3 liter per orang, makanan siap santap 3 hari, kotak P3K dan obat pribadi, senter, peluit, radio portabel, pakaian ganti, salinan dokumen penting, dan uang tunai secukupnya.' },
    ];
  }

  // Helper relasi region
  _attachRegion(region, include) {
    if (!region) return null;
    const r = { ...region };
    if (include?.hazard_zones) {
      r.hazard_zones = this.hazardZones.filter((z) => z.region_id === region.id);
    }
    if (include?.assembly_points) {
      r.assembly_points = this.assemblyPoints.filter((a) => a.region_id === region.id);
    }
    return r;
  }

  _attachHousehold(h, include) {
    if (!h) return null;
    const res = { ...h };
    if (include?.region) {
      res.region = this._attachRegion(this.regions.find((r) => r.id === h.region_id), { hazard_zones: true, assembly_points: true });
    }
    if (include?.members) {
      res.members = this.members.filter((m) => m.household_id === h.id);
    }
    if (include?.kit_items) {
      res.kit_items = this.kitItems.filter((k) => k.household_id === h.id);
    }
    if (include?.drills) {
      res.drills = this.drills.filter((d) => d.household_id === h.id);
    }
    if (include?.emergency_plans) {
      res.emergency_plans = this.emergencyPlans.filter((p) => p.household_id === h.id);
    }
    if (include?._count?.select?.drills) {
      res._count = { drills: this.drills.filter((d) => d.household_id === h.id).length };
    }
    if (include?.user) {
      const u = this.users.find((u) => u.id === h.user_id);
      res.user = u ? { nama: u.nama } : null;
    }
    return res;
  }

  _attachUser(u, include) {
    if (!u) return null;
    const res = { ...u };
    if (include?.household) {
      const h = this.households.find((h) => h.user_id === u.id);
      res.household = h ? this._attachHousehold(h, typeof include.household === 'object' ? include.household.include : null) : null;
    }
    return res;
  }

  // Model Prisma Mock
  get user() {
    return {
      findUnique: async ({ where, include }) => {
        let u;
        if (where.email) u = this.users.find((x) => x.email.toLowerCase() === where.email.toLowerCase());
        else if (where.id) u = this.users.find((x) => x.id === where.id);
        return this._attachUser(u, include);
      },
      create: async ({ data, include }) => {
        const u = {
          id: randomUUID(),
          nama: data.nama,
          email: data.email.toLowerCase(),
          password_hash: data.password_hash,
          role: data.role || 'USER',
          created_at: new Date().toISOString(),
        };
        this.users.push(u);
        if (data.household?.create) {
          const h = {
            id: randomUUID(),
            user_id: u.id,
            region_id: data.household.create.region_id ?? 1,
            lat: -3.7912,
            lng: 102.2535,
            share_token: randomUUID().slice(0, 8),
            created_at: new Date().toISOString(),
          };
          this.households.push(h);
        }
        return this._attachUser(u, include);
      },
      upsert: async ({ where, update, create }) => {
        const found = this.users.find((x) => x.email === where.email);
        if (found) {
          Object.assign(found, update);
          return found;
        }
        const u = { id: randomUUID(), created_at: new Date().toISOString(), ...create };
        this.users.push(u);
        return u;
      },
    };
  }

  get household() {
    return {
      findUnique: async ({ where, include }) => {
        let h;
        if (where.id) h = this.households.find((x) => x.id === where.id);
        else if (where.user_id) h = this.households.find((x) => x.user_id === where.user_id);
        else if (where.share_token) h = this.households.find((x) => x.share_token === where.share_token);
        return this._attachHousehold(h, include);
      },
      findFirst: async ({ where, include }) => {
        const h = this.households.find(
          (x) =>
            (!where?.user_id || x.user_id === where.user_id) &&
            (!where?.telegram_kode || x.telegram_kode === where.telegram_kode),
        );
        return this._attachHousehold(h, include);
      },
      findMany: async ({ where, include } = {}) => {
        return this.households
          .filter((x) => (where?.telegram_chat_id?.not === null ? x.telegram_chat_id != null : true))
          .map((h) => this._attachHousehold(h, include));
      },
      create: async ({ data, include }) => {
        const h = {
          id: randomUUID(),
          user_id: data.user_id,
          region_id: data.region_id ?? 1,
          lat: data.lat ?? -3.7912,
          lng: data.lng ?? 102.2535,
          share_token: data.share_token ?? randomUUID().slice(0, 8),
          created_at: new Date().toISOString(),
        };
        this.households.push(h);
        return this._attachHousehold(h, include);
      },
      update: async ({ where, data, include }) => {
        const h = this.households.find((x) => x.id === where.id);
        if (!h) throw new Error('Household not found');
        if (data.region_id !== undefined) h.region_id = data.region_id;
        if (data.lat !== undefined) h.lat = data.lat;
        if (data.lng !== undefined) h.lng = data.lng;
        if (data.share_token !== undefined) h.share_token = data.share_token;
        for (const k of ['telegram_chat_id', 'telegram_kode', 'peringatan_terakhir_at', 'peringatan_terakhir_tingkat']) {
          if (data[k] !== undefined) h[k] = data[k];
        }
        return this._attachHousehold(h, include);
      },
    };
  }

  get member() {
    return {
      create: async ({ data }) => {
        const m = { id: randomUUID(), ...data };
        this.members.push(m);
        return m;
      },
      findFirst: async ({ where }) => {
        return this.members.find((m) => m.id === where.id && (!where.household_id || m.household_id === where.household_id)) || null;
      },
      update: async ({ where, data }) => {
        const m = this.members.find((x) => x.id === where.id);
        if (!m) throw new Error('Member not found');
        Object.assign(m, data);
        return m;
      },
      delete: async ({ where }) => {
        const idx = this.members.findIndex((x) => x.id === where.id);
        if (idx !== -1) this.members.splice(idx, 1);
        return { success: true };
      },
    };
  }

  get region() {
    return {
      findMany: async ({ where, include }) => {
        return this.regions.map((r) => this._attachRegion(r, include));
      },
      findUnique: async ({ where, include }) => {
        const r = this.regions.find((x) => x.id === where.id);
        return this._attachRegion(r, include);
      },
      findFirst: async ({ where, include }) => {
        const r = this.regions.find((x) => !where?.kecamatan || x.kecamatan === where.kecamatan);
        return this._attachRegion(r, include);
      },
    };
  }

  get hazardZone() {
    return {
      findMany: async ({ include }) => {
        return this.hazardZones.map((z) => ({
          ...z,
          region: include?.region ? this.regions.find((r) => r.id === z.region_id) : undefined,
        }));
      },
      create: async ({ data, include }) => {
        const item = { id: this.hazardZones.length + 1, ...data };
        this.hazardZones.push(item);
        if (include?.region) item.region = this.regions.find((r) => r.id === item.region_id);
        return item;
      },
      update: async ({ where, data, include }) => {
        const z = this.hazardZones.find((x) => x.id === where.id);
        if (!z) throw new Error('Hazard zone not found');
        Object.assign(z, data);
        if (include?.region) z.region = this.regions.find((r) => r.id === z.region_id);
        return z;
      },
      delete: async ({ where }) => {
        const idx = this.hazardZones.findIndex((x) => x.id === where.id);
        if (idx !== -1) this.hazardZones.splice(idx, 1);
        return { success: true };
      },
    };
  }

  get assemblyPoint() {
    return {
      findMany: async ({ include }) => {
        return this.assemblyPoints.map((a) => ({
          ...a,
          region: include?.region ? this.regions.find((r) => r.id === a.region_id) : undefined,
        }));
      },
      create: async ({ data, include }) => {
        const item = { id: this.assemblyPoints.length + 1, ...data };
        this.assemblyPoints.push(item);
        if (include?.region) item.region = this.regions.find((r) => r.id === item.region_id);
        return item;
      },
      update: async ({ where, data, include }) => {
        const a = this.assemblyPoints.find((x) => x.id === where.id);
        if (!a) throw new Error('Assembly point not found');
        Object.assign(a, data);
        if (include?.region) a.region = this.regions.find((r) => r.id === a.region_id);
        return a;
      },
      delete: async ({ where }) => {
        const idx = this.assemblyPoints.findIndex((x) => x.id === where.id);
        if (idx !== -1) this.assemblyPoints.splice(idx, 1);
        return { success: true };
      },
    };
  }

  get kitItem() {
    return {
      findMany: async ({ where }) => {
        return this.kitItems.filter((k) => !where?.household_id || k.household_id === where.household_id);
      },
      findFirst: async ({ where }) => {
        return this.kitItems.find((k) => k.id === where.id && (!where.household_id || k.household_id === where.household_id)) || null;
      },
      create: async ({ data }) => {
        const k = { id: randomUUID(), ...data };
        this.kitItems.push(k);
        return k;
      },
      update: async ({ where, data }) => {
        const k = this.kitItems.find((x) => x.id === where.id);
        if (!k) throw new Error('Kit item not found');
        Object.assign(k, data);
        return k;
      },
      delete: async ({ where }) => {
        const idx = this.kitItems.findIndex((x) => x.id === where.id);
        if (idx !== -1) this.kitItems.splice(idx, 1);
        return { success: true };
      },
    };
  }

  get drill() {
    return {
      findMany: async ({ where }) => {
        return this.drills.filter((d) => !where?.household_id || d.household_id === where.household_id);
      },
      findFirst: async ({ where }) => {
        return this.drills.find((d) => d.id === where.id && (!where.household_id || d.household_id === where.household_id)) || null;
      },
      create: async ({ data }) => {
        const d = { id: randomUUID(), ...data };
        this.drills.push(d);
        return d;
      },
      update: async ({ where, data }) => {
        const d = this.drills.find((x) => x.id === where.id);
        if (!d) throw new Error('Drill not found');
        Object.assign(d, data);
        return d;
      },
    };
  }

  get checkIn() {
    return {
      findMany: async ({ where, orderBy } = {}) => {
        let rows = this.checkIns.filter((c) => !where?.household_id || c.household_id === where.household_id);
        if (orderBy?.created_at === 'desc') rows = [...rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return rows;
      },
      create: async ({ data }) => {
        const c = { id: randomUUID(), created_at: new Date().toISOString(), lat: null, lng: null, pesan: null, member_id: null, ...data };
        this.checkIns.push(c);
        return c;
      },
      deleteMany: async ({ where } = {}) => {
        const sebelum = this.checkIns.length;
        this.checkIns = this.checkIns.filter((c) => where?.household_id && c.household_id !== where.household_id);
        return { count: sebelum - this.checkIns.length };
      },
    };
  }

  get guideChunk() {
    return {
      findMany: async () => this.guides,
      create: async ({ data }) => {
        const g = { id: this.guides.length + 1, ...data };
        this.guides.push(g);
        return g;
      },
      update: async ({ where, data }) => {
        const g = this.guides.find((x) => x.id === where.id);
        if (!g) throw new Error('Guide not found');
        Object.assign(g, data);
        return g;
      },
      delete: async ({ where }) => {
        const idx = this.guides.findIndex((x) => x.id === where.id);
        if (idx !== -1) this.guides.splice(idx, 1);
        return { success: true };
      },
    };
  }

  get emergencyPlan() {
    return {
      findMany: async () => this.emergencyPlans,
      create: async ({ data }) => {
        const p = { id: randomUUID(), created_at: new Date(), ...data };
        this.emergencyPlans.push(p);
        return p;
      },
    };
  }

  async $queryRaw() {
    return this.guides;
  }

  async $executeRaw() {
    return 1;
  }
}

export const mockDb = new MockDatabase();
