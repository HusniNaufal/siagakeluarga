# SiagaKeluarga

Platform penyusun rencana kedaruratan keluarga berbasis kecerdasan artifisial.
Subtema IT RUSH 2026: **Mitigasi Bencana dan Perubahan Iklim** (tahap prabencana).

- Live website: _(isi setelah deploy)_
- Video demo: _(isi link YouTube Unlisted)_

## Cara kerja (5 langkah)
1. **Cek lokasi**: website menentukan apakah lokasi rumah sering terdampak bencana dan jenis ancamannya.
2. **Rencana dari AI**: AI menyusun rencana kedaruratan (sebelum, saat, sesudah, tugas tiap anggota).
3. **Checklist peralatan**: pengguna mencentang peralatan siaga yang sudah dimiliki.
4. **Skor kesiapsiagaan**: kelengkapan rencana dan peralatan dihitung menjadi nilai 0-100.
5. **Latihan dan kuis**: jadwal latihan dan kuis skenario yang dinilai AI.

## Tech stack
| Bagian | Teknologi |
|---|---|
| Frontend | React + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Leaflet (OpenStreetMap) |
| Backend | Node.js, Express.js, Prisma 7 (`@prisma/adapter-pg`), Zod, JWT + bcryptjs, express-rate-limit, Integrasi API Terbuka BMKG |
| Database | Supabase PostgreSQL (pgvector) |
| AI | Google GenAI SDK (`@google/genai`: `gemini-3.8-flash` / `gemini-3.5-flash` & `gemini-embedding-001` 768-dimensi), Zod Structured Output, RAG pgvector (cosine similarity) |
| Deploy | Vercel Serverless (frontend & backend) |

## Struktur repo
```
frontend/   # React SPA
backend/    # Express REST API + Prisma
docs/       # kontrak API, aturan kontribusi
```

## Menjalankan lokal
```bash
# backend
cd backend
cp .env.example .env     # isi DATABASE_URL, DIRECT_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npx prisma db push --config=./prisma7.config.ts
node prisma/seed.mjs
node scripts/reindex-guides.mjs
npm run dev

# frontend
cd frontend
cp .env.example .env     # isi VITE_API_URL
npm install
npm run dev
```

## Akun demo
| Peran | Username / Email | Password |
|---|---|---|
| Pengguna | `demo@siagakeluarga.id` | `demo1234` |
| Admin | _(isi)_ | _(isi)_ |

> **Kartu darurat publik (tanpa login):** `/api/share/demo-bengkulu-siagakeluarga-2026`

## Penggunaan AI dalam pembuatan karya
| Aplikasi AI/API | Bagian yang didukung | Kustomisasi |
|---|---|---|
| Gemini API (Google) | Fitur AI di dalam website | Prompt, skema JSON, aturan keamanan dirancang tim |
| Claude (Anthropic) | Bantuan riset awal, draf proposal, saran struktur kode | Seluruh keluaran ditinjau, disunting, diverifikasi tim |
| Antigravity IDE (Claude Sonnet 5.5 & Gemini 4 Neon) | Perancangan skema database Prisma 7, implementasi REST API backend, pipeline RAG pgvector, dan verifikasi smoke-test | Pengembangan berbasis spesifikasi (`ARCHITECTURE.md` & `docs/api-contract.md`); seluruh kode, query SQL vektor, dan skema validasi Zod diverifikasi oleh tim |
| _(tambahkan tool lain)_ | | |

## Hasil pengujian kualitas AI
- **Verifikasi otomatis (`backend/scripts/smoke-test.mjs` & `reindex-guides.mjs`):**
  - 6/6 dokumen pedoman BNPB terindeks vektor 768 dimensi.
  - 6/6 pengujian endpoint AI (`/ask`, `/plan`, dan `/quiz`) lulus validasi skema JSON Zod dan akurasi sitasi RAG.
- **Uji evaluasi lengkap:** _(isi hasil uji 20 profil keluarga: lolos skema, % butir rubrik terpenuhi)_

## Tim
| Nama | Peran |
|---|---|
| Ihsan garutz | Project Manager |
| Azh Zhahir Ramadhan Putra | Frontend Developer |
| Muhammad Husni Naufal Kurniawan | Backend & AI Engineer |
| _(isi)_ | AI Engineer |
| _(isi)_ | UI/UX dan Dokumentasi |
