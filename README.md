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
| Backend | Node.js, Express.js, Prisma ORM, Zod, JWT + bcrypt, express-rate-limit |
| Database | Supabase PostgreSQL (pgvector) |
| AI | Gemini API (`@google/genai`), structured output, RAG |
| Deploy | Vercel (frontend), Railway/Render (backend) |

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
cp .env.example .env     # isi DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npx prisma migrate dev
npm run dev

# frontend
cd frontend
cp .env.example .env     # isi VITE_API_URL
npm install
npm run dev
```

## Akun demo
| Peran | Username | Password |
|---|---|---|
| Pengguna | _(isi)_ | _(isi)_ |
| Admin | _(isi)_ | _(isi)_ |

## Penggunaan AI dalam pembuatan karya
| Aplikasi AI/API | Bagian yang didukung | Kustomisasi |
|---|---|---|
| Gemini API (Google) | Fitur AI di dalam website | Prompt, skema JSON, aturan keamanan dirancang tim |
| Claude (Anthropic) | Bantuan riset awal, draf proposal, saran struktur kode | Seluruh keluaran ditinjau, disunting, diverifikasi tim |
| _(tambahkan tool lain)_ | | |

## Hasil pengujian kualitas AI
_(isi hasil uji 20 profil keluarga: lolos skema, % butir rubrik terpenuhi)_

## Tim
| Nama | Peran |
|---|---|
| _(Ketua / PM)_ | Project Manager |
| _(isi)_ | Frontend Developer |
| _(isi)_ | Backend Developer |
| _(isi)_ | AI Engineer |
| _(isi)_ | UI/UX dan Dokumentasi |
