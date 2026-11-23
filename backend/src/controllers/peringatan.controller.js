import { randomBytes, timingSafeEqual } from 'node:crypto';
import prisma from '../lib/prisma.js';
import { susunPeringatan } from '../services/cuaca.service.js';
import { kirimPesanTelegram, telegramAktif } from '../services/telegram.service.js';

const rumahSaya = (userId) => prisma.household.findUnique({ where: { user_id: userId } });

const samaPersis = (a, b) => {
  const x = Buffer.from(String(a ?? ''));
  const y = Buffer.from(String(b ?? ''));
  return x.length === y.length && timingSafeEqual(x, y);
};

// GET /api/peringatan  (pemilik): status pengingat untuk rumah ini + status Telegram
export const lihatPeringatan = async (req, res, next) => {
  try {
    const household = await rumahSaya(req.user.id);
    if (!household) return res.status(404).json({ success: false, message: 'Keluarga belum dibuat' });
    const peringatan = await susunPeringatan(household);
    res.json({
      success: true,
      message: 'Pengingat bersiap',
      data: {
        ...peringatan,
        telegram: {
          tersedia: telegramAktif(),
          terhubung: Boolean(household.telegram_chat_id),
          bot: process.env.TELEGRAM_BOT_USERNAME || null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/peringatan/telegram/kode  (pemilik): buat kode sekali pakai untuk menghubungkan grup
export const buatKodeTelegram = async (req, res, next) => {
  try {
    if (!telegramAktif()) {
      return res.status(503).json({ success: false, message: 'Pengiriman lewat Telegram belum dikonfigurasi di server.' });
    }
    const household = await rumahSaya(req.user.id);
    if (!household) return res.status(404).json({ success: false, message: 'Keluarga belum dibuat' });
    const kode = randomBytes(4).toString('hex').toUpperCase();
    await prisma.household.update({ where: { id: household.id }, data: { telegram_kode: kode } });
    res.json({ success: true, message: 'Kode dibuat', data: { kode, bot: process.env.TELEGRAM_BOT_USERNAME || null } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/peringatan/telegram  (pemilik): putuskan grup
export const putuskanTelegram = async (req, res, next) => {
  try {
    const household = await rumahSaya(req.user.id);
    if (!household) return res.status(404).json({ success: false, message: 'Keluarga belum dibuat' });
    await prisma.household.update({
      where: { id: household.id },
      data: { telegram_chat_id: null, telegram_kode: null },
    });
    res.json({ success: true, message: 'Grup Telegram diputuskan', data: null });
  } catch (err) {
    next(err);
  }
};

// POST /api/telegram/webhook  (dipanggil Telegram; dilindungi TELEGRAM_WEBHOOK_SECRET)
// Pesan "/hubungkan KODE" di grup menautkan grup itu ke keluarga pemilik kode.
export const webhookTelegram = async (req, res) => {
  const rahasia = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!rahasia || !samaPersis(req.get('x-telegram-bot-api-secret-token'), rahasia)) {
    return res.status(401).json({ success: false, message: 'Tidak diizinkan' });
  }
  // Setelah lolos verifikasi selalu balas 200 agar Telegram tidak mengulang kiriman.
  try {
    const pesan = req.body?.message;
    const teks = String(pesan?.text ?? '').trim();
    const cocok = teks.match(/^\/hubungkan(?:@\w+)?\s+([A-Za-z0-9]{8})$/);
    if (pesan?.chat?.id && cocok) {
      const household = await prisma.household.findFirst({ where: { telegram_kode: cocok[1].toUpperCase() } });
      if (household) {
        await prisma.household.update({
          where: { id: household.id },
          data: { telegram_chat_id: String(pesan.chat.id), telegram_kode: null },
        });
        await kirimPesanTelegram(
          pesan.chat.id,
          'Grup ini terhubung ke SiagaKeluarga. Pengingat bersiap akan dikirim ke sini saat cuaca perlu diwaspadai.',
        );
      } else {
        await kirimPesanTelegram(pesan.chat.id, 'Kode tidak dikenali atau sudah dipakai. Buat kode baru di aplikasi SiagaKeluarga.');
      }
    }
  } catch (err) {
    console.error('[telegram]', String(err?.message || err).slice(0, 200));
  }
  res.json({ success: true });
};

const JEDA_ULANG_MS = 12 * 60 * 60 * 1000;

// POST /api/cron/peringatan  (dipanggil penjadwal; dilindungi CRON_SECRET)
export const jalankanPeringatan = async (req, res, next) => {
  try {
    const rahasia = process.env.CRON_SECRET;
    const auth = req.get('authorization') ?? '';
    if (!rahasia || !samaPersis(auth, `Bearer ${rahasia}`)) {
      return res.status(401).json({ success: false, message: 'Tidak diizinkan' });
    }
    if (!telegramAktif()) {
      return res.status(503).json({ success: false, message: 'TELEGRAM_BOT_TOKEN belum diisi' });
    }

    const daftar = (await prisma.household.findMany({ where: { telegram_chat_id: { not: null } } })) ?? [];
    const base = (process.env.FRONTEND_URL || (process.env.CORS_ORIGINS ?? '').split(',')[0] || '').trim().replace(/\/$/, '');
    let terkirim = 0;
    let dilewati = 0;

    for (const h of daftar.slice(0, 200)) {
      try {
        const p = await susunPeringatan(h);
        if (!p.tersedia) {
          dilewati += 1;
          continue;
        }
        if (p.tingkat === 'aman') {
          if (h.peringatan_terakhir_tingkat && h.peringatan_terakhir_tingkat !== 'aman') {
            await prisma.household.update({ where: { id: h.id }, data: { peringatan_terakhir_tingkat: 'aman' } });
          }
          dilewati += 1;
          continue;
        }
        const baru = h.peringatan_terakhir_tingkat !== p.tingkat;
        const lama = !h.peringatan_terakhir_at || Date.now() - new Date(h.peringatan_terakhir_at).getTime() > JEDA_ULANG_MS;
        if (!baru && !lama) {
          dilewati += 1;
          continue;
        }

        const tautan = base ? `\n\nRencana keluarga: ${base}/r/${h.share_token}` : '';
        await kirimPesanTelegram(h.telegram_chat_id, `${p.kalimat}${tautan}`);
        await prisma.household.update({
          where: { id: h.id },
          data: { peringatan_terakhir_at: new Date(), peringatan_terakhir_tingkat: p.tingkat },
        });
        terkirim += 1;
      } catch (err) {
        console.error('[cron]', h.id, String(err?.message || err).slice(0, 160));
        dilewati += 1;
      }
    }
    res.json({ success: true, message: 'Selesai', data: { diperiksa: daftar.length, terkirim, dilewati } });
  } catch (err) {
    next(err);
  }
};
