process.env.PORT = '3055';
await import('../src/app.js');
const base = 'http://localhost:3055/api';
const show = async (label, res) => {
  const j = await res.json();
  console.log(`\n== ${label} -> ${res.status}`);
  console.log(JSON.stringify(j).slice(0, 600));
  return j;
};
const login = await show('POST /auth/login', await fetch(`${base}/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'demo@siagakeluarga.id', password: 'demo1234' }),
}));
const auth = { Authorization: `Bearer ${login.data.token}` };
await show('GET /auth/me', await fetch(`${base}/auth/me`, { headers: auth }));
await show('GET /household', await fetch(`${base}/household`, { headers: auth }));
await show('GET /kit', await fetch(`${base}/kit`, { headers: auth }));
await show('GET /drills', await fetch(`${base}/drills`, { headers: auth }));
await show('GET /regions', await fetch(`${base}/regions`));
await show('GET /risk (login)', await fetch(`${base}/risk`, { headers: auth }));
await show('GET /risk?region_id', await fetch(`${base}/risk?region_id=1`));
await show('GET /share/demo', await fetch(`${base}/share/demo-bengkulu-siagakeluarga-2026`));
await show('login salah', await fetch(`${base}/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'x', password: '' }),
}));
// ---------- Fitur AI ----------
const checks = [];
const check = (name, ok) => { checks.push([name, ok]); console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}`); };
const post = (path, body, headers = {}) => fetch(`${base}${path}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body ?? {}),
});

const ask = await post('/ai/ask', { pertanyaan: 'Apa itu prinsip 20-20-20 pada tsunami?' }, auth);
const askJ = await show('POST /ai/ask', ask);
check('ask 200', ask.status === 200);
check('ask jawaban + referensi', typeof askJ.data?.jawaban === 'string' && askJ.data.referensi?.length > 0
  && askJ.data.referensi.every((r) => r.sumber && typeof r.similarity === 'number'));
await show('ask pertanyaan pendek', await post('/ai/ask', { pertanyaan: 'hi' }));

const plan = await post('/ai/plan', {}, auth);
const planJ = await show('POST /ai/plan', plan);
const k = planJ.data?.konten ?? {};
check('plan 200', plan.status === 200);
check('plan schema', typeof k.ringkasan_risiko === 'string' && Array.isArray(k.rencana_sebelum_bencana)
  && Array.isArray(k.langkah_saat_bencana) && Array.isArray(k.pembagian_tugas_keluarga)
  && typeof k.rute_dan_titik_kumpul === 'string' && Array.isArray(k.kontak_darurat));

const quiz = await post('/ai/quiz', {}, auth);
const quizJ = await show('POST /ai/quiz', quiz);
const soal = quizJ.data?.soal ?? [];
check('quiz 200', quiz.status === 200);
check('quiz 5 soal valid', soal.length === 5 && soal.every((s) => s.pilihan?.length === 4
  && Number.isInteger(s.jawaban_benar_index) && s.jawaban_benar_index >= 0 && s.jawaban_benar_index <= 3
  && s.pertanyaan && s.penjelasan));

const failed = checks.filter(([, ok]) => !ok).length;
console.log(`\nAI checks: ${checks.length - failed}/${checks.length} lulus`);
process.exit(failed ? 1 : 0);
