# Prompt Desain SiagaKeluarga (Claude Code + FigCraft)

Kamu adalah senior web designer (UI/UX) dengan gaya web agensi premium (Awwwards). Pakai MCP "figcraft" (aplikasi desain FigCraft dari ArtCraft, sedang terbuka dalam mode live) untuk MERANCANG DESAIN WEB "SiagaKeluarga". Ini pekerjaan desain di kanvas FigCraft, BUKAN menulis kode.

## 0. Cek awal (wajib)
1. Lihat daftar tool MCP figcraft yang tersedia, lalu sesuaikan cara kerjamu dengan kemampuan tool itu. FigCraft masih alpha: kalau ada fitur yang tidak tersedia (misalnya komponen/varian atau prototype), ganti dengan cara paling dekat (frame yang diduplikasi, catatan teks) dan sebutkan di laporan.
2. Buat teks uji dengan font "Geist" (weight 300, 400, 600, 700) dan "Geist Mono". Kalau salah satu tidak tersedia atau diganti font lain, BERHENTI dan beri tahu saya.
3. Lihat semua gambar di folder design/referensi/ (ref1–ref6). Itu referensi gaya utama.
4. Simpan pekerjaan sebagai design/siagakeluarga.figcraft dan simpan ulang setiap selesai 1 layar. Ekspor tiap layar ke PNG 2x di design/export/ dengan nama berurutan (01-beranda-desktop.png, dst).

## 1. Tentang produk
- Website lomba IT RUSH 2026 (subtema Mitigasi Bencana dan Perubahan Iklim).
- SiagaKeluarga membantu keluarga Indonesia menyusun rencana darurat bencana (banjir, gempa, longsor, cuaca ekstrem) dengan bantuan AI dan data prakiraan cuaca BMKG.
- Masalah: banyak keluarga tidak punya rencana tertulis (titik kumpul, tugas tiap anggota, isi tas siaga), sehingga panik saat bencana datang.
- Pengguna: orang tua 30–50 tahun (utama), lansia dan anggota keluarga penerima rencana lewat link, admin konten.
- Kesan: sinematik dan berkesan di halaman publik; tenang, jelas, dan mudah dipakai di halaman aplikasi.

## 2. Referensi gaya (design/referensi/)
Ambil PRINSIPNYA, jangan menyalin layout, teks, logo, atau aset.
- ref1 (Tibico): hero foto lanskap nyata layar penuh, navbar kartu putih melayang, judul besar tebal, deretan kartu foto di bawah hero.
- ref2 (Elune): latar warna dalam yang hangat, judul serif besar yang elegan, mockup aplikasi berbentuk HP dengan kartu lembut.
- ref3 (Roveia Health): judul besar di tengah dengan satu kata berwarna, media (video/foto) di tengah, statistik besar di kiri, teks dan tombol kapsul di kanan, deretan logo mitra.
- ref4 (onnoy): latar gelap, judul tipis + miring, teks mono kecil sebagai detail, visual 3D dengan efek partikel/piksel, satu aksen warna, tombol kapsul.
- ref5 (Vendredi Society): visual 3D sinematik layar penuh, teks di tengah, tombol bulat "Play Reel".
- ref6 (Planes): latar gelap dengan berkas cahaya dramatis, judul besar di tengah, dua tombol.

Referensi tambahan (halaman aplikasi):
- Dashboard cuaca: https://dribbble.com/shots/18070219-Cuacane-Dashboard
- Aplikasi kesiapsiagaan: https://dribbble.com/shots/15988544-Hello-Harbor

## 3. Arah desain
- Halaman publik (Beranda, Panduan, Masuk/Daftar): sinematik. Visual layar penuh sebagai bintang utama, tipografi sangat besar, UI minim di atas visual, detail mono kecil yang memberi kesan "live", banyak ruang kosong.
- Halaman aplikasi (setelah login): versi tenang dari gaya yang sama. Latar terang, tipografi yang sama, kartu lembut, satu aksen warna. Fokus pada keterbacaan.
- Cerita visual Beranda: TERANG → GELAP. Dimulai dari desa yang cerah dan damai, lalu saat discroll langit menggelap, hujan turun, kilat menyambar, air naik, dan akhirnya keluarga aman di titik kumpul. Bagian badai menjadi section gelap sinematik seperti ref4 dan ref6.
- Hindari: gradient warna-warni/blob, glassmorphism berlebihan, ilustrasi kartun, deretan kartu ikon pastel, emoji, teks bombastis.

## 4. Foundations

### Warna
Terang (siang, halaman aplikasi):
- ink #0A0A0A (teks utama) · ink-2 #404040 · ink-3 #737373 (keterangan)
- line #E7E5E4 · surface #F5F5F4 · base #FFFFFF · warm #F4F1EA (latar hangat section publik)

Gelap (badai, section sinematik):
- night #07090C (latar paling gelap) · storm #0E1620 · storm-2 #1A2532 · mist #9AA4B2 (teks sekunder di gelap) · white #F5F5F4 (teks di gelap)

Aksen (satu saja):
- green #22C55E (CTA, status aktif, jalur evakuasi, titik kumpul; di latar gelap boleh diberi glow halus) · green-dark #16A34A (hover) · green-soft #ECFDF3

Status (selalu ikon + teks): aman #16A34A · waspada #D97706 · bahaya #DC2626

Data cuaca: blue #3B82F6 (hanya grafik/timeline hujan)

### Tipografi
- Utama: Geist (semua judul, paragraf, tombol, form). Detail "live", label kecil, angka data, nomor langkah: Geist Mono.
- Penekanan di judul: 1–3 kata diberi kontras, BUKAN font lain. Pilih salah satu dan konsisten: (a) kata penekanan memakai Geist weight 300 dengan warna ink-3 di latar terang / mist di latar gelap, atau (b) kata penekanan berwarna green (gaya ref3).
- Desktop: display 96/96 semibold (600) -4% (hero) · h1 64/68 semibold -3% · h2 40/46 semibold -2% · h3 22/30 semibold · body-lg 19/30 · body 16/26 · small 14/20 · mono 13/18 uppercase +4%.
- Mobile: display 52/54 · h1 40/44 · h2 30/36, sisanya sama.
- Gaya khas: judul besar dengan tracking rapat (-4% sampai -3%) + 1–3 kata penekanan, contoh: "Siap bersama, [sebelum] bencana datang." (kata dalam kurung siku = kata penekanan).

### Layout
- Desktop 1440 (konten maks 1240, 12 kolom, gutter 24) · tablet 834 (8 kolom) · mobile 390 (4 kolom, margin 20).
- Spasi kelipatan 4/8: 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. Antar-section publik: 160 desktop / 96 mobile.
- Radius: tombol KAPSUL (radius penuh) · input 12 · kartu 20 · panel/media besar 28 · navbar melayang 20.
- Border 1 px (line di terang, rgba putih 10% di gelap). Shadow sangat halus, hanya untuk navbar melayang dan modal.

### Ikon dan visual
- Ikon garis gaya Lucide, stroke 1.5, warna mengikuti teks. Tanpa kotak berwarna di belakang ikon.
- Visual publik: foto/render realistis desa Indonesia (rumah genteng, pohon kelapa, sawah, bukit, sungai). Kalau gambar belum ada, buat placeholder bergradasi gelap-terang sesuai suasana + label mono "[FOTO: deskripsi isi]".
- Efek pendukung: garis hujan tipis, kilatan cahaya, partikel/piksel halus yang membentuk siluet rumah (terinspirasi ref4), glow hijau di titik kumpul.
- Mockup UI aplikasi (dokumen rencana, timeline cuaca, checklist) di dalam frame HP/browser, gaya ref2.

## 5. Komponen (buat di frame "Components")
Gambarkan state default, hover, focus, disabled bila relevan.
- Tombol kapsul: primary (hijau, teks gelap/hitam), secondary (hitam di terang / putih di gelap), outline, ghost, tombol bulat besar "Putar cerita" (gaya ref5), tombol ikon bulat. Ukuran sm 36 / md 44 / lg 56. Ikon panah di kanan.
- Navbar melayang (kartu putih radius 20 seperti ref1) dan versi gelap transparan (ref6); versi mobile dengan menu layar penuh.
- Label mono "live": titik hijau berkedip + teks, contoh "● PRAKIRAAN BMKG · DAYEUHKOLOT · 14:00 WIB".
- Blok statistik besar (angka display + label mono + keterangan), gaya ref3.
- Input, select, combobox kelurahan, checkbox, radio, toggle, field (label + helper + error).
- Badge status, tag kebutuhan (Lansia, Bayi, Obat rutin).
- Kartu foto (gambar penuh + judul di bawah, gaya ref1), kartu konten, kartu terpilih.
- Kartu anggota keluarga, item checklist, kartu titik kumpul, kartu kontak darurat.
- Timeline cuaca per 3 jam, kartu hari prakiraan.
- Chat (bubble pengguna, bubble AI, indikator mengetik, chip saran kapsul, input chat).
- Progress bar, progress ring (skor kesiapan), stepper, tabs, accordion, toast, banner peringatan, modal, tabel, empty state, skeleton.
- Sidebar aplikasi, bottom navigation mobile, footer.

## 6. Halaman
Data contoh: "Keluarga Pratama": Budi (Ayah, 42), Sari (Ibu, 39), Nenek Aminah (72, lansia, obat darah tinggi rutin), Raka (6). Kel. Dayeuhkolot, Kab. Bandung. Titik kumpul: Aula Masjid Agung Dayeuhkolot (400 m). Data cuaca diberi kredit "Sumber: BMKG". Semua teks Bahasa Indonesia, sapaan "kamu", kalimat pendek dan tenang.

### [1] Beranda (desktop + mobile; fokus utama, kerjakan paling detail)
Scrollcraft hero, buat 5 KEYFRAME berurutan (masing-masing satu frame desktop 1440×900 dan mobile 390×844):
- K1 Cerah: foto desa siang yang damai layar penuh. Navbar kartu putih melayang (logo, Cara kerja, Fitur, Panduan, Data BMKG, tombol kapsul "Buat rencana"). Judul display kiri: "Siap bersama, [sebelum] bencana datang." Subjudul 1 kalimat. Tombol "Buat rencana gratis" + tombol ghost "Lihat cara kerja". Label mono live di bawah. Indikator scroll "01 / 04" di kanan.
- K2 Jalur dipetakan: foto sama, jalur evakuasi hijau bercahaya muncul dari rumah ke bukit, label kecil "Titik kumpul · 400 m". Teks berganti: "01 · Kenali rumahmu".
- K3 Cuaca berubah: langit mulai gelap, awan tebal, garis hujan, navbar berubah ke versi gelap. Kartu kecil melayang berisi prakiraan BMKG (waspada, hujan lebat 15:00). Teks: "02 · Hujan turun, keluargamu tetap tenang".
- K4 Badai (section gelap sinematik): latar night, kilatan cahaya dramatis (ref6), siluet desa dari partikel/piksel (ref4). Judul besar tengah: "Saat sirine berbunyi, tidak ada waktu untuk [berpikir]." Teks pendek di bawah.
- K5 Aman: air menggenangi dataran rendah, keluarga berkumpul di bukit dengan bendera hijau bercahaya. Teks: "03 · Semua sampai di titik kumpul." Tombol kapsul "Buat rencana keluargamu".

Section setelah hero:
- Statistik (gaya ref3): angka besar di kiri (statistik kebencanaan Indonesia, beri label mono "SUMBER: BNPB" sebagai placeholder untuk diverifikasi), media foto di tengah, teks + tombol kapsul di kanan.
- Cara kerja: 3 langkah besar bernomor mono (01 Isi profil keluarga, 02 AI menyusun rencana, 03 Bagikan dan latihan), tiap langkah dengan mockup HP gaya ref2.
- Fitur: deretan 4 kartu foto besar (gaya ref1): Rencana darurat AI, Cuaca BMKG, Tas siaga, Tanya AI. Tiap kartu: foto/mockup + judul + 1 kalimat.
- Data BMKG live: section gelap storm, timeline prakiraan 3 hari dengan angka mono.
- Kalimat penutup besar (dengan kata penekanan) + tombol kapsul besar.
- FAQ (accordion 5 pertanyaan).
- Footer: logo besar, tautan, kredit "Data cuaca: BMKG", tim, label mono lokasi dan waktu.

### [2] Panduan Bencana
Hero pendek dengan foto, filter kapsul (Semua, Banjir, Gempa, Longsor, Cuaca ekstrem), grid kartu foto panduan. Detail: judul besar, tabs Sebelum/Saat/Sesudah, langkah bernomor, kotak "Yang perlu disiapkan", tombol "Tambahkan ke rencana saya".

### [3] Masuk dan Daftar
Split 2 kolom; kiri form di latar terang; kanan foto sinematik layar penuh dengan kutipan besar Geist (dengan kata penekanan) dan label mono. Mobile: form saja.

### Halaman aplikasi
Latar terang; sidebar di desktop, bottom navigation di mobile; menu: Beranda Saya, Rencana, Keluarga, Tas Siaga, Risiko dan Cuaca, Tanya AI.
- [4] Onboarding 3 langkah (anggota keluarga → alamat dan kelurahan → kondisi rumah) dengan stepper, lalu layar "AI sedang menyusun rencanamu" (langkah proses muncul satu per satu).
- [5] Beranda Saya: banner cuaca hari ini, skor kesiapan (ring), progress tas siaga, langkah berikutnya, ringkasan titik kumpul, mini timeline cuaca.
- [6] Profil Keluarga: kartu anggota, tombol tambah, panel alamat, modal tambah/ubah.
- [7] Rencana Darurat: dokumen rencana (ringkasan risiko, titik kumpul + peta, tugas tiap anggota, kontak darurat, catatan khusus), daftar isi di kanan, tombol "Bagikan ke keluarga" dan "Unduh PDF". State: kosong, AI menyusun, selesai.
- [8] Tas Siaga: progress besar, kelompok checklist, tag "untuk Nenek Aminah"/"untuk Raka".
- [9] Risiko dan Cuaca: status risiko wilayah besar, saran tindakan, kartu 3 hari, timeline per 3 jam (angka mono).
- [10] Tanya AI: layar awal dengan chip saran, percakapan contoh, catatan "bukan pengganti instruksi resmi BPBD".
- [11] Latihan: daftar skenario, layar skenario (situasi + pilihan + umpan balik), layar skor.
- [12] Rencana Publik: versi baca-saja yang dibuka lewat link, huruf besar, tombol telepon besar (mobile utama).
- [13] Admin: statistik + tabel panduan.
- [14] 404 dan error koneksi (boleh bergaya sinematik gelap).

Ukuran: halaman publik desktop + mobile; halaman aplikasi desktop + mobile; tablet cukup untuk Beranda.

## 7. Catatan motion dan interaksi (frame "Motion Notes")
Tulis sebagai teks anotasi di samping keyframe, untuk developer:
- Hero: section setinggi ±5 layar, visual sticky. Transisi K1→K5 mengikuti posisi scroll (bukan otomatis): crossfade gambar, langit menggelap, hujan muncul bertahap, navbar berganti terang→gelap di K3, kilat sesekali di K4, glow titik kumpul di K5.
- Teks tiap babak: keluar ke atas + fade, masuk dari bawah. Durasi 400 ms, easing cubic-bezier(0.16, 1, 0.3, 1).
- Hover: tombol kapsul membesar 2% + panah bergeser 4 px; kartu foto zoom gambar 3%.
- Partikel siluet desa di K4 bergerak pelan mengikuti mouse (parallax ringan).
- Label mono live: titik hijau berkedip 1,5 detik.
- Angka statistik dan timeline: hitung naik saat masuk layar.
- Reduced motion: semua diganti fade, tanpa parallax dan kilat.

## 8. Aksesibilitas
Kontras WCAG AA (cek teks di atas foto: beri gradasi gelap di belakang teks), status selalu ikon + teks, target sentuh min 44×44, teks isi min 16, label form selalu terlihat.

## 9. Cara kerja
1. Cek awal (bagian 0).
2. Buat frame "Foundations" (palet, tipografi, spasi, radius) dan frame "Components".
3. Kerjakan Beranda desktop: 5 keyframe hero + semua section. Ekspor PNG.
4. BERHENTI. Kirim ringkasan + daftar file PNG, tunggu persetujuan saya.
5. Setelah disetujui: Beranda mobile dan tablet, lalu halaman 2–14 berurutan, lapor setiap 3 halaman.
6. Terakhir: frame "Motion Notes", frame "Alur" (diagram panah antar-layar untuk 4 alur: daftar sampai bagikan rencana; peringatan cuaca ke tas siaga; anggota keluarga buka rencana publik; panduan ke latihan), dan daftar semua layar.
