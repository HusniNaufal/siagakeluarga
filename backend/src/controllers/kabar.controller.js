import prisma from '../lib/prisma.js';
import { ringkasKabar } from '../services/kabar.service.js';

const cariRumahDariToken = (token) =>
  prisma.household.findUnique({ where: { share_token: token }, include: { members: true } });

// POST /api/share/:token/checkin  (publik: siapa pun yang memegang tautan rencana)
export const kirimKabar = async (req, res, next) => {
  try {
    const { token } = req.validated.params;
    const { member_id, nama, status, lat, lng, pesan } = req.validated.body;

    const household = await cariRumahDariToken(token);
    if (!household) return res.status(404).json({ success: false, message: 'Tautan tidak ditemukan' });

    let namaLapor = nama;
    if (member_id) {
      const anggota = (household.members ?? []).find((m) => m.id === member_id);
      if (!anggota) return res.status(400).json({ success: false, message: 'Anggota tidak ditemukan di keluarga ini' });
      namaLapor = anggota.panggilan;
    }
    if (!namaLapor) {
      return res.status(400).json({ success: false, message: 'Pilih namamu atau tulis namamu terlebih dahulu' });
    }

    await prisma.checkIn.create({
      data: {
        household_id: household.id,
        member_id: member_id ?? null,
        nama: namaLapor,
        status,
        lat: lat ?? null,
        lng: lng ?? null,
        pesan: pesan?.trim() || null,
      },
    });

    res.status(201).json({ success: true, message: 'Kabar tersimpan', data: await ringkasKabar(household) });
  } catch (err) {
    next(err);
  }
};

// GET /api/share/:token/kabar  (publik)
export const lihatKabarPublik = async (req, res, next) => {
  try {
    const household = await cariRumahDariToken(req.validated.params.token);
    if (!household) return res.status(404).json({ success: false, message: 'Tautan tidak ditemukan' });
    res.json({ success: true, message: 'Kabar keluarga', data: await ringkasKabar(household) });
  } catch (err) {
    next(err);
  }
};

const rumahSaya = (userId) => prisma.household.findUnique({ where: { user_id: userId }, include: { members: true } });

// GET /api/kabar  (pemilik rencana)
export const lihatKabarSaya = async (req, res, next) => {
  try {
    const household = await rumahSaya(req.user.id);
    if (!household) return res.status(404).json({ success: false, message: 'Keluarga belum dibuat' });
    res.json({ success: true, message: 'Kabar keluarga', data: await ringkasKabar(household) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/kabar  (pemilik: mulai pendataan baru setelah kejadian selesai)
export const hapusKabarSaya = async (req, res, next) => {
  try {
    const household = await rumahSaya(req.user.id);
    if (!household) return res.status(404).json({ success: false, message: 'Keluarga belum dibuat' });
    await prisma.checkIn.deleteMany({ where: { household_id: household.id } });
    res.json({ success: true, message: 'Kabar keluarga dikosongkan', data: await ringkasKabar(household) });
  } catch (err) {
    next(err);
  }
};
