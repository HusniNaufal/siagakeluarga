import prisma from '../lib/prisma.js';

/**
 * Ringkasan kabar keluarga: kabar TERBARU tiap anggota (dan tiap nama tamu yang bukan anggota terdaftar).
 * Dipakai oleh halaman publik tautan rencana dan oleh pemilik rencana.
 */
export const ringkasKabar = async (household) => {
  const rows =
    (await prisma.checkIn.findMany({
      where: { household_id: household.id },
      orderBy: { created_at: 'desc' },
    })) ?? [];

  const terbaru = new Map();
  for (const r of rows) {
    const kunci = r.member_id ? `m:${r.member_id}` : `n:${String(r.nama).trim().toLowerCase()}`;
    if (!terbaru.has(kunci)) terbaru.set(kunci, r);
  }

  const bentuk = (r) =>
    r
      ? { status: r.status, waktu: r.created_at, lat: r.lat ?? null, lng: r.lng ?? null, pesan: r.pesan ?? null }
      : null;

  const members = household.members ?? [];
  const anggota = members.map((m) => ({
    id: m.id,
    panggilan: m.panggilan,
    kelompok_umur: m.kelompok_umur,
    kabar: bentuk(terbaru.get(`m:${m.id}`)),
  }));

  const idAnggota = new Set(members.map((m) => `m:${m.id}`));
  const lainnya = [...terbaru.entries()]
    .filter(([kunci]) => !idAnggota.has(kunci))
    .map(([, r]) => ({ nama: r.nama, kabar: bentuk(r) }));

  const semua = [...anggota.map((a) => a.kabar), ...lainnya.map((l) => l.kabar)];
  return {
    anggota,
    lainnya,
    ringkasan: {
      aman: semua.filter((k) => k?.status === 'AMAN').length,
      butuh_bantuan: semua.filter((k) => k?.status === 'BUTUH_BANTUAN').length,
      belum: anggota.filter((a) => !a.kabar).length,
    },
  };
};
