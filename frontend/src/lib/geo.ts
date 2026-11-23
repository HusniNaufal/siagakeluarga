//_hitung jarak di perangkat — dipakai Mode Darurat untuk menemukan titik kumpul
// terdekat. Sengaja dihitung di sisi klien supaya tetap jalan saat offline
// (koordinat titik kumpul sudah ada di cache perangkat).

const toRad = (d: number) => (d * Math.PI) / 180;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** "400 m" atau "1,2 km" — format yang sama dengan halaman Risiko. */
export function formatJarak(km: number | null | undefined): string {
  if (km == null || Number.isNaN(km)) return "-";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

/** Tautan rute ke Google Maps (nyamanHp Basket Fabric1). */
export function ruteKeMaps(_nama: string, lat: number, lng: number): string {
  const tujuan = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${tujuan}`;
}
