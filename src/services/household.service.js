import prisma from '../lib/prisma.js';

export const DEFAULT_REGION_KECAMATAN = 'Teluk Segara';

export const getDefaultRegion = () =>
  prisma.region.findFirst({
    where: { kecamatan: DEFAULT_REGION_KECAMATAN, kab_kota: 'Kota Bengkulu' },
  });

// Household milik user; dibuat otomatis jika belum ada
export const getOrCreateHousehold = async (userId) => {
  const existing = await prisma.household.findUnique({ where: { user_id: userId } });
  if (existing) return existing;
  const region = await getDefaultRegion();
  return prisma.household.create({
    data: { user_id: userId, region_id: region?.id ?? null },
  });
};

export const kitReadiness = (items) => {
  const total = items.length;
  const siap = items.filter((i) => i.status).length;
  return {
    total,
    siap,
    persentase: total === 0 ? 0 : Math.round((siap / total) * 100),
  };
};
