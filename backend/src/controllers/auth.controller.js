import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { getDefaultRegion, kitReadiness } from '../services/household.service.js';

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const publicUser = (u) => ({ id: u.id, nama: u.nama, email: u.email, role: u.role, created_at: u.created_at });

export const register = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const region = await getDefaultRegion();
    const user = await prisma.user.create({
      data: {
        nama,
        email: normalizedEmail,
        password_hash: await bcrypt.hash(password, 10),
        household: { create: { region_id: region?.id ?? null } },
      },
      include: { household: true },
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { token: signToken(user), user: publicUser(user), household_id: user.household.id },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
    res.json({
      success: true,
      message: 'Login berhasil',
      data: { token: signToken(user), user: publicUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        household: {
          include: { region: true, members: true, kit_items: true, _count: { select: { drills: true } } },
        },
      },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    const h = user.household;
    res.json({
      success: true,
      message: 'Profil berhasil diambil',
      data: {
        user: publicUser(user),
        household: h
          ? {
              id: h.id,
              region: h.region,
              jumlah_anggota: h.members.length,
              kesiapan_tas: kitReadiness(h.kit_items),
              jumlah_simulasi: h._count.drills,
              share_token: h.share_token,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { nama } = req.body;
    if (!nama || !nama.trim()) {
      return res.status(400).json({ success: false, message: 'Nama tidak boleh kosong' });
    }
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { nama: nama.trim() },
    });
    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: { user: publicUser(user) },
    });
  } catch (err) {
    next(err);
  }
};
