# Backend

Express.js + Prisma + Supabase PostgreSQL.

Setup awal (Backend Developer):
```bash
npm init -y
npm i express cors helmet zod jsonwebtoken bcrypt multer express-rate-limit @prisma/client @google/genai node-cron
npm i -D prisma nodemon
npx prisma migrate dev --name init
```
Aktifkan ekstensi `vector` di Supabase (SQL editor: `create extension if not exists vector;`).
Endpoint wajib `GET /health` untuk uptime ping.
