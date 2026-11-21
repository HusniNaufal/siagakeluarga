import prisma from '../lib/prisma.js';
import { getOrCreateHousehold } from '../services/household.service.js';

export const listDrills = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const drills = await prisma.drill.findMany({
      where: { household_id: household.id },
      orderBy: { jadwal: 'desc' },
    });
    const skorList = drills.filter((d) => d.skor != null).map((d) => d.skor);
    const rata_rata_skor = skorList.length
      ? Math.round(skorList.reduce((a, b) => a + b, 0) / skorList.length)
      : null;
    res.json({ success: true, message: 'Daftar simulasi berhasil diambil', data: { drills, rata_rata_skor } });
  } catch (err) {
    next(err);
  }
};

export const createDrill = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const drill = await prisma.drill.create({ data: { ...req.body, household_id: household.id } });
    res.status(201).json({ success: true, message: 'Simulasi dicatat', data: drill });
  } catch (err) {
    next(err);
  }
};

export const updateDrill = async (req, res, next) => {
  try {
    const household = await getOrCreateHousehold(req.user.id);
    const owned = await prisma.drill.findFirst({
      where: { id: req.params.id, household_id: household.id },
    });
    if (!owned) return res.status(404).json({ success: false, message: 'Simulasi tidak ditemukan' });
    const drill = await prisma.drill.update({ where: { id: owned.id }, data: req.body });
    res.json({ success: true, message: 'Simulasi diperbarui', data: drill });
  } catch (err) {
    next(err);
  }
};
