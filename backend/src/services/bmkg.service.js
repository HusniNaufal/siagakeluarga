const BMKG_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
const TIMEOUT_MS = 4000;

const fallback = (alasan) => ({
  tersedia: false,
  alasan,
  sumber: 'BMKG',
  saat_ini: null,
  prakiraan: [],
});

// Status bantu untuk tampilan. Ini ambang sederhana milik aplikasi, BUKAN peringatan
// dini resmi BMKG. Peringatan resmi tetap mengikuti BMKG/BPBD.
//   bahaya : ada petir, atau hujan >= 20 mm dalam satu jendela 3 jam
//   waspada: hujan sedang/lebat, atau >= 10 mm dalam satu jendela 3 jam
const hitungStatus = (entries) => {
  const ringkas = (tingkat, e) => ({
    tingkat,
    waktu_lokal: e?.local_datetime ?? null,
    cuaca: e?.weather_desc ?? null,
    curah_hujan_mm: e ? Number(e.tp) || 0 : null,
  });
  let waspada = null;
  for (const e of entries) {
    const desc = String(e.weather_desc ?? '').toLowerCase();
    const mm = Number(e.tp) || 0;
    if (desc.includes('petir') || mm >= 20) return ringkas('bahaya', e);
    if (!waspada && (desc.includes('lebat') || desc.includes('sedang') || mm >= 10)) waspada = e;
  }
  return waspada ? ringkas('waspada', waspada) : ringkas('aman', null);
};

// Ambil prakiraan cuaca BMKG; tidak pernah melempar error (fallback aman).
export const getBmkgForecast = async (kodeWilayah) => {
  if (!kodeWilayah) return fallback('Kode wilayah tidak tersedia');

  try {
    const res = await fetch(`${BMKG_URL}?adm4=${encodeURIComponent(kodeWilayah)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return fallback(`API BMKG merespons ${res.status}`);

    const json = await res.json();
    const entry = json?.data?.[0];
    const entries = (entry?.cuaca ?? []).flat();
    if (!entries.length) return fallback('Data prakiraan BMKG kosong');

    const now = Date.now();
    const toTime = (e) => new Date(String(e.utc_datetime || e.datetime).replace(' ', 'T') + (String(e.utc_datetime || '').endsWith('Z') ? '' : 'Z')).getTime();
    const sorted = entries
      .map((e) => ({ e, t: toTime(e) }))
      .filter((x) => !Number.isNaN(x.t))
      .sort((a, b) => a.t - b.t);

    // Entri terdekat dengan waktu sekarang
    const current = sorted.reduce(
      (best, x) => (Math.abs(x.t - now) < Math.abs(best.t - now) ? x : best),
      sorted[0],
    );
    const upcoming = sorted.filter((x) => x.t >= now).slice(0, 8);

    const simplify = (e) => ({
      waktu_lokal: e.local_datetime,
      suhu_c: e.t,
      cuaca: e.weather_desc,
      cuaca_en: e.weather_desc_en,
      kelembapan: e.hu,
      kecepatan_angin_kmj: e.ws,
      arah_angin: e.wd,
      curah_hujan_mm: e.tp,
      ikon: e.image,
    });

    // Ringkasan per hari lokal (3 hari pertama): suhu min/maks, total hujan, kondisi dominan.
    const byDay = new Map();
    for (const x of sorted) {
      const key = String(x.e.local_datetime).slice(0, 10);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(x.e);
    }
    const harian = [...byDay.entries()].slice(0, 3).map(([tanggal, arr]) => {
      const total = arr.reduce((sum, e) => sum + (Number(e.tp) || 0), 0);
      const basah = arr.reduce((a, b) => ((Number(b.tp) || 0) > (Number(a.tp) || 0) ? b : a), arr[0]);
      const wakil = total > 0 ? basah : arr[Math.floor(arr.length / 2)];
      const suhu = arr.map((e) => Number(e.t)).filter((n) => !Number.isNaN(n));
      return {
        tanggal,
        suhu_min_c: suhu.length ? Math.min(...suhu) : null,
        suhu_maks_c: suhu.length ? Math.max(...suhu) : null,
        curah_hujan_mm: Number(total.toFixed(1)),
        cuaca: wakil.weather_desc,
      };
    });

    return {
      tersedia: true,
      diperbarui: entries[0]?.analysis_date ?? null,
      status: hitungStatus(upcoming.map((x) => x.e)),
      harian,
      sumber: 'BMKG',
      lokasi: entry?.lokasi
        ? {
            desa: entry.lokasi.desa,
            kecamatan: entry.lokasi.kecamatan,
            kotkab: entry.lokasi.kotkab,
            provinsi: entry.lokasi.provinsi,
          }
        : null,
      saat_ini: simplify(current.e),
      prakiraan: upcoming.map((x) => simplify(x.e)),
    };
  } catch (err) {
    const timeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
    return fallback(timeout ? 'API BMKG timeout' : 'API BMKG tidak dapat dihubungi');
  }
};
