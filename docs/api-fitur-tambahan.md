# Endpoint tambahan: cuaca per lokasi, kabar keluarga, pengingat grup

Dokumen ini melengkapi `api-contract.md`. Semua respons memakai bentuk yang sama: `{ success, message, data? }`.

## Cuaca dan lokasi (publik)

| Metode | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/cuaca?lat=&lng=` | Koordinat -> desa/kelurahan (Nominatim + wilayah.id) -> prakiraan BMKG. Mengembalikan `wilayah`, `cuaca.saat_ini`, `cuaca.prakiraan`, `cuaca.harian`, `cuaca.status`. |
| GET | `/api/lokasi/cari?q=` | Cari tempat di Indonesia berdasarkan nama (minimal 3 huruf). Dipanggil atas permintaan pengguna, bukan per ketikan. |

`cuaca.status.tingkat` (`aman` / `waspada` / `bahaya`) dihitung aplikasi dari curah hujan dan jenis cuaca. Ini **bukan** peringatan dini resmi BMKG.

## Kabar keluarga ("Saya aman")

Dikirim anggota keluarga lewat tautan rencana, tanpa login. Tautan berisi `share_token` rumah.

| Metode | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/share/:token/checkin` | tidak | Kirim kabar. Body: `{ member_id? , nama? , status: "AMAN" \| "BUTUH_BANTUAN", lat?, lng?, pesan? }`. Wajib salah satu dari `member_id` (anggota terdaftar) atau `nama` (tamu, maks. 40 huruf). `lat` dan `lng` harus diisi bersama. `pesan` maks. 140 huruf. |
| GET | `/api/share/:token/kabar` | tidak | Kabar terbaru tiap anggota. |
| GET | `/api/kabar` | JWT | Sama, untuk pemilik rencana. |
| DELETE | `/api/kabar` | JWT | Kosongkan semua kabar (mulai pendataan baru setelah kejadian selesai). |

Bentuk `data`:
```json
{
  "anggota": [
    { "id": "m-1", "panggilan": "Ayah", "kelompok_umur": "DEWASA",
      "kabar": { "status": "AMAN", "waktu": "2026-11-23T04:33:12Z", "lat": null, "lng": null, "pesan": null } }
  ],
  "lainnya": [{ "nama": "Paman Joko", "kabar": { "status": "BUTUH_BANTUAN", "waktu": "...", "lat": -3.79, "lng": 102.25, "pesan": "..." } }],
  "ringkasan": { "aman": 1, "butuh_bantuan": 1, "belum": 3 }
}
```

Privasi: koordinat hanya tersimpan bila pengirim memilih menyertakan lokasi, dan terlihat oleh siapa pun yang memegang tautan. Tautan bisa diganti pemilik (`regenerate_share_token`).

## Pengingat bersiap ke grup keluarga

| Metode | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/peringatan` | JWT | Status pengingat untuk rumah ini: `tingkat`, `ringkasan`, `kalimat` (siap kirim, `null` bila status aman), `telegram: { tersedia, terhubung, bot }`. |
| POST | `/api/peringatan/telegram/kode` | JWT | Buat kode sekali pakai untuk menghubungkan grup Telegram. 503 bila `TELEGRAM_BOT_TOKEN` kosong. |
| DELETE | `/api/peringatan/telegram` | JWT | Putuskan grup Telegram. |
| POST | `/api/telegram/webhook` | rahasia | Dipanggil Telegram. Header `X-Telegram-Bot-Api-Secret-Token` harus sama dengan `TELEGRAM_WEBHOOK_SECRET`. Pesan `/hubungkan KODE` di grup menautkan grup ke keluarga. |
| POST | `/api/cron/peringatan` | rahasia | Dipanggil penjadwal. Header `Authorization: Bearer $CRON_SECRET`. Mengirim pengingat ke grup yang terhubung bila status naik ke waspada/bahaya (tidak mengulang dalam 12 jam untuk tingkat yang sama). |

Tombol WhatsApp di aplikasi tidak butuh server: pesan disusun dari `kalimat` dan dikirim lewat tautan `wa.me`.

### Mengaktifkan Telegram (opsional)
1. Buat bot lewat @BotFather, isi `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_BOT_USERNAME`.
2. Pilih `TELEGRAM_WEBHOOK_SECRET` (acak), lalu daftarkan webhook:
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<BACKEND>/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>`
3. Isi `CRON_SECRET` dan `FRONTEND_URL`, lalu jadwalkan `POST /api/cron/peringatan` tiap 3 jam (mis. GitHub Actions atau cron-job.org). Cron Vercel paket gratis hanya sekali sehari.

## Perubahan basis data

Tambahan pada `prisma/schema.prisma`: enum `StatusKabar`, model `CheckIn`, dan kolom `telegram_chat_id`, `telegram_kode`, `peringatan_terakhir_at`, `peringatan_terakhir_tingkat` pada `Household`. Terapkan dengan `npx prisma migrate dev` (atau `npx prisma db push`) lalu `npx prisma generate`.

## Keamanan basis data tiruan

`src/lib/mockDb.js` (data tiruan di memori) hanya aktif di pengembangan lokal. Di produksi (`NODE_ENV=production` atau Vercel) kegagalan database menjadi galat. Paksa aktif dengan `ALLOW_MOCK_DB=true` hanya bila memang diperlukan. Sandi akun tiruan dibaca dari `SEED_DEMO_PASSWORD` dan `SEED_ADMIN_PASSWORD`.
