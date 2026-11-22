import { Router } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuth, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as ai from '../controllers/ai.controller.js';
import * as admin from '../controllers/admin.controller.js';

const askSchema = z.object({ pertanyaan: z.string().trim().min(5, 'Pertanyaan minimal 5 karakter').max(1000) });
const quizSchema = z.object({
  jenis_bencana: z.enum(['GEMPA', 'TSUNAMI', 'BANJIR', 'LONGSOR', 'CUACA_EKSTREM']).optional(),
});

// Dipasang di /api/ai
export const aiRouter = Router();
aiRouter.post('/plan', authenticate, ai.plan);
aiRouter.post('/ask', optionalAuth, validate({ body: askSchema }), ai.ask);
aiRouter.post('/quiz', authenticate, validate({ body: quizSchema }), ai.quiz);

// ---------- Skema admin ----------
const idParam = z.object({ id: z.string().min(1) });
const guideCreateSchema = z.object({
  sumber: z.string().trim().min(1, 'Sumber wajib diisi'),
  isi: z.string().trim().min(1, 'Isi wajib diisi'),
});
const guideUpdateSchema = guideCreateSchema.partial();

const hazardZoneCreateSchema = z.object({
  region_id: z.number().int(),
  jenis_bencana: z.enum(['GEMPA', 'TSUNAMI', 'BANJIR', 'LONGSOR', 'CUACA_EKSTREM']),
  tingkat: z.enum(['RENDAH', 'SEDANG', 'TINGGI']),
  sumber: z.string().trim().min(1, 'Sumber wajib diisi'),
});
const hazardZoneUpdateSchema = hazardZoneCreateSchema.partial();

const assemblyPointCreateSchema = z.object({
  region_id: z.number().int(),
  nama: z.string().trim().min(1, 'Nama wajib diisi'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
const assemblyPointUpdateSchema = assemblyPointCreateSchema.partial();

// Dipasang di /api/admin
export const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin);
adminRouter.post('/reindex-guides', ai.reindexGuides);

adminRouter.get('/guides', admin.listGuides);
adminRouter.post('/guides', validate({ body: guideCreateSchema }), admin.createGuide);
adminRouter.put('/guides/:id', validate({ params: idParam, body: guideUpdateSchema }), admin.updateGuide);
adminRouter.delete('/guides/:id', validate({ params: idParam }), admin.deleteGuide);

adminRouter.get('/hazard-zones', admin.listHazardZones);
adminRouter.post('/hazard-zones', validate({ body: hazardZoneCreateSchema }), admin.createHazardZone);
adminRouter.put('/hazard-zones/:id', validate({ params: idParam, body: hazardZoneUpdateSchema }), admin.updateHazardZone);
adminRouter.delete('/hazard-zones/:id', validate({ params: idParam }), admin.deleteHazardZone);

adminRouter.get('/assembly-points', admin.listAssemblyPoints);
adminRouter.post('/assembly-points', validate({ body: assemblyPointCreateSchema }), admin.createAssemblyPoint);
adminRouter.put(
  '/assembly-points/:id',
  validate({ params: idParam, body: assemblyPointUpdateSchema }),
  admin.updateAssemblyPoint,
);
adminRouter.delete('/assembly-points/:id', validate({ params: idParam }), admin.deleteAssemblyPoint);

export default aiRouter;
