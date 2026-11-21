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
process.exit(0);
