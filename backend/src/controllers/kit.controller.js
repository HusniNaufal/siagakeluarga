import prisma from '../lib/prisma.js';
import { getOrCreateHousehold, kitReadiness } from '../services/household.service.js';

const findOwnedItem = async (userId, id) => {
  const household = await getOrCreateHousehold(userId);
  return prisma.kitItem.findFirst({ where: { id, household_id: household.id } });
};

export const listKit = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const items = await prisma.kitItem.findMany({
      where: { household_id: household.id },
      orderBy: { nama_item: 'asc' },
    });
    res.json({
      success: true,
      message: 'Tas siaga berhasil diambil',
      data: { items, kesiapan: kitReadiness(items) },
    });
  } catch (err) {
    next(err);
  }
};

export const createKitItem = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const item = await prisma.kitItem.create({ data: { ...req.body, household_id: household.id } });
    res.status(201).json({ success: true, message: 'Item tas siaga ditambahkan', data: item });
  } catch (err) {
    next(err);
  }
};

export const updateKitItem = async (req, res, next) => {
  try {
    const owned = await findOwnedItem(req.user.id, req.params.id);
    if (!owned) return res.status(404).json({ success: false, message: 'Item tidak ditemukan' });
    const item = await prisma.kitItem.update({ where: { id: owned.id }, data: req.body });
    res.json({ success: true, message: 'Item tas siaga diperbarui', data: item });
  } catch (err) {
    next(err);
  }
};

export const deleteKitItem = async (req, res, next) => {
  try {
    const owned = await findOwnedItem(req.user.id, req.params.id);
    if (!owned) return res.status(404).json({ success: false, message: 'Item tidak ditemukan' });
    await prisma.kitItem.delete({ where: { id: owned.id } });
    res.json({ success: true, message: 'Item tas siaga dihapus', data: null });
  } catch (err) {
    next(err);
  }
};
