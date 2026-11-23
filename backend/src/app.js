import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

// Di belakang proxy (Vercel): ambil IP asli klien supaya pembatasan per-IP bekerja.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());

// CORS: daftar asal yang diizinkan lewat CORS_ORIGINS (pisah dengan koma).
// Tanpa CORS_ORIGINS: pengembangan lokal mengizinkan localhost, produksi menolak lintas-asal.
const allowed = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean);
if (isProd && allowed.length === 0) {
  console.warn('[cors] CORS_ORIGINS kosong di produksi: permintaan dari browser lintas-asal akan ditolak.');
}
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl, server-ke-server, health check
      if (allowed.includes(origin)) return cb(null, true);
      if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
      return cb(null, false);
    },
  }),
);

app.use(express.json({ limit: '100kb' }));

// ---------- Pembatasan laju ----------
const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message },
  });

// Login/daftar: cegah tebak password dan pembuatan akun massal.
app.use('/api/auth/login', limiter(15 * 60_000, 10, 'Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi.'));
app.use('/api/auth/register', limiter(60 * 60_000, 10, 'Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.'));
// AI: tiap panggilan memakai kuota Gemini.
app.use('/api/ai', limiter(10 * 60_000, 30, 'Terlalu banyak permintaan ke asisten AI. Tunggu sebentar lalu coba lagi.'));
// Cuaca publik: meneruskan permintaan ke Nominatim dan BMKG, yang tidak boleh dibanjiri.
app.use('/api/cuaca', limiter(60_000, 20, 'Terlalu banyak permintaan cuaca. Coba lagi sebentar lagi.'));
app.use('/api/lokasi', limiter(60_000, 15, 'Terlalu banyak pencarian lokasi. Coba lagi sebentar lagi.'));
// Kabar keluarga dari tautan publik: cukup longgar untuk satu keluarga, cukup ketat untuk mencegah banjir data.
app.use('/api/share', limiter(10 * 60_000, 60, 'Terlalu banyak permintaan. Coba lagi beberapa menit lagi.'));
// Telegram dan penjadwal: dilindungi rahasia, dan tetap dibatasi.
app.use('/api/telegram', limiter(60_000, 60, 'Terlalu banyak permintaan.'));
app.use('/api/cron', limiter(60_000, 6, 'Terlalu banyak permintaan.'));
// Batas umum untuk sisanya.
app.use('/api', limiter(15 * 60_000, 600, 'Terlalu banyak permintaan. Coba lagi beberapa menit lagi.'));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
