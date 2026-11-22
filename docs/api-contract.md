# Kontrak API SiagaKeluarga

Base URL: `${VITE_API_URL}/api`. Semua respons JSON. Auth: header `Authorization: Bearer <JWT>` kecuali ditandai publik.

| Metode | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | /auth/register | publik | Daftar akun |
| POST | /auth/login | publik | Login, mengembalikan JWT |
| GET, PUT | /households/me | user | Lihat/ubah data keluarga dan lokasi (lat, lng) |
| POST, PATCH, DELETE | /households/me/members | user | Kelola anggota keluarga |
| GET | /risk?lat=&lng= | user | Ancaman wilayah, tingkat, titik kumpul terdekat, prakiraan cuaca |
| POST | /plans/generate | user | Buat rencana darurat dengan AI (maks 5x/jam) |
| GET | /plans/latest | user | Ambil rencana terakhir |
| GET, PATCH | /kit-items | user | Checklist tas siaga |
| GET | /score | user | Skor kesiapsiagaan 0-100 (berbasis aturan) |
| POST | /drills | user | Jadwalkan latihan |
| POST | /drills/:id/quiz | user | Nilai jawaban kuis skenario oleh AI |
| POST | /ask | user | Tanya Siaga (RAG) |
| POST | /share | user | Buat token tautan bagikan |
| GET | /share/:token | publik | Rencana read-only |
| GET, POST, PUT, DELETE | /admin/guides, /admin/hazard-zones, /admin/assembly-points | admin | Kelola panduan, zona bahaya, titik kumpul (`:id` untuk PUT/DELETE) |
| POST | /admin/reindex-guides | admin | Bangun ulang embedding vektor panduan (RAG) |

## Contoh respons GET /risk
```json
{
  "region": { "kode_wilayah": "17.71.01", "kecamatan": "Teluk Segara", "kab_kota": "Kota Bengkulu" },
  "terdampak": true,
  "ancaman": [
    { "jenis_bencana": "BANJIR", "tingkat": "SEDANG" },
    { "jenis_bencana": "GEMPA", "tingkat": "TINGGI" }
  ],
  "titik_kumpul": [{ "nama": "Lapangan X", "lat": -3.8, "lng": 102.26, "jarak_m": 450 }],
  "cuaca": { "ringkasan": "Hujan ringan", "suhu": 27 }
}
```

## Skema JSON keluaran AI (POST /plans/generate)
```json
{
  "skenario": [
    {
      "jenis": "BANJIR",
      "sebelum": ["..."],
      "saat": ["..."],
      "sesudah": ["..."],
      "tugas": [{ "peran": "ibu", "tugas": "..." }]
    }
  ],
  "tas_siaga": [{ "item": "Senter", "jumlah": 2, "untuk": "semua", "alasan": "..." }]
}
```

## Aturan skor kesiapsiagaan (usulan, bisa disesuaikan)
- 40% kelengkapan rencana (ada rencana untuk semua ancaman terdampak)
- 40% kelengkapan checklist tas siaga (item tercentang dan belum kedaluwarsa)
- 20% latihan (jumlah latihan selesai dan rata-rata skor kuis)
