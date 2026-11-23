// Koordinat -> kode wilayah BMKG (adm4).
//
// BMKG hanya menerima kode kelurahan/desa (adm4), bukan koordinat. Alurnya:
//   1. Nominatim (OpenStreetMap) membalik koordinat menjadi nama desa/kecamatan/kab.
//   2. wilayah.id (kode Kemendagri terbaru, selaras dengan BMKG) memberi kodenya.
// Kode lama (mis. emsifa) TIDAK cocok dengan BMKG, jangan dipakai.

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';
const WILAYAH = 'https://wilayah.id/api';
const UA = 'SiagaKeluarga/1.0 (IT RUSH 2026; mitigasi bencana)';
const TIMEOUT_MS = 5000;

const TTL_MS = 24 * 60 * 60 * 1000; // nama wilayah jarang berubah
const cache = new Map();

const remember = (key, value) => {
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  cache.set(key, { value, at: Date.now() });
  return value;
};
const recall = (key) => {
  const hit = cache.get(key);
  return hit && Date.now() - hit.at < TTL_MS ? hit.value : undefined;
};

const getJson = async (url) => {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: 'application/json', 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`${new URL(url).host} merespons ${res.status}`);
  return res.json();
};

// "Kabupaten Bandung" / "KEC. Dayeuhkolot" / "Kel. Citeureup" -> "bandung" / "dayeuhkolot" / "citeureup"
const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\b(kabupaten|kab\.?|kota administrasi|kota|kecamatan|kec\.?|kelurahan|kel\.?|desa|provinsi|prov\.?|daerah khusus ibukota|daerah istimewa)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Kunci alamat Nominatim TIDAK konsisten antar daerah (di Bengkulu `county` berisi kecamatan,
// di Jakarta `city` berisi nama provinsi). Jadi semua nilai alamat dipakai sebagai kandidat
// nama, dan dicocokkan bertingkat: provinsi -> kab/kota -> kecamatan -> desa.
const NAME_KEYS = [
  'state', 'state_district', 'county', 'city', 'town', 'municipality', 'city_district',
  'district', 'subdistrict', 'suburb', 'village', 'hamlet', 'neighbourhood', 'quarter',
];

const DESA_KEYS = ['village', 'hamlet', 'suburb', 'neighbourhood', 'quarter'];

const candidatesOf = (addr) =>
  NAME_KEYS.filter((k) => addr[k]).map((k) => ({ key: k, value: String(addr[k]) }));

// Cari entri yang paling cocok dengan salah satu kandidat. Sama persis menang atas
// "saling mengandung". Untuk kab/kota, awalan Kota/Kabupaten dipakai agar
// "Kota Bandung" tidak tertukar dengan "Kabupaten Bandung".
const pick = (list, candidates) => {
  let best = null;
  let bestScore = 0;
  for (const item of list) {
    const itemNorm = norm(item.name);
    if (itemNorm.length < 3) continue;
    for (const c of candidates) {
      const candNorm = norm(c.value);
      if (candNorm.length < 3) continue;
      let score = 0;
      if (item.name.toLowerCase() === c.value.toLowerCase()) score = 4;
      else if (itemNorm === candNorm) score = 2;
      else if (itemNorm.includes(candNorm) || candNorm.includes(itemNorm)) score = 1;
      if (!score) continue;
      const isKota = /^kota\b/i.test(item.name);
      const isKab = /^kabupaten\b/i.test(item.name);
      if (c.key === 'city' && isKota) score += 0.5;
      if ((c.key === 'county' || c.key === 'state_district') && isKab) score += 0.5;
      if (score > bestScore) {
        best = item;
        bestScore = score;
      }
    }
  }
  return best;
};

const listOf = async (path) => {
  const key = `w:${path}`;
  const hit = recall(key);
  if (hit) return hit;
  const json = await getJson(`${WILAYAH}/${path}.json`);
  return remember(key, json.data ?? []);
};

const reverse = async (lat, lng) => {
  const key = `r:${lat.toFixed(3)},${lng.toFixed(3)}`;
  const hit = recall(key);
  if (hit) return hit;
  const json = await getJson(
    `${NOMINATIM}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=id`,
  );
  return remember(key, json.address ?? null);
};

/**
 * @returns {Promise<{kode:string, desa:string|null, kecamatan:string|null, kotkab:string|null, provinsi:string|null, tepat:boolean}|null>}
 *   `tepat` false bila desa tidak cocok dan dipakai desa lain di kecamatan yang sama.
 */
export const resolveAdm4 = async (lat, lng) => {
  const addr = await reverse(lat, lng);
  if (!addr || addr.country_code !== 'id') return null;

  const candidates = candidatesOf(addr);

  const prov = pick(await listOf('provinces'), candidates);
  if (!prov) return null;
  const kab = pick(await listOf(`regencies/${prov.code}`), candidates);
  if (!kab) return null;
  const kec = pick(await listOf(`districts/${kab.code}`), candidates);
  if (!kec) return null;

  const desaList = await listOf(`villages/${kec.code}`);
  // Desa hanya dicocokkan dengan kunci setingkat desa, supaya nama kecamatan yang
  // kebetulan sama dengan nama desa (mis. Dayeuhkolot) tidak salah terpilih.
  const desa = pick(desaList, candidates.filter((c) => DESA_KEYS.includes(c.key)));
  const chosen = desa ?? desaList[0];
  if (!chosen) return null;

  return {
    kode: chosen.code,
    desa: chosen.name,
    kecamatan: kec.name,
    kotkab: kab.name,
    provinsi: prov.name,
    tepat: Boolean(desa),
  };
};

/**
 * Cari tempat berdasarkan nama (kelurahan, kecamatan, kota) di Indonesia.
 * Dijalankan atas permintaan pengguna (tekan cari), BUKAN per ketikan: kebijakan Nominatim
 * melarang autocomplete. Hasil disimpan di cache agar pencarian yang sama tidak diulang.
 */
export const cariTempat = async (q) => {
  const kunci = `s:${q.toLowerCase().trim()}`;
  const hit = recall(kunci);
  if (hit) return hit;
  const json = await getJson(
    `${NOMINATIM.replace('/reverse', '/search')}?format=jsonv2&limit=5&countrycodes=id&addressdetails=1&accept-language=id&q=${encodeURIComponent(q)}`,
  );
  const hasil = (Array.isArray(json) ? json : [])
    .map((x) => ({
      nama: String(x.display_name ?? '').split(',').slice(0, 3).join(',').trim(),
      lengkap: x.display_name,
      lat: Number(Number(x.lat).toFixed(4)),
      lng: Number(Number(x.lon).toFixed(4)),
    }))
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng));
  return remember(kunci, hasil);
};
