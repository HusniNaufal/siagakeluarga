# Kontrak API SiagaKeluarga

Dokumen ini merupakan referensi kontrak REST API aktual berdasarkan implementasi backend (`backend/src/routes/`, `backend/src/controllers/`, dan `backend/src/services/`).

---

## 1. Base URL & Aturan `VITE_API_URL`

Seluruh route backend dipasang pada prefix `/api` di `backend/src/app.js` (`app.use('/api', routes)`).

- **Aturan `VITE_API_URL` di frontend:** isi dengan **origin backend tanpa trailing slash (`/`) dan tanpa suffix `/api`**.
  - Lokal: `VITE_API_URL=[http://localhost:3000]`
  - Produksi (Vercel): `VITE_API_URL=https://siagakeluarga.vercel.app/`
- **Format pemanggilan endpoint:** `${VITE_API_URL}/api/<endpoint>` (contoh: `${VITE_API_URL}/api/auth/login`).
- **Format data:** seluruh request body dan response menggunakan `Content-Type: application/json`.

---

## 2. Autentikasi & Hak Akses

Autentikasi menggunakan JWT (masa berlaku `7d`) yang dikirim melalui header:

```http
Authorization: Bearer <JWT>
```

Tingkat akses endpoint:
- **Publik**: dapat diakses tanpa token.
- **Opsional** (`optionalAuth`): dapat diakses tanpa token; jika token valid disertakan, profil user otomatis dipakai untuk konteks/fallback (token yang tidak valid diabaikan tanpa error `401`).
- **User** (`authenticate`): wajib menyertakan Bearer JWT valid (`401` jika tidak ada, tidak valid, atau kedaluwarsa).
- **Admin** (`authenticate` + `requireAdmin`): wajib Bearer JWT valid dengan `role: "ADMIN"` (`403` jika bukan admin).

---

## 3. Format Standar Respons JSON & Error

### Respons Sukses
```json
{
  "success": true,
  "message": "Pesan deskriptif",
  "data": {}
}
```
> **Catatan:** `GET /api/health` mengembalikan `{ "success": true, "message": "Server is healthy" }` tanpa field `data`. Endpoint `DELETE` mengembalikan `"data": null`.

### Respons Error Umum (`400`, `401`, `403`, `404`, `409`, `429`, `500`, `502`, `503`)
```json
{
  "success": false,
  "message": "Pesan error ramah pengguna"
}
```

### Respons Error Validasi Zod (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "body.email", "message": "Email tidak valid" }
  ]
}
```

### Enum yang Digunakan
- `Role`: `"USER"` | `"ADMIN"`
- `KelompokUmur`: `"BALITA"` | `"ANAK"` | `"DEWASA"` | `"LANSIA"`
- `JenisBencana`: `"GEMPA"` | `"TSUNAMI"` | `"BANJIR"` | `"LONGSOR"` | `"CUACA_EKSTREM"`
- `TingkatRisiko`: `"RENDAH"` | `"SEDANG"` | `"TINGGI"`

---

## 4. Ringkasan Daftar Endpoint

| Metode | Endpoint (di bawah `/api`) | Akses | Keterangan |
|---|---|---|---|
| `GET` | `/health` | Publik | Cek status kesehatan server |
| `POST` | `/auth/register` | Publik | Daftar akun baru + buat household default |
| `POST` | `/auth/login` | Publik | Login dan dapatkan JWT |
| `GET` | `/auth/me` | User | Ambil profil user & ringkasan household |
| `GET` | `/household` | User | Ambil data lengkap household, anggota, tas siaga, simulasi, & rencana terakhir |
| `PUT` | `/household` | User | Perbarui wilayah, koordinat (`lat`, `lng`), atau regenerate `share_token` |
| `POST` | `/household/members` | User | Tambah anggota keluarga |
| `PUT` | `/household/members/:id` | User | Perbarui anggota keluarga |
| `DELETE` | `/household/members/:id` | User | Hapus anggota keluarga |
| `GET` | `/regions` | Publik | Daftar kecamatan Kota Bengkulu beserta zona risiko & titik kumpul |
| `GET` | `/risk` | Opsional | Detail risiko wilayah, titik kumpul terurut jarak, & prakiraan cuaca BMKG |
| `GET` | `/kit` | User | Daftar item tas siaga & persentase kesiapan |
| `POST` | `/kit` | User | Tambah item tas siaga |
| `PATCH` | `/kit/:id` | User | Perbarui item tas siaga (nama, status, kadaluarsa) |
| `DELETE` | `/kit/:id` | User | Hapus item tas siaga |
| `GET` | `/drills` | User | Daftar riwayat/jadwal simulasi & rata-rata skor |
| `POST` | `/drills` | User | Catat/jadwalkan simulasi darurat |
| `PATCH` | `/drills/:id` | User | Perbarui jadwal atau skor simulasi |
| `GET` | `/share/:token` | Publik | Kartu darurat publik read-only berdasarkan `share_token` |
| `POST` | `/ai/plan` | User | Buat & simpan rencana darurat keluarga dengan AI (Structured Output) |
| `POST` | `/ai/ask` | Opsional | Tanya Siaga berbasis RAG (`pgvector` panduan BNPB) |
| `POST` | `/ai/quiz` | User | Buat 5 soal kuis pilihan ganda simulasi darurat dengan AI |
| `POST` | `/admin/reindex-guides` | Admin | Hitung ulang embedding vektor 768-dimensi seluruh `GuideChunk` |

---

## 5. Detail Setiap Endpoint

### A. System

#### `GET /api/health`
- **Akses:** Publik
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

### B. Autentikasi (`/api/auth`)

#### `POST /api/auth/register`
- **Akses:** Publik
- **Body Request:**
  - `nama` (`string`, wajib, min 1 karakter setelah trim)
  - `email` (`string`, wajib, format email valid, otomatis disimpan lowercase)
  - `password` (`string`, wajib, min 6 karakter)
```json
{
  "nama": "Keluarga Budi",
  "email": "budi@example.com",
  "password": "password123"
}
```
- **Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "token": "<JWT>",
    "user": {
      "id": "uuid-user",
      "nama": "Keluarga Budi",
      "email": "budi@example.com",
      "role": "USER",
      "created_at": "2026-11-23T04:00:00.000Z"
    },
    "household_id": "uuid-household"
  }
}
```
- **Error khusus:** `409 Conflict` jika email sudah terdaftar.

#### `POST /api/auth/login`
- **Akses:** Publik
- **Body Request:**
```json
{
  "email": "demo@siagakeluarga.id",
  "password": "demo1234"
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "<JWT>",
    "user": {
      "id": "uuid-user",
      "nama": "Keluarga Demo Bengkulu",
      "email": "demo@siagakeluarga.id",
      "role": "USER",
      "created_at": "2026-11-23T04:00:00.000Z"
    }
  }
}
```
- **Error khusus:** `401 Unauthorized` jika email atau password salah.

#### `GET /api/auth/me`
- **Akses:** User (`Authorization: Bearer <JWT>`)
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "user": {
      "id": "uuid-user",
      "nama": "Keluarga Demo Bengkulu",
      "email": "demo@siagakeluarga.id",
      "role": "USER",
      "created_at": "2026-11-23T04:00:00.000Z"
    },
    "household": {
      "id": "uuid-household",
      "region": {
        "id": 1,
        "kode_wilayah": "17.71.01.1001",
        "kecamatan": "Teluk Segara",
        "kab_kota": "Kota Bengkulu"
      },
      "jumlah_anggota": 4,
      "kesiapan_tas": {
        "total": 8,
        "siap": 5,
        "persentase": 63
      },
      "jumlah_simulasi": 2,
      "share_token": "demo-bengkulu-siagakeluarga-2026"
    }
  }
}
```

---

### C. Keluarga & Anggota (`/api/household`)

> Jika user belum memiliki record `Household`, backend otomatis membuatnya dengan wilayah default Kecamatan Teluk Segara, Kota Bengkulu.

#### `GET /api/household`
- **Akses:** User
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Data keluarga berhasil diambil",
  "data": {
    "id": "uuid-household",
    "user_id": "uuid-user",
    "region_id": 1,
    "lat": -3.7928,
    "lng": 102.2608,
    "share_token": "demo-bengkulu-siagakeluarga-2026",
    "region": {
      "id": 1,
      "kode_wilayah": "17.71.01.1001",
      "kecamatan": "Teluk Segara",
      "kab_kota": "Kota Bengkulu"
    },
    "members": [
      {
        "id": "uuid-member",
        "household_id": "uuid-household",
        "panggilan": "Nenek Siti",
        "kelompok_umur": "LANSIA",
        "kebutuhan_khusus": "Menggunakan tongkat, obat hipertensi"
      }
    ],
    "kit_items": [
      {
        "id": "uuid-kit",
        "household_id": "uuid-household",
        "nama_item": "Senter & baterai cadangan",
        "status": true,
        "kadaluarsa": null
      }
    ],
    "drills": [
      {
        "id": "uuid-drill",
        "household_id": "uuid-household",
        "jadwal": "2026-11-30T09:00:00.000Z",
        "skor": 85
      }
    ],
    "emergency_plans": [
      {
        "id": "uuid-plan",
        "household_id": "uuid-household",
        "konten": { "...": "lihat struktur POST /api/ai/plan" },
        "model_ai": "gemini-3.8-flash",
        "created_at": "2026-11-23T04:10:00.000Z"
      }
    ],
    "kesiapan_tas": {
      "total": 1,
      "siap": 1,
      "persentase": 100
    }
  }
}
```
> **Catatan:** `emergency_plans` hanya berisi maksimal **1 rencana terbaru** (`orderBy: created_at desc, take: 1`).

#### `PUT /api/household`
- **Akses:** User
- **Body Request** (semua field opsional):
  - `region_id` (`integer | null`, opsional)
  - `lat` (`number` `-90..90` `| null`, opsional)
  - `lng` (`number` `-180..180` `| null`, opsional)
  - `regenerate_share_token` (`boolean`, opsional — jika `true`, menghasilkan UUID `share_token` baru)
```json
{
  "region_id": 1,
  "lat": -3.7928,
  "lng": 102.2608,
  "regenerate_share_token": false
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Data keluarga berhasil diperbarui",
  "data": {
    "id": "uuid-household",
    "user_id": "uuid-user",
    "region_id": 1,
    "lat": -3.7928,
    "lng": 102.2608,
    "share_token": "demo-bengkulu-siagakeluarga-2026",
    "region": {
      "id": 1,
      "kode_wilayah": "17.71.01.1001",
      "kecamatan": "Teluk Segara",
      "kab_kota": "Kota Bengkulu"
    }
  }
}
```
- **Error khusus:** `404 Not Found` jika `region_id` tidak ditemukan.

#### `POST /api/household/members`
- **Akses:** User
- **Body Request:**
  - `panggilan` (`string`, wajib)
  - `kelompok_umur` (`"BALITA" | "ANAK" | "DEWASA" | "LANSIA"`, wajib)
  - `kebutuhan_khusus` (`string | null`, opsional)
```json
{
  "panggilan": "Adik Raka",
  "kelompok_umur": "BALITA",
  "kebutuhan_khusus": "Alergi susu sapi"
}
```
- **Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Anggota keluarga ditambahkan",
  "data": {
    "id": "uuid-member",
    "household_id": "uuid-household",
    "panggilan": "Adik Raka",
    "kelompok_umur": "BALITA",
    "kebutuhan_khusus": "Alergi susu sapi"
  }
}
```

#### `PUT /api/household/members/:id`
- **Akses:** User (hanya anggota milik household sendiri)
- **Body Request:** parsial dari schema `POST /api/household/members`.
```json
{
  "kebutuhan_khusus": "Perlu inhaler asma"
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Anggota keluarga diperbarui",
  "data": {
    "id": "uuid-member",
    "household_id": "uuid-household",
    "panggilan": "Adik Raka",
    "kelompok_umur": "BALITA",
    "kebutuhan_khusus": "Perlu inhaler asma"
  }
}
```
- **Error khusus:** `404 Not Found` jika anggota tidak ditemukan atau bukan milik user.

#### `DELETE /api/household/members/:id`
- **Akses:** User (hanya anggota milik household sendiri)
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Anggota keluarga dihapus",
  "data": null
}
```

---

### D. Wilayah & Risiko Bencana (`/api/regions`, `/api/risk`)

#### `GET /api/regions`
- **Akses:** Publik
- **Keterangan:** Mengembalikan seluruh wilayah `kab_kota: "Kota Bengkulu"` beserta `hazard_zones` dan `assembly_points`.
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Daftar wilayah berhasil diambil",
  "data": [
    {
      "id": 1,
      "kode_wilayah": "17.71.01.1001",
      "kecamatan": "Teluk Segara",
      "kab_kota": "Kota Bengkulu",
      "hazard_zones": [
        {
          "id": 1,
          "region_id": 1,
          "jenis_bencana": "TSUNAMI",
          "tingkat": "TINGGI",
          "sumber": "BPBD Kota Bengkulu / inaRISK BNPB"
        }
      ],
      "assembly_points": [
        {
          "id": 1,
          "region_id": 1,
          "nama": "Lapangan Merdeka Bengkulu",
          "lat": -3.7924,
          "lng": 102.2655
        }
      ]
    }
  ]
}
```

#### `GET /api/risk`
- **Akses:** Opsional (`optionalAuth`)
- **Query Params:**
  - `region_id` (`integer`, opsional jika sudah login dan household punya `region_id`)
  - `lat` (`number`, opsional; fallback ke `household.lat` jika login)
  - `lng` (`number`, opsional; fallback ke `household.lng` jika login)
- **Contoh pemanggilan:** `GET /api/risk?region_id=1&lat=-3.7928&lng=102.2608`
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Data risiko wilayah berhasil diambil",
  "data": {
    "wilayah": {
      "id": 1,
      "kode_wilayah": "17.71.01.1001",
      "kecamatan": "Teluk Segara",
      "kab_kota": "Kota Bengkulu"
    },
    "zona_risiko": [
      {
        "id": 1,
        "region_id": 1,
        "jenis_bencana": "TSUNAMI",
        "tingkat": "TINGGI",
        "sumber": "BPBD Kota Bengkulu / inaRISK BNPB"
      }
    ],
    "titik_kumpul": [
      {
        "id": 1,
        "region_id": 1,
        "nama": "Lapangan Merdeka Bengkulu",
        "lat": -3.7924,
        "lng": 102.2655,
        "jarak_km": 0.52
      }
    ],
    "cuaca": {
      "tersedia": true,
      "sumber": "BMKG",
      "lokasi": {
        "desa": "Malabero",
        "kecamatan": "Teluk Segara",
        "kotkab": "Kota Bengkulu",
        "provinsi": "Bengkulu"
      },
      "saat_ini": {
        "waktu_lokal": "2026-11-23 07:00:00",
        "suhu_c": 27,
        "cuaca": "Hujan Ringan",
        "cuaca_en": "Light Rain",
        "kelembapan": 85,
        "kecepatan_angin_kmj": 12.5,
        "arah_angin": "SW",
        "curah_hujan_mm": 1.2,
        "ikon": "https://api-apps.bmkg.go.id/storage/icon/cuaca/hujan%20ringan-am.svg"
      },
      "prakiraan": [
        {
          "waktu_lokal": "2026-11-23 10:00:00",
          "suhu_c": 29,
          "cuaca": "Berawan",
          "cuaca_en": "Mostly Cloudy",
          "kelembapan": 78,
          "kecepatan_angin_kmj": 14.0,
          "arah_angin": "W",
          "curah_hujan_mm": 0,
          "ikon": "https://api-apps.bmkg.go.id/storage/icon/cuaca/berawan-am.svg"
        }
      ]
    }
  }
}
```
> **Catatan:**
> - Jika `lat`/`lng` tidak tersedia, `jarak_km` bernilai `null`.
> - Jika API BMKG timeout (>4 detik) atau gagal dihubungi, endpoint tetap mengembalikan `200 OK` dengan fallback `cuaca`: `{ "tersedia": false, "alasan": "...", "sumber": "BMKG", "saat_ini": null, "prakiraan": [] }`.
> - Error `400 Bad Request` jika `region_id` tidak dikirim dan user tidak login / household belum memiliki `region_id`.

---

### E. Tas Siaga Bencana (`/api/kit`)

#### `GET /api/kit`
- **Akses:** User
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Tas siaga berhasil diambil",
  "data": {
    "items": [
      {
        "id": "uuid-kit",
        "household_id": "uuid-household",
        "nama_item": "Air minum kemasan 6 liter",
        "status": true,
        "kadaluarsa": "2027-06-01T00:00:00.000Z"
      }
    ],
    "kesiapan": {
      "total": 1,
      "siap": 1,
      "persentase": 100
    }
  }
}
```

#### `POST /api/kit`
- **Akses:** User
- **Body Request:**
  - `nama_item` (`string`, wajib)
  - `status` (`boolean`, opsional, default `false`)
  - `kadaluarsa` (`ISO date string | null`, opsional)
```json
{
  "nama_item": "Kotak P3K & obat pribadi",
  "status": true,
  "kadaluarsa": "2027-12-31"
}
```
- **Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Item tas siaga ditambahkan",
  "data": {
    "id": "uuid-kit",
    "household_id": "uuid-household",
    "nama_item": "Kotak P3K & obat pribadi",
    "status": true,
    "kadaluarsa": "2027-12-31T00:00:00.000Z"
  }
}
```

#### `PATCH /api/kit/:id`
- **Akses:** User (hanya item milik household sendiri)
- **Body Request:** parsial dari `POST /api/kit`.
```json
{
  "status": false
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Item tas siaga diperbarui",
  "data": {
    "id": "uuid-kit",
    "household_id": "uuid-household",
    "nama_item": "Kotak P3K & obat pribadi",
    "status": false,
    "kadaluarsa": "2027-12-31T00:00:00.000Z"
  }
}
```

#### `DELETE /api/kit/:id`
- **Akses:** User (hanya item milik household sendiri)
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Item tas siaga dihapus",
  "data": null
}
```

---

### F. Simulasi & Latihan (`/api/drills`)

#### `GET /api/drills`
- **Akses:** User
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Daftar simulasi berhasil diambil",
  "data": {
    "drills": [
      {
        "id": "uuid-drill",
        "household_id": "uuid-household",
        "jadwal": "2026-11-30T09:00:00.000Z",
        "skor": 80
      }
    ],
    "rata_rata_skor": 80
  }
}
```
> **Catatan:** `rata_rata_skor` bernilai `null` jika belum ada simulasi yang memiliki skor.

#### `POST /api/drills`
- **Akses:** User
- **Body Request:**
  - `jadwal` (`ISO date string`, wajib)
  - `skor` (`integer` `0..100` `| null`, opsional)
```json
{
  "jadwal": "2026-12-01T08:00:00.000Z",
  "skor": null
}
```
- **Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Simulasi dicatat",
  "data": {
    "id": "uuid-drill",
    "household_id": "uuid-household",
    "jadwal": "2026-12-01T08:00:00.000Z",
    "skor": null
  }
}
```

#### `PATCH /api/drills/:id`
- **Akses:** User (hanya simulasi milik household sendiri)
- **Body Request:** parsial dari `POST /api/drills`.
```json
{
  "skor": 90
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Simulasi diperbarui",
  "data": {
    "id": "uuid-drill",
    "household_id": "uuid-household",
    "jadwal": "2026-12-01T08:00:00.000Z",
    "skor": 90
  }
}
```

---

### G. Kartu Darurat Publik (`/api/share/:token`)

#### `GET /api/share/:token`
- **Akses:** Publik (read-only; tidak menampilkan `email`, `password_hash`, maupun `user_id`)
- **Contoh akun demo:** `GET /api/share/demo-bengkulu-siagakeluarga-2026`
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Kartu darurat keluarga",
  "data": {
    "keluarga": "Keluarga Demo Bengkulu",
    "lokasi": {
      "kecamatan": "Teluk Segara",
      "kab_kota": "Kota Bengkulu"
    },
    "anggota": [
      {
        "panggilan": "Nenek Siti",
        "kelompok_umur": "LANSIA",
        "kebutuhan_khusus": "Menggunakan tongkat"
      }
    ],
    "zona_risiko": [
      {
        "jenis_bencana": "TSUNAMI",
        "tingkat": "TINGGI"
      }
    ],
    "titik_kumpul": [
      {
        "nama": "Lapangan Merdeka Bengkulu",
        "lat": -3.7924,
        "lng": 102.2655,
        "jarak_km": 0.52
      }
    ],
    "rencana_evakuasi": {
      "dibuat_pada": "2026-11-23T04:10:00.000Z",
      "model_ai": "gemini-3.8-flash",
      "konten": {
        "ringkasan_risiko": "...",
        "rencana_sebelum_bencana": ["..."],
        "langkah_saat_bencana": ["..."],
        "pembagian_tugas_keluarga": [
          {
            "anggota": "Ayah",
            "peran": "Koordinator evakuasi",
            "fokus_pendampingan": "Mendampingi Nenek Siti"
          }
        ],
        "rute_dan_titik_kumpul": "...",
        "kontak_darurat": ["BNPB: 117", "Basarnas/SAR: 115"]
      }
    }
  }
}
```
- **Error khusus:** `404 Not Found` jika `share_token` tidak ditemukan.

---

### H. Fitur AI (`/api/ai`)

> **Mekanisme model & fallback (`backend/src/services/ai.service.js`):**
> - Model chat utama: `process.env.GEMINI_MODEL || "gemini-3.8-flash"`, dengan urutan fallback otomatis `["gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite"]` bila terjadi error `503`, `502`, atau `429`.
> - Model embedding RAG: `gemini-embedding-001` (768 dimensi, L2-normalized, pencarian cosine similarity `pgvector`).
> - Kemungkinan status error AI: `503` (`GEMINI_API_KEY` kosong atau layanan sibuk), `429` (kuota/rate limit habis), `502` (permintaan ditolak atau format JSON AI tidak valid setelah 2 percobaan).

#### 1. `POST /api/ai/plan`
Menyusun rencana darurat keluarga berdasarkan konteks wilayah, zona ancaman, titik kumpul, dan daftar anggota keluarga milik user, lalu menyimpannya ke tabel `EmergencyPlan`.
- **Akses:** User
- **Body Request:** tidak diperlukan (kosong / `{}`).
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Rencana darurat keluarga berhasil dibuat",
  "data": {
    "id": "uuid-plan",
    "created_at": "2026-11-23T04:15:00.000Z",
    "model_ai": "gemini-3.8-flash",
    "konten": {
      "ringkasan_risiko": "Wilayah Kecamatan Teluk Segara memiliki risiko tinggi terhadap gempa bumi dan tsunami.",
      "rencana_sebelum_bencana": [
        "Siapkan tas siaga bencana di dekat pintu keluar termasuk obat rutin lansia.",
        "Kenali rute evakuasi menuju tempat tinggi dan Lapangan Merdeka Bengkulu."
      ],
      "langkah_saat_bencana": [
        "Saat gempa: lakukan Drop, Cover, Hold On hingga guncangan berhenti.",
        "Terapkan prinsip 20-20-20 bila guncangan terasa kuat/lama: segera evakuasi ke lokasi tinggi."
      ],
      "pembagian_tugas_keluarga": [
        {
          "anggota": "Ayah",
          "peran": "Membawa tas siaga & mematikan listrik",
          "fokus_pendampingan": "Mendampingi Nenek Siti menuju titik kumpul"
        },
        {
          "anggota": "Ibu",
          "peran": "Membawa dokumen penting & kotak P3K",
          "fokus_pendampingan": "Menggendong/mengawal Adik Raka"
        }
      ],
      "rute_dan_titik_kumpul": "Keluar ke arah timur menjauhi pantai menuju Lapangan Merdeka Bengkulu (-3.7924, 102.2655).",
      "kontak_darurat": [
        "BNPB (Pusdalops): 117",
        "SAR / Basarnas: 115",
        "Ambulans / Gawat Darurat Medis: 118 / 119",
        "Polisi: 110",
        "Pemadam Kebakaran: 113"
      ]
    }
  }
}
```

#### 2. `POST /api/ai/ask`
Tanya Siaga berbasis RAG: mencari 3 potongan panduan BNPB paling relevan di `GuideChunk` (via `pgvector`), lalu menghasilkan jawaban yang kontekstual (menyertakan profil keluarga jika user login).
- **Akses:** Opsional (`optionalAuth`)
- **Body Request:**
  - `pertanyaan` (`string`, wajib, 5–1000 karakter setelah trim)
```json
{
  "pertanyaan": "Apa yang harus dilakukan jika terjadi gempa kuat di pesisir Bengkulu?"
}
```
- **Respons `200 OK` (Normal):**
```json
{
  "success": true,
  "message": "Jawaban berhasil dibuat",
  "data": {
    "jawaban": "Saat gempa kuat terjadi, segera berlindung di bawah meja yang kokoh... Setelah guncangan berhenti, segera evakuasi ke dataran tinggi dengan prinsip 20-20-20.\n\nSumber: Buku Saku Tanggap Tangkas Tangguh Menghadapi Bencana (BNPB)",
    "referensi": [
      {
        "id": 1,
        "sumber": "Buku Saku Tanggap Tangkas Tangguh Menghadapi Bencana (BNPB)",
        "similarity": 0.8421
      },
      {
        "id": 2,
        "sumber": "Panduan Kesiapsiagaan Tsunami 20-20-20 (BMKG/BNPB)",
        "similarity": 0.7954
      }
    ]
  }
}
```
- **Respons `200 OK` (Fallback jika AI terkena 429/503):**
  - `message`: `"AI sedang dibatasi kuota; menampilkan potongan panduan relevan"`
  - `data.jawaban` tetap berisi potongan panduan BNPB paling relevan dari hasil pencarian vektor.
- **Error khusus:** `409 Conflict` jika tabel `GuideChunk` belum memiliki embedding (`reindex-guides` belum dijalankan).

#### 3. `POST /api/ai/quiz`
Membuat tepat **5 soal** pilihan ganda simulasi darurat yang kontekstual dengan profil keluarga user (validasi ketat dengan Zod).
- **Akses:** User
- **Body Request:**
  - `jenis_bencana` (`"GEMPA" | "TSUNAMI" | "BANJIR" | "LONGSOR" | "CUACA_EKSTREM"`, opsional — jika dikosongkan, AI memilih sesuai ancaman wilayah keluarga)
```json
{
  "jenis_bencana": "GEMPA"
}
```
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Kuis berhasil dibuat",
  "data": {
    "jenis_bencana": "GEMPA",
    "soal": [
      {
        "id": 1,
        "pertanyaan": "Gempa kuat mengguncang rumah pada malam hari saat Nenek Siti berada di kamar. Langkah pertama yang paling tepat adalah...",
        "pilihan": [
          "Langsung berlari keluar rumah melewati kaca jendela",
          "Berlindung di tempat aman (Drop, Cover, Hold On) sambil melindungi kepala dan mendampingi lansia",
          "Mencari barang berharga terlebih dahulu di lemari",
          "Menyalakan kompor untuk penerangan"
        ],
        "jawaban_benar_index": 1,
        "penjelasan": "Sesuai SOP BNPB, saat guncangan berlangsung lindungi kepala dan tubuh di tempat aman hingga guncangan mereda sebelum evakuasi."
      }
    ]
  }
}
```
> **Catatan:** Array `soal` selalu berisi tepat **5 item** dengan `id` `1..5`, `pilihan` tepat 4 string, dan `jawaban_benar_index` integer `0..3`. Jika `jenis_bencana` tidak dikirim di body, field `data.jenis_bencana` bernilai `null`.

---

### I. Admin (`/api/admin`)

#### `POST /api/admin/reindex-guides`
Menghitung ulang embedding vektor 768-dimensi (`gemini-embedding-001`) untuk seluruh baris di tabel `GuideChunk`.
- **Akses:** Admin (`Authorization: Bearer <JWT>` dengan `role: "ADMIN"`)
- **Body Request:** tidak diperlukan.
- **Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Reindex selesai: 6/6 panduan",
  "data": {
    "total": 6,
    "indexed": 6,
    "failed": []
  }
}
```
