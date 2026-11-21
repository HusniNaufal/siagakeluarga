const BMKG_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';
const TIMEOUT_MS = 4000;

const fallback = (alasan) => ({
  tersedia: false,
  alasan,
  sumber: 'BMKG',
  saat_ini: null,
  prakiraan: [],
});

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

    return {
      tersedia: true,
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
