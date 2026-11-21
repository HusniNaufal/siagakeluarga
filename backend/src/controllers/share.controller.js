import prisma from '../lib/prisma.js';
import { sortAssemblyPoints } from '../services/geo.service.js';

// Kartu darurat publik: tidak memuat email, password_hash, atau id user
export const getShareCard = async (req, res, next) => {
  try {
    const household = await prisma.household.findUnique({
      where: { share_token: req.params.token },
      include: {
        user: { select: { nama: true } },
        region: { include: { assembly_points: true, hazard_zones: true } },
        members: true,
        emergency_plans: { orderBy: { created_at: 'desc' }, take: 1 },
      },
    });
    if (!household) {
      return res.status(404).json({ success: false, message: 'Kartu darurat tidak ditemukan' });
    }

    const region = household.region;
    const plan = household.emergency_plans[0];

    res.json({
      success: true,
      message: 'Kartu darurat keluarga',
      data: {
        keluarga: household.user.nama,
        lokasi: region
          ? { kecamatan: region.kecamatan, kab_kota: region.kab_kota }
          : null,
        anggota: household.members.map((m) => ({
          panggilan: m.panggilan,
          kelompok_umur: m.kelompok_umur,
          kebutuhan_khusus: m.kebutuhan_khusus,
        })),
        zona_risiko: region
          ? region.hazard_zones.map((z) => ({ jenis_bencana: z.jenis_bencana, tingkat: z.tingkat }))
          : [],
        titik_kumpul: region
          ? sortAssemblyPoints(region.assembly_points, household.lat, household.lng).map(
              ({ nama, lat, lng, jarak_km }) => ({ nama, lat, lng, jarak_km }),
            )
          : [],
        rencana_evakuasi: plan
          ? { dibuat_pada: plan.created_at, model_ai: plan.model_ai, konten: plan.konten }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};
