# SiagaKeluarga — Backend REST API & AI Engine

Layanan backend untuk platform kesiapsiagaan bencana dan adaptasi perubahan iklim berbasis keluarga (**SiagaKeluarga**), dibangun dengan arsitektur REST API menggunakan **Express.js**, **Prisma 7**, **Supabase PostgreSQL (`pgvector`)**, integrasi prakiraan cuaca terbuka **BMKG**, dan **Google GenAI SDK (`@google/genai`)**.

---

## Tech Stack & Dependensi Utama

- **Runtime & Framework:** Node.js (ESM), Express.js, Vercel Serverless (`api/index.js`)
- **Database & ORM:** Supabase PostgreSQL + ekstensi `pgvector` (768 dimensi), Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`, `prisma7.config.ts`)
- **Keamanan & Validasi:** JSON Web Token (`jsonwebtoken`), `bcryptjs`, `helmet`, `cors`, `express-rate-limit`, Zod
- **Kecerdasan Artifisial (AI):** Google GenAI SDK (`@google/genai`)
  - **Model Generatif:** `gemini-3.8-flash` (dengan *auto-fallback* bertingkat ke `gemini-3.5-flash` dan `gemini-2.5-flash-lite`)
  - **Model Embedding:** `gemini-embedding-001` (768 dimensi untuk RAG *cosine similarity*)
- **Data Eksternal:** API Prakiraan Cuaca Terbuka BMKG (`api.bmkg.go.id`)

---

## Struktur Direktori (`backend/`)

```text
backend/
├── api/
│   └── index.js                 # Entrypoint Vercel Serverless
├── prisma/
│   ├── schema.prisma            # Skema 10 tabel database & relasi
│   └── seed.mjs                 # Seeder wilayah Kota Bengkulu, akun demo, & panduan BNPB
├── scripts/
│   ├── reindex-guides.mjs       # Generator embedding vektor 768-dimensi ke pgvector
│   └── smoke-test.mjs           # Pengujian end-to-end otomatis seluruh endpoint & AI
├── src/
│   ├── config/
│   │   └── prisma.js            # Inisialisasi PrismaClient + PrismaPg adapter
│   ├── controllers/             # Handler logika HTTP (auth, household, risk, kit, drills, ai)
│   ├── middlewares/             # Autentikasi JWT & validasi skema Zod
│   ├── routes/                  # Definisi routing REST API (/api/*)
│   ├── services/
│   │   └── ai.service.js        # Layanan Gemini (Rencana Darurat, Tanya Siaga RAG, Kuis)
│   └── app.js                   # Konfigurasi Express app & error handler
├── ARCHITECTURE.md              # Spesifikasi teknis & kontrak internal backend
├── prisma7.config.ts            # Konfigurasi koneksi migrasi Prisma 7
├── vercel.json                  # Konfigurasi routing rewrite Vercel Serverless
└── package.json
```

---

## Setup & Menjalankan di Lokal

### 1. Prasyarat Database (Supabase)
Buat project di **Supabase**, buka **SQL Editor**, lalu aktifkan ekstensi `vector`:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Instalasi & Konfigurasi Environment
```bash
cd backend
npm install
cp .env.example .env
```

Isi variabel berikut di dalam `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>[.pooler.supabase.com:6543/postgres?pgbouncer=true](https://.pooler.supabase.com:6543/postgres?pgbouncer=true)"
DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres"
JWT_SECRET="ganti_dengan_secret_key_acak_yang_kuat"
GEMINI_API_KEY="AIzaSy..."
# Opsional (default: gemini-3.8-flash dengan fallback otomatis)
# GEMINI_MODEL="gemini-3.5-flash"
```

### 3. Sinkronisasi Skema, Seeding Data, & Indeks Vektor AI
```bash
# Generate Prisma Client & dorong skema 10 tabel ke Supabase
npx prisma generate
npx prisma db push --config=./prisma7.config.ts

# Isi data awal Kota Bengkulu, akun demo, dan 6 dokumen pedoman resmi BNPB
node prisma/seed.mjs

# Bangun embedding vektor 768-dimensi (gemini-embedding-001) untuk fitur RAG Tanya Siaga
node scripts/reindex-guides.mjs
```

### 4. Jalankan Server & Pengujian Otomatis
```bash
# Menjalankan server pengembangan lokal (http://localhost:3000)
npm run dev

# Menjalankan pengujian otomatis end-to-end (Core API + 3 Fitur AI)
node scripts/smoke-test.mjs
```

---

## Kredensial Akun Demo (Pengujian & Juri)

| Parameter | Nilai |
|---|---|
| **Email** | `demo@siagakeluarga.id` |
| **Password** | `demo1234` |
| **Wilayah Contoh** | Kota Bengkulu (Zona Rawan Gempa Bumi & Tsunami) |
| **Token Kartu Darurat Publik** | `demo-bengkulu-siagakeluarga-2026` |

---

## Ringkasan Endpoint API

Base URL lokal: `http://localhost:3000/api` | Base URL produksi: `https://<domain-vercel>/api`

### Sistem & Kesehatan Server
- `GET /api/health` — *Health check* status server & uptime ping

### Autentikasi (`/api/auth`)
- `POST /api/auth/register` — Registrasi akun kepala keluarga baru
- `POST /api/auth/login` — Login & penerbitan token JWT
- `GET /api/auth/me` — Profil pengguna yang sedang login *(Bearer Token)*

### Profil Keluarga & Anggota (`/api/household`)
- `GET /api/household` — Detail rumah tangga, titik kumpul, & skor kesiapsiagaan *(Bearer Token)*
- `PUT /api/household` — Pembaruan profil rumah tangga & lokasi koordinat *(Bearer Token)*
- `POST /api/household/members` — Tambah anggota keluarga (termasuk kebutuhan khusus/lansia/balita) *(Bearer Token)*
- `PUT /api/household/members/:id` — Ubah data anggota keluarga *(Bearer Token)*
- `DELETE /api/household/members/:id` — Hapus anggota keluarga *(Bearer Token)*

### Wilayah, Analisis Risiko & Cuaca BMKG (`/api/regions`, `/api/risk`)
- `GET /api/regions` — Daftar kecamatan/wilayah beserta zona ancaman bencana
- `GET /api/risk` — Analisis tingkat risiko bencana keluarga & prakiraan cuaca terkini BMKG *(Bearer Token)*

### Tas Siaga, Simulasi & Kartu Darurat Publik
- `GET /api/kit` | `POST /api/kit` | `PATCH /api/kit/:id` | `DELETE /api/kit/:id` — Manajemen daftar perlengkapan tas siaga bencana *(Bearer Token)*
- `GET /api/drills` | `POST /api/drills` | `PATCH /api/drills/:id` — Jadwal dan pencatatan simulasi evakuasi keluarga *(Bearer Token)*
- `GET /api/share/:token` — Akses kartu darurat publik keluarga tanpa login (contoh: `/api/share/demo-bengkulu-siagakeluarga-2026`)

### Kecerdasan Artifisial Gemini (`/api/ai`)
- `POST /api/ai/plan` — Penyusunan rencana darurat terpersonalisasi (*Structured Output* JSON Schema: fase sebelum, saat, sesudah bencana, & pembagian tugas tiap anggota keluarga) *(Bearer Token)*
- `POST /api/ai/ask` — **Tanya Siaga**: asisten tanya-jawab darurat berbasis RAG (*pgvector cosine similarity*) dari korpus pedoman resmi BNPB dengan sitasi sumber *(Bearer Token)*
- `POST /api/ai/quiz` — Generator & evaluator kuis skenario darurat interaktif berbasis profil ancaman wilayah keluarga *(Bearer Token)*

---

## Deployment (Vercel Serverless)

1. Import repositori ke **Vercel** dan atur **Root Directory** ke `backend`.
2. Pastikan **Build Command** menjalankan `npm run build` (`prisma generate`).
3. Tambahkan 4 *Environment Variables* wajib di pengaturan proyek Vercel: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, dan `GEMINI_API_KEY`.
4. Verifikasi deployment dengan mengakses endpoint `GET /api/regions`.