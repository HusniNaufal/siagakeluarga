import prisma from '../lib/prisma.js';

// ---------- Panduan (GuideChunk) ----------
export const listGuides = async (req, res, next) => {
  try {
    const guides = await prisma.guideChunk.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, sumber: true, isi: true },
    });
    res.json({ success: true, message: 'Daftar panduan berhasil diambil', data: guides });
  } catch (err) {
    next(err);
  }
};

export const createGuide = async (req, res, next) => {
  try {
    const guide = await prisma.guideChunk.create({ data: req.body, select: { id: true, sumber: true, isi: true } });
    res.status(201).json({ success: true, message: 'Panduan ditambahkan', data: guide });
  } catch (err) {
    next(err);
  }
};

export const updateGuide = async (req, res, next) => {
  try {
    const guide = await prisma.guideChunk.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      select: { id: true, sumber: true, isi: true },
    });
    res.json({ success: true, message: 'Panduan diperbarui', data: guide });
  } catch {
    res.status(404).json({ success: false, message: 'Panduan tidak ditemukan' });
  }
};

export const deleteGuide = async (req, res, next) => {
  try {
    await prisma.guideChunk.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Panduan dihapus', data: null });
  } catch {
    res.status(404).json({ success: false, message: 'Panduan tidak ditemukan' });
  }
};

// ---------- Zona bahaya (HazardZone) ----------
export const listHazardZones = async (req, res, next) => {
  try {
    const zones = await prisma.hazardZone.findMany({ orderBy: { id: 'asc' }, include: { region: true } });
    res.json({ success: true, message: 'Daftar zona bahaya berhasil diambil', data: zones });
  } catch (err) {
    next(err);
  }
};

export const createHazardZone = async (req, res, next) => {
  try {
    const zone = await prisma.hazardZone.create({ data: req.body, include: { region: true } });
    res.status(201).json({ success: true, message: 'Zona bahaya ditambahkan', data: zone });
  } catch (err) {
    next(err);
  }
};

export const updateHazardZone = async (req, res, next) => {
  try {
    const zone = await prisma.hazardZone.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { region: true },
    });
    res.json({ success: true, message: 'Zona bahaya diperbarui', data: zone });
  } catch {
    res.status(404).json({ success: false, message: 'Zona bahaya tidak ditemukan' });
  }
};

export const deleteHazardZone = async (req, res, next) => {
  try {
    await prisma.hazardZone.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Zona bahaya dihapus', data: null });
  } catch {
    res.status(404).json({ success: false, message: 'Zona bahaya tidak ditemukan' });
  }
};

// ---------- Titik kumpul (AssemblyPoint) ----------
export const listAssemblyPoints = async (req, res, next) => {
  try {
    const points = await prisma.assemblyPoint.findMany({ orderBy: { id: 'asc' }, include: { region: true } });
    res.json({ success: true, message: 'Daftar titik kumpul berhasil diambil', data: points });
  } catch (err) {
    next(err);
  }
};

export const createAssemblyPoint = async (req, res, next) => {
  try {
    const point = await prisma.assemblyPoint.create({ data: req.body, include: { region: true } });
    res.status(201).json({ success: true, message: 'Titik kumpul ditambahkan', data: point });
  } catch (err) {
    next(err);
  }
};

export const updateAssemblyPoint = async (req, res, next) => {
  try {
    const point = await prisma.assemblyPoint.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { region: true },
    });
    res.json({ success: true, message: 'Titik kumpul diperbarui', data: point });
  } catch {
    res.status(404).json({ success: false, message: 'Titik kumpul tidak ditemukan' });
  }
};

export const deleteAssemblyPoint = async (req, res, next) => {
  try {
    await prisma.assemblyPoint.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: 'Titik kumpul dihapus', data: null });
  } catch {
    res.status(404).json({ success: false, message: 'Titik kumpul tidak ditemukan' });
  }
};
