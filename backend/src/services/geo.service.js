const toRad = (d) => (d * Math.PI) / 180;

export const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
};

// Urutkan titik kumpul dari yang terdekat bila koordinat tersedia
export const sortAssemblyPoints = (points, lat, lng) => {
  if (lat == null || lng == null) return points.map((p) => ({ ...p, jarak_km: null }));
  return points
    .map((p) => ({ ...p, jarak_km: Number(haversineKm(lat, lng, p.lat, p.lng).toFixed(2)) }))
    .sort((a, b) => a.jarak_km - b.jarak_km);
};
