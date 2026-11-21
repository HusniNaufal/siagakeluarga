# Backend Architecture & Coding Rules

## Tech Stack
- Runtime: Node.js (ES Modules / `"type": "module"`)
- Framework: Express.js
- Database: PostgreSQL (Supabase)
- ORM: Prisma ORM
- Deployment: Vercel Serverless

## Standard API Response Format
Semua endpoint WAJIB mengembalikan format JSON yang konsisten:
- Sukses:
  `{ "success": true, "message": "Pesan singkat", "data": ... }`
- Error:
  `{ "success": false, "message": "Penjelasan error" }`

## Coding Conventions
1. Pisahkan logic ke dalam `routes/` dan `controllers/` saat fitur bertambah.
2. Selalu bungkus operasi async/database dengan `try-catch` dan teruskan error ke `next(err)`.
3. Jangan hardcode API key atau URL database; selalu ambil dari `process.env`.
4. Gunakan Prisma Client dari `src/config/prisma.js`, jangan membuat `new PrismaClient()` berulang kali.