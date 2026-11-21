import * as ai from '../services/ai.service.js';
import { getOrCreateHousehold } from '../services/household.service.js';

export const reindexGuides = async (req, res, next) => {
  try {
    const result = await ai.reindexGuides();
    res.json({ success: true, message: `Reindex selesai: ${result.indexed}/${result.total} panduan`, data: result });
  } catch (err) {
    next(err);
  }
};

export const plan = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const data = await ai.generateEmergencyPlan(req.user.id, household.id);
    res.json({ success: true, message: 'Rencana darurat keluarga berhasil dibuat', data });
  } catch (err) {
    next(err);
  }
};

export const ask = async (req, res, next) => {
  try {
    const { jawaban, referensi, fallback } = await ai.askRag(req.body.pertanyaan, req.user?.id);
    res.json({
      success: true,
      message: fallback ? 'AI sedang dibatasi kuota; menampilkan potongan panduan relevan' : 'Jawaban berhasil dibuat',
      data: { jawaban, referensi },
    });
  } catch (err) {
    next(err);
  }
};

export const quiz = async (req, res, next) => {
  try {
    await getOrCreateHousehold(req.user.id);
    const data = await ai.generateQuiz(req.user.id, req.body?.jenis_bencana);
    res.json({ success: true, message: 'Kuis berhasil dibuat', data });
  } catch (err) {
    next(err);
  }
};
