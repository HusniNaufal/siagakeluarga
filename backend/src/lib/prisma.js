import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { mockDb } from './mockDb.js';

const globalForPrisma = globalThis;

let useFallback = false;
let realPrisma = null;

try {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!connectionString || connectionString.includes('user:password') || connectionString.includes('localhost:5432')) {
    // URL default/contoh: jangan blokir jika lokal 5432 belum menyala
  }
  const adapter = new PrismaPg({ connectionString: connectionString || 'postgresql://localhost:5432/siaga', max: 3 });
  realPrisma = new PrismaClient({ adapter });
} catch (err) {
  console.warn('[db] Inisialisasi Prisma pg adapter gagal, menggunakan mock lokal:', err.message);
  useFallback = true;
}

const isConnError = (err) => {
  const msg = String(err?.message || err || '');
  const code = err?.code || '';
  return (
    code === 'ECONNREFUSED' ||
    code === 'P1001' ||
    /ECONNREFUSED|connect ECONNREFUSED|Can't reach database server|connection refused/i.test(msg)
  );
};

// Proxy cerdas: jika PostgreSQL hidup, gunakan database asli. Jika offline / belum disetel,
// gunakan mockDb lokal dengan data lengkap Bengkulu & akun demo secara mulus tanpa error 500.
const createResilientClient = () => {
  return new Proxy({}, {
    get(_target, prop) {
      if (prop === '$queryRaw' || prop === '$executeRaw') {
        return async (...args) => {
          if (useFallback || !realPrisma) return mockDb[prop](...args);
          try {
            return await realPrisma[prop](...args);
          } catch (err) {
            if (isConnError(err)) {
              if (!useFallback) {
                console.warn('[db] PostgreSQL tidak terjangkau. Beralih ke penyimpanan lokal in-memory.');
                useFallback = true;
              }
              return mockDb[prop](...args);
            }
            throw err;
          }
        };
      }

      return new Proxy({}, {
        get(_modelTarget, method) {
          return async (...args) => {
            if (useFallback || !realPrisma || !realPrisma[prop] || typeof realPrisma[prop][method] !== 'function') {
              if (mockDb[prop] && typeof mockDb[prop][method] === 'function') {
                return mockDb[prop][method](...args);
              }
              return null;
            }

            try {
              return await realPrisma[prop][method](...args);
            } catch (err) {
              if (isConnError(err)) {
                if (!useFallback) {
                  console.warn(`[db] PostgreSQL offline (${err.code || 'ECONNREFUSED'}). Menggunakan data lokal untuk ${String(prop)}.${String(method)}`);
                  useFallback = true;
                }
                if (mockDb[prop] && typeof mockDb[prop][method] === 'function') {
                  return mockDb[prop][method](...args);
                }
              }
              throw err;
            }
          };
        },
      });
    },
  });
};

const prisma = globalForPrisma.__prisma || createResilientClient();
globalForPrisma.__prisma = prisma;

export default prisma;
