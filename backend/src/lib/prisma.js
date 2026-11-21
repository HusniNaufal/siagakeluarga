import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis;

const createPrismaClient = () => {
  // Pooler (DATABASE_URL) lebih aman untuk serverless; fallback ke DIRECT_URL
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  const adapter = new PrismaPg({ connectionString, max: 3 });
  return new PrismaClient({ adapter });
};

// Singleton lintas hot-reload & invokasi warm di Vercel
const prisma = globalForPrisma.__prisma || createPrismaClient();
globalForPrisma.__prisma = prisma;

export default prisma;
