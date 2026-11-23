import { getBmkgForecast } from './bmkg.service.js';
import { resolveAdm4 } from './wilayah.service.js';

// Prakiraan BMKG diperbarui tiap 3 jam; cache singkat cukup dan melindungi API publik BMKG.
const FORECAST_TTL_MS = 15 * 60 * 1000;
const forecastCache = new Map();

export const forecastFor = async (kode) => {
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

const jam = (waktuLokal) => (waktuLokal ? String(waktuLokal).slice(11, 16) : '');

/**
 * Pengingat bersiap untuk satu rumah, dari prakiraan BMKG di lokasinya.
 * BUKAN peringatan dini resmi: ambang berasal dari bmkg.service (hitungStatus) dan kalimatnya sengaja
 * berbunyi "pengingat bersiap" serta mengarahkan ke BMKG/BPBD.
 */
export const susunPeringatan = async (household) => {
  if (household.lat == null || household.lng == null) {
    return { tersedia: false, alasan: 'Lokasi rumah belum diisi.' };
  }
  let wilayah;
  try {
    wilayah = await resolveAdm4(household.lat, household.lng);
  } catch {
    return { tersedia: false, alasan: 'Lokasi belum bisa dicocokkan dengan wilayah BMKG.' };
  }
  if (!wilayah) return { tersedia: false, alasan: 'Lokasi di luar wilayah yang dikenali.' };

  const cuaca = await forecastFor(wilayah.kode);
  if (!cuaca.tersedia) return { tersedia: false, alasan: 'Prakiraan BMKG belum tersedia.' };

  const s = cuaca.status;
  const tempat = [wilayah.desa, wilayah.kecamatan].filter(Boolean).join(', ');
  const ringkasan =
    s.tingkat === 'aman'
      ? `Tidak ada hujan deras dalam 24 jam ke depan di ${tempat}.`
      : `${s.cuaca} diperkirakan sekitar pukul ${jam(s.waktu_lokal)} di ${tempat} (${s.curah_hujan_mm} mm).`;

  const kalimat =
    s.tingkat === 'aman'
      ? null
      : `Pengingat bersiap dari SiagaKeluarga (${s.tingkat === 'bahaya' ? 'bahaya' : 'waspada'}): ${ringkasan} ` +
        'Cek tas siaga dan titik kumpul. Ini bukan peringatan dini resmi, ikuti arahan BMKG dan BPBD. Darurat: 112.';

  return { tersedia: true, tingkat: s.tingkat, ringkasan, kalimat, wilayah: tempat };
};
