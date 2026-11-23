import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import prisma from '../lib/prisma.js';

// gemini-2.5-flash sudah tidak tersedia untuk akun baru; bisa diganti lewat env GEMINI_MODEL
export const CHAT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
export const EMBED_MODEL = 'gemini-embedding-001';
export const EMBED_DIM = 768;

let client;
const getClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || /your_gemini_api_key/i.test(key)) {
    throw aiError(503, 'Layanan AI belum dikonfigurasi (GEMINI_API_KEY kosong).');
  }
  client ||= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
};

export const aiError = (statusCode, message, extra = {}) =>
  Object.assign(new Error(message), { statusCode, ...extra });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Terjemahkan error SDK Gemini menjadi error ramah pengguna
const friendly = (err) => {
  console.error('[Gemini]', err?.status || '', String(err?.message || err).slice(0, 300));
  if (err?.statusCode && err.isAiError) return err;
  const code = err?.status || err?.code || err?.error?.code;
  const msg = String(err?.message || '');
  if (code === 429 || /RESOURCE_EXHAUSTED|quota|rate/i.test(msg)) {
    return Object.assign(
      aiError(429, 'Kuota/batas permintaan AI gratis sedang habis. Mohon tunggu sekitar satu menit lalu coba lagi.'),
      { isAiError: true, rateLimited: true },
    );
  }
  if (code === 503 || code === 500 || /overloaded|UNAVAILABLE/i.test(msg)) {
    return Object.assign(aiError(503, 'Layanan AI sedang sibuk. Silakan coba lagi beberapa saat lagi.'), {
      isAiError: true,
    });
  }
  if (code === 400 || code === 401 || code === 403) {
    return Object.assign(aiError(502, 'Permintaan ke layanan AI ditolak. Periksa konfigurasi GEMINI_API_KEY.'), {
      isAiError: true,
    });
  }
  return Object.assign(aiError(502, 'Layanan AI gagal merespons. Silakan coba lagi.'), { isAiError: true });
};

// Panggilan dengan retry ringan untuk 503 / 429 sementara
const withRetry = async (fn, attempts = 3) => {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err?.isAiError || err?.statusCode) throw err;
      last = friendly(err);
      if (i < attempts - 1 && (last.statusCode === 503 || last.rateLimited)) {
        await sleep(1500 * (i + 1) ** 2);
        continue;
      }
      throw last;
    }
  }
  throw last;
};

// ---------- Embedding ----------
export const embedText = (text, taskType = 'RETRIEVAL_DOCUMENT') =>
  withRetry(async () => {
    const res = await getClient().models.embedContent({
      model: EMBED_MODEL,
      contents: text,
      config: { outputDimensionality: EMBED_DIM, taskType },
    });
    const values = res.embeddings?.[0]?.values;
    if (!values || values.length !== EMBED_DIM) throw new Error('Embedding tidak valid');
    // Normalisasi (dimensi terpotong tidak otomatis ter-normalisasi)
    const norm = Math.sqrt(values.reduce((s, v) => s + v * v, 0)) || 1;
    return values.map((v) => v / norm);
  });

const toVectorString = (arr) => `[${arr.join(',')}]`;

export const reindexGuides = async () => {
  const chunks = await prisma.$queryRaw`SELECT id, sumber, isi FROM "GuideChunk" ORDER BY id`;
  let indexed = 0;
  const failed = [];
  for (const c of chunks) {
    try {
      const vec = toVectorString(await embedText(`${c.sumber}\n${c.isi}`, 'RETRIEVAL_DOCUMENT'));
      await prisma.$executeRaw`UPDATE "GuideChunk" SET embedding = ${vec}::vector WHERE id = ${c.id}`;
      indexed++;
    } catch (err) {
      failed.push({ id: c.id, error: err.message });
      if (err.rateLimited) break;
    }
  }
  return { total: chunks.length, indexed, failed };
};

export const searchGuides = async (question, limit = 3) => {
  const queryVector = toVectorString(await embedText(question, 'RETRIEVAL_QUERY'));
  const rows = await prisma.$queryRaw`
    SELECT id, sumber, isi, 1 - (embedding <=> ${queryVector}::vector) AS similarity
    FROM "GuideChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${queryVector}::vector
    LIMIT ${limit}`;
  return rows.map((r) => ({ ...r, similarity: Number(r.similarity) }));
};

// ---------- Konteks keluarga ----------
export const loadHouseholdContext = async (userId) => {
  const household = await prisma.household.findUnique({
    where: { user_id: userId },
    include: {
      members: true,
      region: { include: { hazard_zones: true, assembly_points: true } },
    },
  });
  return household;
};

export const describeHousehold = (h, { detailed = true } = {}) => {
  if (!h) return 'Profil keluarga belum diisi.';
  const lines = [];
  if (h.region) {
    lines.push(`Wilayah: Kecamatan ${h.region.kecamatan}, ${h.region.kab_kota}.`);
    if (h.region.hazard_zones.length) {
      lines.push(
        'Zona ancaman: ' + h.region.hazard_zones.map((z) => `${z.jenis_bencana} (risiko ${z.tingkat})`).join('; ') + '.',
      );
    }
    if (detailed && h.region.assembly_points.length) {
      lines.push(
        'Titik kumpul terdekat: ' +
          h.region.assembly_points.map((a) => `${a.nama} (${a.lat}, ${a.lng})`).join('; ') +
          '.',
      );
    }
  } else {
    lines.push('Wilayah belum ditentukan.');
  }
  lines.push(
    h.members.length
      ? 'Anggota keluarga: ' +
          h.members
            .map((m) => `${m.panggilan} [${m.kelompok_umur}${m.kebutuhan_khusus ? `, kebutuhan khusus: ${m.kebutuhan_khusus}` : ''}]`)
            .join('; ') +
          '.'
      : 'Belum ada anggota keluarga terdaftar.',
  );
  return lines.join('\n');
};

// ---------- Generasi ----------
// Model utama lalu cadangan jika model sedang overload (503) / kena limit (429)
const MODEL_CHAIN = [...new Set([CHAT_MODEL, 'gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.7-flash'])];

const generateWithFallback = async (contents, config) => {
  let last;
  for (const model of MODEL_CHAIN) {
    try {
      const text = await withRetry(async () => {
        const res = await getClient().models.generateContent({ model, contents, config });
        if (!res.text) throw new Error('Respons kosong');
        return res.text;
      }, 2);
      return { text, model };
    } catch (err) {
      last = err;
      if (!(err.statusCode === 503 || err.rateLimited || err.statusCode === 502)) throw err;
    }
  }
  throw last;
};

const generateText = async (prompt, systemInstruction) =>
  (await generateWithFallback(prompt, { systemInstruction, temperature: 0.3 })).text;

const generateStructured = async (prompt, systemInstruction, responseSchema, zodSchema) => {
  let lastIssue;
  for (let attempt = 0; attempt < 2; attempt++) {
    const { text, model } = await generateWithFallback(
      attempt && lastIssue ? `${prompt}\n\nPerbaiki: output sebelumnya tidak valid (${lastIssue}).` : prompt,
      { systemInstruction, responseMimeType: 'application/json', responseSchema, temperature: 0.5 },
    );
    try {
      const parsed = zodSchema.safeParse(JSON.parse(text));
      if (parsed.success) return { data: parsed.data, model };
      lastIssue = parsed.error.issues[0]?.message;
    } catch {
      lastIssue = 'JSON tidak dapat di-parse';
    }
  }
  throw Object.assign(aiError(502, 'AI menghasilkan format yang tidak valid. Silakan coba lagi.'), { isAiError: true });
};

const S = Type;
const strArr = { type: S.ARRAY, items: { type: S.STRING } };

// ---------- Fitur 1: Rencana darurat ----------
const planZod = z.object({
  ringkasan_risiko: z.string().min(1),
  rencana_sebelum_bencana: z.array(z.string()).min(1),
  langkah_saat_bencana: z.array(z.string()).min(1),
  pembagian_tugas_keluarga: z.array(
    z.object({ anggota: z.string(), peran: z.string(), fokus_pendampingan: z.string() }),
  ),
  rute_dan_titik_kumpul: z.string().min(1),
  kontak_darurat: z.array(z.string()).min(1),
});
const planSchema = {
  type: S.OBJECT,
  properties: {
    ringkasan_risiko: { type: S.STRING },
    rencana_sebelum_bencana: strArr,
    langkah_saat_bencana: strArr,
    pembagian_tugas_keluarga: {
      type: S.ARRAY,
      items: {
        type: S.OBJECT,
        properties: {
          anggota: { type: S.STRING },
          peran: { type: S.STRING },
          fokus_pendampingan: { type: S.STRING },
        },
        required: ['anggota', 'peran', 'fokus_pendampingan'],
      },
    },
    rute_dan_titik_kumpul: { type: S.STRING },
    kontak_darurat: strArr,
  },
  required: [
    'ringkasan_risiko',
    'rencana_sebelum_bencana',
    'langkah_saat_bencana',
    'pembagian_tugas_keluarga',
    'rute_dan_titik_kumpul',
    'kontak_darurat',
  ],
};

const SYSTEM_BASE =
  'Kamu adalah asisten kesiapsiagaan bencana untuk keluarga di Kota Bengkulu, Indonesia. ' +
  'Gunakan Bahasa Indonesia yang jelas dan praktis, berpedoman pada panduan BNPB/BMKG. Jangan mengarang fakta.';

export const generateEmergencyPlan = async (userId, householdId) => {
  const h = await loadHouseholdContext(userId);
  const context = describeHousehold(h);
  const { data: plan, model } = await generateStructured(
    `Susun rencana darurat keluarga berdasarkan data berikut.\n\n${context}\n\n` +
      'Ketentuan: pembagian_tugas_keluarga harus mencakup SEMUA anggota (anggota dewasa mendampingi balita/lansia/yang punya kebutuhan khusus). ' +
      'Langkah saat bencana harus spesifik sesuai ancaman wilayah (mis. gempa: lindungi diri lalu evakuasi tsunami berpedoman 20-20-20 bila di pesisir). ' +
      'kontak_darurat berisi nomor resmi, mis. BNPB 117, SAR 115, Ambulans 118/119, Polisi 110, Pemadam 113 (sebutkan beserta fungsinya).',
    SYSTEM_BASE,
    planSchema,
    planZod,
  );
  const saved = await prisma.emergencyPlan.create({
    data: { household_id: householdId, konten: plan, model_ai: model },
  });
  return { id: saved.id, created_at: saved.created_at, model_ai: saved.model_ai, konten: plan };
};

// ---------- Fitur 2: Tanya Siaga (chat AI + RAG) ----------
const SYSTEM_TANYA =
  SYSTEM_BASE +
  ' Namamu "Tanya Siaga", asisten AI di aplikasi SiagaKeluarga.' +
  ' Fokus HANYA pada topik bencana dan kesiapsiagaan: gempa, tsunami, banjir, longsor, cuaca ekstrem, kebakaran, erupsi gunung api,' +
  ' P3K dasar saat bencana, tas siaga, evakuasi, titik kumpul, rencana keluarga, pemulihan pascabencana, dan cara memakai aplikasi ini.' +
  ' Jika pertanyaan di luar topik tersebut, tolak dengan sopan dalam satu kalimat lalu tawarkan bantuan seputar kesiapsiagaan.' +
  ' Jika pengguna tampak sedang dalam bahaya SAAT INI, awali jawaban dengan tindakan keselamatan terpenting dan sebutkan nomor darurat 112.' +
  ' Jawab ringkas (umumnya di bawah 200 kata). Gunakan daftar bernomor untuk langkah berurutan dan "-" untuk poin, boleh **tebal** untuk hal penting.' +
  ' Jangan memberi diagnosis medis. Jangan mengarang nomor telepon, alamat, atau status peringatan terkini;' +
  ' arahkan ke aplikasi/situs resmi BMKG (bmkg.go.id), InaRISK, atau BPBD setempat untuk informasi terbaru.';

const tokenKata = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);

// Cari potongan panduan relevan. Tidak pernah melempar galat: bila index/embedding tidak tersedia,
// asisten tetap menjawab dari pengetahuan umum Gemini.
const cariPanduan = async (pertanyaan) => {
  try {
    const rows = await searchGuides(pertanyaan, 3);
    const berskor = rows.filter((r) => Number.isFinite(r.similarity));
    if (berskor.length) return berskor.filter((r) => r.similarity >= 0.5);
    // Database tiruan (tanpa pgvector): pakai pencocokan kata kunci sederhana
    const kata = new Set(tokenKata(pertanyaan));
    if (!kata.size) return [];
    return rows
      .map((r) => ({
        ...r,
        similarity: tokenKata(`${r.sumber} ${r.isi}`).filter((w) => kata.has(w)).length / kata.size,
      }))
      .filter((r) => r.similarity >= 0.2)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);
  } catch (err) {
    console.warn('[Tanya] Pencarian panduan dilewati:', String(err?.message || err).slice(0, 200));
    return [];
  }
};

// Riwayat percakapan dari klien -> format multi-turn Gemini (selalu diawali giliran user)
const susunRiwayat = (riwayat = []) => {
  const turns = riwayat
    .slice(-10)
    .map((m) => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: String(m.text).slice(0, 2000) }] }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  return turns;
};

export const askRag = async (pertanyaan, userId, riwayat = []) => {
  const chunks = await cariPanduan(pertanyaan);
  const h = userId ? await loadHouseholdContext(userId).catch(() => null) : null;
  const referensi = chunks.map((c) => ({ id: c.id, sumber: c.sumber, similarity: Number(c.similarity.toFixed(4)) }));

  const context = chunks.map((c, i) => `[${i + 1}] Sumber: ${c.sumber}\n${c.isi}`).join('\n\n');
  const prompt =
    (chunks.length ? `KONTEKS PANDUAN RESMI (utamakan ini):\n${context}\n\n` : '') +
    (h ? `PROFIL KELUARGA PENANYA:\n${describeHousehold(h, { detailed: false })}\n\n` : '') +
    `PERTANYAAN: ${pertanyaan}\n\n` +
    (chunks.length
      ? 'Jawab praktis dan akurat, utamakan konteks panduan di atas; boleh dilengkapi pengetahuan umum kebencanaan yang sesuai pedoman BNPB/BMKG.'
      : 'Jawab praktis dan akurat berdasarkan pedoman umum BNPB/BMKG.') +
    (h ? ' Sesuaikan saran dengan profil keluarga bila relevan.' : '');

  const contents = [...susunRiwayat(riwayat), { role: 'user', parts: [{ text: prompt }] }];

  try {
    const { text: jawaban } = await generateWithFallback(contents, { systemInstruction: SYSTEM_TANYA, temperature: 0.4 });
    return { jawaban, referensi, fallback: false };
  } catch (err) {
    if (chunks.length && (err.rateLimited || err.statusCode === 503)) {
      // Fallback: tampilkan potongan panduan terdekat tanpa generasi AI
      const jawaban =
        `${err.message}\n\nSementara itu, berikut potongan panduan BNPB yang paling relevan:\n\n` +
        chunks.map((c) => `• ${c.isi}\n  (Sumber: ${c.sumber})`).join('\n\n');
      return { jawaban, referensi, fallback: true };
    }
    throw err;
  }
};

// ---------- Fitur 3: Kuis ----------
const quizZod = z.object({
  soal: z
    .array(
      z.object({
        id: z.number().int(),
        pertanyaan: z.string().min(1),
        pilihan: z.array(z.string().min(1)).length(4),
        jawaban_benar_index: z.number().int().min(0).max(3),
        penjelasan: z.string().min(1),
      }),
    )
    .length(5),
});
const quizSchema = {
  type: S.OBJECT,
  properties: {
    soal: {
      type: S.ARRAY,
      items: {
        type: S.OBJECT,
        properties: {
          id: { type: S.INTEGER },
          pertanyaan: { type: S.STRING },
          pilihan: strArr,
          jawaban_benar_index: { type: S.INTEGER },
          penjelasan: { type: S.STRING },
        },
        required: ['id', 'pertanyaan', 'pilihan', 'jawaban_benar_index', 'penjelasan'],
      },
    },
  },
  required: ['soal'],
};

export const generateQuiz = async (userId, jenisBencana) => {
  const h = await loadHouseholdContext(userId);
  const prompt =
    `Buat TEPAT 5 soal pilihan ganda simulasi darurat yang kontekstual dengan keluarga berikut.\n\n${describeHousehold(h, { detailed: false })}\n\n` +
    (jenisBencana ? `Fokus jenis bencana: ${jenisBencana}.` : 'Pilih jenis bencana sesuai ancaman wilayah keluarga.') +
    '\nSetiap soal berupa skenario (mis. gempa malam hari bersama lansia/balita), punya 4 pilihan, jawaban_benar_index 0-3 ' +
    '(variasikan posisi jawaban benar), id berurutan 1-5, dan penjelasan edukatif berdasarkan SOP BNPB.';
  const { data } = await generateStructured(prompt, SYSTEM_BASE, quizSchema, quizZod);
  return { jenis_bencana: jenisBencana || null, soal: data.soal };
};
