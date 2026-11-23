import { randomUUID } from 'node:crypto';
import prisma from '../lib/prisma.js';
import { getOrCreateHousehold, kitReadiness } from '../services/household.service.js';

export const getHousehold = async (req, res, next) => {
  try {
    const base = await getOrCreateHousehold(req.user.id);
    const household = await prisma.household.findUnique({
      where: { id: base.id },
      include: {
        region: true,
        members: true,
        kit_items: true,
        drills: { orderBy: { jadwal: 'desc' } },
        emergency_plans: { orderBy: { created_at: 'desc' }, take: 1 },
      },
    });
    res.json({
      success: true,
      message: 'Data keluarga berhasil diambil',
      data: { ...household, kesiapan_tas: kitReadiness(household.kit_items) },
    });
  } catch (err) {
    next(err);
  }
};

export const updateHousehold = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const { region_id, lat, lng, regenerate_share_token } = req.body;

    if (region_id != null) {
      const region = await prisma.region.findUnique({ where: { id: region_id } });
      if (!region) return res.status(404).json({ success: false, message: 'Wilayah tidak ditemukan' });
    }

    const data = {};
    if (region_id !== undefined) data.region_id = region_id;
    if (lat !== undefined) data.lat = lat;
    if (lng !== undefined) data.lng = lng;
    if (regenerate_share_token) data.share_token = randomUUID();

    const updated = await prisma.household.update({
      where: { id: household.id },
      data,
      include: {
        region: true,
        members: true,
        kit_items: true,
        drills: { orderBy: { jadwal: 'desc' } },
        emergency_plans: { orderBy: { created_at: 'desc' }, take: 1 },
      },
    });
    res.json({
      success: true,
      message: 'Data keluarga berhasil diperbarui',
      data: { ...updated, kesiapan_tas: kitReadiness(updated.kit_items || []) },
    });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const member = await prisma.member.create({
      data: { ...req.body, household_id: household.id },
    });
    res.status(201).json({ success: true, message: 'Anggota keluarga ditambahkan', data: member });
  } catch (err) {
    next(err);
  }
};

// Cek kepemilikan: member harus milik household user yang login
const findOwnedMember = async (userId, memberId) => {
  const household = await getOrCreateHousehold(userId);
  return prisma.member.findFirst({ where: { id: memberId, household_id: household.id } });
};

export const updateMember = async (req, res, next) => {
  try {
    const owned = await findOwnedMember(req.user.id, req.params.id);
    if (!owned) return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
    const member = await prisma.member.update({ where: { id: owned.id }, data: req.body });
    res.json({ success: true, message: 'Anggota keluarga diperbarui', data: member });
  } catch (err) {
    next(err);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    const owned = await findOwnedMember(req.user.id, req.params.id);
    if (!owned) return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan' });
    await prisma.member.delete({ where: { id: owned.id } });
    res.json({ success: true, message: 'Anggota keluarga dihapus', data: null });
  } catch (err) {
    next(err);
  }
};
