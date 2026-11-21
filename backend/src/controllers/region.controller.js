import prisma from '../lib/prisma.js';
import { getBmkgForecast } from '../services/bmkg.service.js';
import { sortAssemblyPoints } from '../services/geo.service.js';

export const listRegions = async (req, res, next) => {
  try {
    const regions = await prisma.region.findMany({
      where: { kab_kota: 'Kota Bengkulu' },
      include: { hazard_zones: true, assembly_points: true },
      orderBy: { id: 'asc' },
    });
    res.json({ success: true, message: 'Daftar wilayah berhasil diambil', data: regions });
  } catch (err) {
    next(err);
  }
};

export const getRisk = async (req, res, next) => {
  try {
    const q = req.validated?.query ?? {};
    let regionId = q.region_id;
    let lat = q.lat;
    let lng = q.lng;

    // Fallback ke household user yang login
    if (!regionId && req.user) {
      const h = await prisma.household.findUnique({ where: { user_id: req.user.id } });
      if (h) {
        regionId = h.region_id ?? undefined;
        lat = lat ?? h.lat ?? undefined;
        lng = lng ?? h.lng ?? undefined;
      }
    }
    if (!regionId) {
      return res.status(400).json({
        success: false,
        message: 'region_id wajib diisi (query) atau login dengan household yang memiliki wilayah',
      });
    }

    const region = await prisma.region.findUnique({
      where: { id: regionId },
      include: { hazard_zones: true, assembly_points: true },
    });
    if (!region) return res.status(404).json({ success: false, message: 'Wilayah tidak ditemukan' });

    const cuaca = await getBmkgForecast(region.kode_wilayah);

    res.json({
      success: true,
      message: 'Data risiko wilayah berhasil diambil',
      data: {
        wilayah: {
          id: region.id,
          kode_wilayah: region.kode_wilayah,
          kecamatan: region.kecamatan,
          kab_kota: region.kab_kota,
        },
        zona_risiko: region.hazard_zones,
        titik_kumpul: sortAssemblyPoints(region.assembly_points, lat, lng),
        cuaca,
      },
    });
  } catch (err) {
    next(err);
  }
};
