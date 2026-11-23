import { Router } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as auth from '../controllers/auth.controller.js';
import * as household from '../controllers/household.controller.js';
import * as region from '../controllers/region.controller.js';
import * as cuaca from '../controllers/cuaca.controller.js';
import * as kit from '../controllers/kit.controller.js';
import * as drill from '../controllers/drill.controller.js';
import * as share from '../controllers/share.controller.js';
import * as kabar from '../controllers/kabar.controller.js';
import * as peringatan from '../controllers/peringatan.controller.js';

import { aiRouter, adminRouter } from './ai.routes.js';

const router = Router();

// ---------- Schemas ----------
const kelompokUmur = z.enum(['BALITA', 'ANAK', 'DEWASA', 'LANSIA']);
const idParam = z.object({ id: z.string().min(1) });

const registerSchema = z.object({
  nama: z.string().trim().min(1, 'Nama wajib diisi'),
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});
const loginSchema = z.object({
  email: z.string().trim().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});
const householdUpdateSchema = z.object({
  region_id: z.number().int().nullable().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  regenerate_share_token: z.boolean().optional(),
});
const memberCreateSchema = z.object({
  panggilan: z.string().trim().min(1),
  kelompok_umur: kelompokUmur,
  kebutuhan_khusus: z.string().trim().nullable().optional(),
});
const memberUpdateSchema = memberCreateSchema.partial();
const riskQuery = z.object({
  region_id: z.coerce.number().int().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});
const kitCreateSchema = z.object({
  nama_item: z.string().trim().min(1),
  status: z.boolean().optional(),
  kadaluarsa: z.coerce.date().nullable().optional(),
});
const kitUpdateSchema = kitCreateSchema.partial();
const drillCreateSchema = z.object({
  jadwal: z.coerce.date(),
  skor: z.number().int().min(0).max(100).nullable().optional(),
});
const drillUpdateSchema = drillCreateSchema.partial();

// ---------- Routes ----------
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Auth
router.post('/auth/register', validate({ body: registerSchema }), auth.register);
router.post('/auth/login', validate({ body: loginSchema }), auth.login);
router.get('/auth/me', authenticate, auth.me);

// Household & members
router.get('/household', authenticate, household.getHousehold);
router.put('/household', authenticate, validate({ body: householdUpdateSchema }), household.updateHousehold);
router.post('/household/members', authenticate, validate({ body: memberCreateSchema }), household.addMember);
router.put(
  '/household/members/:id',
  authenticate,
  validate({ params: idParam, body: memberUpdateSchema }),
  household.updateMember,
);
router.delete('/household/members/:id', authenticate, validate({ params: idParam }), household.deleteMember);

// Cuaca berdasarkan koordinat (publik): koordinat -> kode desa -> prakiraan BMKG
router.get(
  '/cuaca',
  validate({
    query: z.object({
      lat: z.coerce.number().min(-11.5).max(6.5),
      lng: z.coerce.number().min(94.5).max(141.5),
    }),
  }),
  cuaca.getCuaca,
);

router.get(
  '/lokasi/cari',
  validate({ query: z.object({ q: z.string().trim().min(3, 'Ketik minimal 3 huruf').max(80) }) }),
  cuaca.cariLokasi,
);

// Regions & risk
router.get('/regions', region.listRegions);
router.get('/risk', optionalAuth, validate({ query: riskQuery }), region.getRisk);

// Kit
router.get('/kit', authenticate, kit.listKit);
router.post('/kit', authenticate, validate({ body: kitCreateSchema }), kit.createKitItem);
router.patch('/kit/:id', authenticate, validate({ params: idParam, body: kitUpdateSchema }), kit.updateKitItem);
router.delete('/kit/:id', authenticate, validate({ params: idParam }), kit.deleteKitItem);

// Drills
router.get('/drills', authenticate, drill.listDrills);
router.post('/drills', authenticate, validate({ body: drillCreateSchema }), drill.createDrill);
router.patch('/drills/:id', authenticate, validate({ params: idParam, body: drillUpdateSchema }), drill.updateDrill);

// Public emergency card
router.get('/share/:token', share.getShareCard);

// Kabar keluarga ("Saya aman"): publik lewat tautan rencana, tanpa login.
const tokenParam = z.object({ token: z.string().trim().min(8).max(64) });
const kabarSchema = z
  .object({
    member_id: z.string().trim().min(1).max(64).optional(),
    nama: z.string().trim().min(1).max(40).optional(),
    status: z.enum(['AMAN', 'BUTUH_BANTUAN']),
    lat: z.coerce.number().min(-11.5).max(6.5).optional(),
    lng: z.coerce.number().min(94.5).max(141.5).optional(),
    pesan: z.string().trim().max(140).optional(),
  })
  .refine((v) => (v.lat === undefined) === (v.lng === undefined), { message: 'lat dan lng harus diisi bersama' });
router.post('/share/:token/checkin', validate({ params: tokenParam, body: kabarSchema }), kabar.kirimKabar);
router.get('/share/:token/kabar', validate({ params: tokenParam }), kabar.lihatKabarPublik);
router.get('/kabar', authenticate, kabar.lihatKabarSaya);
router.delete('/kabar', authenticate, kabar.hapusKabarSaya);

// Pengingat bersiap ke grup keluarga: tombol WhatsApp di aplikasi + Telegram otomatis (opsional).
router.get('/peringatan', authenticate, peringatan.lihatPeringatan);
router.post('/peringatan/telegram/kode', authenticate, peringatan.buatKodeTelegram);
router.delete('/peringatan/telegram', authenticate, peringatan.putuskanTelegram);
router.post('/telegram/webhook', peringatan.webhookTelegram);
router.post('/cron/peringatan', peringatan.jalankanPeringatan);

// AI (Gemini + RAG) & admin
router.use('/ai', aiRouter);
router.use('/admin', adminRouter);

export default router;
