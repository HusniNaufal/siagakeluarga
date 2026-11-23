import { getBmkgForecast } from '../services/bmkg.service.js';
import { resolveAdm4, cariTempat } from '../services/wilayah.service.js';

// Prakiraan BMKG diperbarui tiap 3 jam; cache singkat cukup dan melindungi API publik BMKG.
const FORECAST_TTL_MS = 15 * 60 * 1000;
const forecastCache = new Map();

const forecastFor = async (kode) => {
  const hit = forecastCache.get(kode);
  if (hit && Date.now() - hit.at < FORECAST_TTL_MS) return hit.value;
  const value = await getBmkgForecast(kode);
  // Jangan menyimpan kegagalan, supaya percobaan berikutnya langsung mencoba lagi.
  if (value.tersedia) {
    if (forecastCache.size > 300) forecastCache.delete(forecastCache.keys().next().value);
    forecastCache.set(kode, { value, at: Date.now() });
  }
  return value;
};

// GET /api/cuaca?lat=&lng=  (publik, tanpa login)
export const getCuaca = async (req, res, next) => {
  try {
    const { lat, lng } = req.validated.query;

    let wilayah;
    try {
      wilayah = await resolveAdm4(lat, lng);
    } catch (err) {
      console.error('[wilayah]', String(err?.message || err).slice(0, 200));
      return res.status(502).json({
        success: false,
        message: 'Layanan pencarian wilayah sedang tidak dapat dihubungi. Coba lagi sebentar lagi.',
      });
    }
    if (!wilayah) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi ini tidak ditemukan sebagai wilayah di Indonesia.',
      });
    }

    const cuaca = await forecastFor(wilayah.kode);
    res.json({
      success: true,
      message: cuaca.tersedia ? 'Prakiraan cuaca berhasil diambil' : 'Prakiraan BMKG belum tersedia',
      data: { wilayah, cuaca },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/lokasi/cari?q=  (publik)
export const cariLokasi = async (req, res, next) => {
  try {
    const { q } = req.validated.query;
    let hasil;
    try {
      hasil = await cariTempat(q);
    } catch (err) {
      console.error('[cari]', String(err?.message || err).slice(0, 200));
      return res.status(502).json({
        success: false,
        message: 'Pencarian lokasi sedang tidak dapat dihubungi. Coba lagi sebentar lagi.',
      });
    }
    res.json({ success: true, message: 'Hasil pencarian lokasi', data: hasil });
  } catch (err) {
    next(err);
  }
};
