# Rencana Induk Kosakata JLPT N4

Tanggal penyusunan: 13 Oktober 2026  
Status: **Rencana — belum mulai memasukkan entri kosakata N4**

## Tujuan

Menyiapkan proses yang bisa diuji, dilacak, dan diaudit sekali secara terencana sebelum produksi besar. Prinsipnya: kesalahan yang bisa dideteksi mesin harus ditangkap otomatis, sedangkan kualitas bahasa ditinjau dengan checklist konsisten.

## Prinsip utama

1. **Jangan mengejar angka sebelum cakupan jelas.** JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Tetapkan jumlah operasional setelah membandingkan beberapa sumber dan menghapus duplikasi yang tidak dibutuhkan.
2. **Pisahkan kesalahan mesin dari penilaian bahasa.** Format, kolom, duplikasi, dan integrasi diuji otomatis. Makna, nuansa, bacaan kanji dalam konteks, kewajaran kalimat, dan terjemahan ditinjau editorial.
3. **Jangan mengulang audit yang sama.** Setiap entri ditinjau dengan checklist yang sama dan status temuan dicatat dalam satu laporan.
4. **Satu sumber kebenaran.** Tetapkan skema data, kategori, konvensi bacaan, dan aturan terjemahan sebelum batch pertama dibuat.
5. **Jujur soal validasi.** Jangan menyatakan validasi penutur asli atau daftar resmi JLPT jika itu belum dilakukan.

## Gerbang 0 — Bekukan dan pelajari pelajaran N5

- Pertahankan N5 sebagai baseline; jangan mengubah data N5 hanya demi memulai N4.
- Tinjau skrip audit N5, workflow GitHub Actions, dan format entri.
- Catat batasan yang ada: pemeriksaan struktur tidak membuktikan kebenaran linguistik.
- **Lulus jika:** kelemahan audit N5 dan keputusan desain N4 sudah terdokumentasi.

## Gerbang 1 — Tetapkan sumber dan kebijakan level

- Kumpulkan beberapa referensi belajar yang bisa dilacak, misalnya kamus tepercaya dan daftar pembelajaran publik dengan asal yang jelas.
- Catat judul, URL, tanggal akses, serta lisensi atau ketentuan penggunaan jika relevan.
- Jangan menganggap satu daftar komunitas sebagai daftar resmi JLPT.
- Catat status dukungan setiap kata: **cross-checked**, **single-source**, **needs-review**, atau **supplemental**.
- Bandingkan kandidat N4 dengan kosakata N5 yang sudah ada. Kata yang sama tidak otomatis salah; periksa perbedaan makna, bacaan, atau penggunaan.
- **Lulus jika:** kebijakan sumber, status level, dan aturan menangani overlap disepakati sebelum daftar dibuat.

## Gerbang 2 — Bekukan skema entri

Gunakan skema proyek yang konsisten:

- **jp:** headword Jepang.
- **kana:** bacaan headword dalam kana; tidak berisi kanji atau huruf Latin.
- **arti:** makna inti dalam bahasa Indonesia; makna tambahan hanya bila berguna dan diberi konteks.
- **kelas:** kategori yang diizinkan aplikasi.
- **contoh:** satu kalimat Jepang alami yang benar-benar memakai kata target.
- **bacaan:** bacaan kana lengkap untuk seluruh contoh, termasuk partikel, konjugasi, dan tanda baca yang sesuai.
- **terjemahan:** terjemahan Indonesia yang alami dan setia pada kalimat Jepang.

Aturan editorial:
- Bacaan harus cocok dengan konteks contoh. Bacaan alternatif boleh dijelaskan jika relevan.
- Hindari contoh generik, pola kalimat berulang, terjemahan harfiah yang janggal, dan konteks tidak alami.
- Untuk kata dengan beberapa kelas kata atau makna, pilih penggunaan utama yang jelas atau pisahkan sesuai desain aplikasi.
- **Lulus jika:** contoh entri dari setiap kategori ditinjau dan skema dibekukan.

## Gerbang 3 — Perkuat validator sebelum batch kosakata

### Hard errors — wajib menggagalkan tes

- File tidak bisa dimuat, bukan array, atau jumlah entri melanggar kebijakan batch.
- Kolom wajib kosong atau kategori tidak dikenal.
- Duplikasi headword berdasarkan aturan normalisasi yang terdokumentasi.
- Kolom kana atau bacaan mengandung kanji/huruf Latin.
- Headword katakana tidak konsisten dengan bacaannya.
- Tanda baca contoh dan bacaan tidak selaras.
- Entri N4 identik dengan N5 tanpa keputusan eksplisit.
- File tidak dimuat oleh aplikasi atau urutan pemuatan salah.

### Peringatan — wajib ditinjau manusia

- Contoh identik atau terlalu mirip.
- Terjemahan yang tampak terlalu harfiah.
- Bacaan kanji ambigu.
- Kata yang mungkin di luar cakupan belajar N4.
- Entri yang hanya didukung satu sumber.
- Kalimat yang mungkin tidak memakai kata target dalam makna yang dimaksud.

Validator memakai pola otomatis untuk menemukan kandidat masalah; jangan mengklaim regex bisa menilai tata bahasa Jepang secara penuh.

**Lulus jika:** tes normal dan tes yang sengaja diberi kesalahan sama-sama berjalan; CI gagal pada hard errors dan menghasilkan laporan yang jelas.

## Gerbang 4 — Produksi batch kecil

- Mulai dengan **50–100 entri** pada batch pertama, bukan ratusan sekaligus.
- Simpan sumber dan catatan pemeriksaan di laporan/metadata audit terpisah agar skema aplikasi tetap bersih.
- Periksa headword, bacaan, makna, kelas kata, contoh, bacaan contoh, terjemahan, status level, dan sumber.
- Jalankan validator setiap selesai satu batch dan bereskan temuan sebelum batch berikutnya.
- Naikkan ukuran batch hanya setelah dua batch berturut-turut lolos tanpa perbaikan besar.

**Lulus jika:** dua batch awal lolos hard checks dan semua peringatan editorial punya status tercatat.

## Gerbang 5 — Checklist linguistik untuk setiap entri

- [ ] Headword dan bacaannya cocok.
- [ ] Makna Indonesia cocok dengan penggunaan dalam contoh.
- [ ] Kelas kata benar.
- [ ] Contoh alami dan tidak menyesatkan.
- [ ] Bacaan kana cocok dengan teks contoh.
- [ ] Terjemahan alami dan tidak mengubah makna penting.
- [ ] Level N4 masuk akal berdasarkan sumber yang dicatat.
- [ ] Tidak menduplikasi N5 atau entri lain tanpa alasan pembelajaran.
- [ ] Semua peringatan memiliki keputusan dan alasan.

Jika ada keraguan, tandai **needs-review** alih-alih menebak. Laporan akhir harus menyebutkan jumlah entri yang belum terselesaikan.

## Gerbang 6 — Audit integrasi dan rilis

- Uji pencarian, filter kategori, kartu, pengungkapan jawaban, progres, dan daftar dalam aplikasi.
- Jalankan tes otomatis untuk semua batch dan integrasi aplikasi.
- Buat laporan rilis berisi jumlah entri, jumlah unik, overlap N5, sumber, hard errors, peringatan tersisa, dan batasan klasifikasi level.
- Lakukan satu tinjauan akhir menyeluruh berdasarkan laporan itu. Setelah rilis, perbaikan terarah tetap menjalankan seluruh tes otomatis.

**Lulus jika:** semua hard checks lulus, peringatan ditangani atau diungkapkan, dan aplikasi berfungsi dengan data N4.

## Struktur file yang disarankan

Nama berikut adalah usulan; belum dibuat sampai Gerbang 0–2 selesai:

- data/vocabulary-n4-batch1.js
- data/vocabulary-n4-batch2.js dan batch berikutnya jika diperlukan
- audit-n4-vocabulary.js
- reports/audit-n4-vocabulary.md
- reports/sources-n4-vocabulary.md

Jangan tambahkan file N4 ke loader aplikasi sebelum batch pertama lolos gerbang kualitas.

## Strategi target jumlah

Jangan menjanjikan angka resmi yang tidak diterbitkan JLPT. Setelah inventaris sumber dan pemeriksaan overlap N5, tetapkan target operasional yang realistis serta dokumentasikan alasannya. Lebih baik daftar lebih kecil dengan sumber, bacaan, contoh, dan terjemahan yang jelas daripada daftar besar yang harus diaudit berulang.

## Definisi selesai

N4 dinyatakan siap dipakai jika:
- validator otomatis dan integrasi aplikasi lulus;
- semua entri melewati checklist editorial;
- tidak ada hard error atau duplikasi yang belum diputuskan;
- sumber dan status level tiap entri tercatat;
- semua peringatan tersisa ditampilkan dalam laporan;
- tidak ada klaim bahwa daftar ini adalah daftar resmi JLPT atau tervalidasi penutur asli tanpa bukti.
