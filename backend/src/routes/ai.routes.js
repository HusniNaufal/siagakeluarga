import { Router } from 'express';
import { z } from 'zod';
import { authenticate, optionalAuth, requireAdmin } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as ai from '../controllers/ai.controller.js';

const askSchema = z.object({ pertanyaan: z.string().trim().min(5, 'Pertanyaan minimal 5 karakter').max(1000) });
const quizSchema = z.object({
  jenis_bencana: z.enum(['GEMPA', 'TSUNAMI', 'BANJIR', 'LONGSOR', 'CUACA_EKSTREM']).optional(),
});

// Dipasang di /api/ai
export const aiRouter = Router();
aiRouter.post('/plan', authenticate, ai.plan);
aiRouter.post('/ask', optionalAuth, validate({ body: askSchema }), ai.ask);
aiRouter.post('/quiz', authenticate, validate({ body: quizSchema }), ai.quiz);

// Dipasang di /api/admin
export const adminRouter = Router();
adminRouter.post('/reindex-guides', authenticate, requireAdmin, ai.reindexGuides);

export default aiRouter;
