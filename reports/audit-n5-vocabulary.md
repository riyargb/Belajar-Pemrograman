# Audit Kosakata Jepang N5 — 800 Entri

Tanggal audit: 12 Oktober 2026  
Cakupan: `data/vocabulary-n5-batch1.js`, `data/vocabulary-n5-batch2.js`, `english-roadmap.html`, dan `audit-n5-vocabulary.js`.

## Ringkasan hasil

| Pemeriksaan | Hasil |
|---|---:|
| Entri Batch 1 | 400 |
| Entri Batch 2 | 400 |
| Total entri | 800 |
| Headword unik | 800 |
| Headword duplikat | 0 |
| Contoh kalimat identik | 0 |
| Kolom wajib kosong | 0 |
| Kategori di luar daftar yang diizinkan | 0 |
| Kolom bacaan mengandung kanji | 0 |
| Contoh tanpa tanda baca Jepang di akhir | 0 |
| Ketidaksesuaian katakana headword dengan kolom `kana` | 0 |
| Referensi file data hilang / urutan loader salah | 0 |

Pemeriksaan Node.js berjalan di GitHub Actions dan lulus. Ini membuktikan pemeriksaan struktur dan integrasi statis, bukan bahwa setiap arti, bacaan, contoh, dan terjemahan telah dibuktikan benar secara linguistik.

## Perbaikan yang dilakukan

1. Menormalkan 29 nilai kolom `kana` untuk headword katakana agar memakai ejaan katakana yang konsisten.
2. Mengganti lima entri yang hanya mengulang kata buah yang sudah ada dengan kosakata berbeda, tanpa mengubah total 800 entri:
   - `林檎` → `さくらんぼ` (buah ceri)
   - `蜜柑` → `メロン` (melon)
   - `葡萄` → `キウイ` (buah kiwi)
   - `苺` → `マンゴー` (mangga)
   - `西瓜` → `柿` (buah kesemek)
3. Memperjelas beberapa terjemahan, termasuk `林`, `お皿`, `マンション`, `風邪`, `連絡`, `普通`, dan `とにかく`.
4. Membuat contoh untuk lemon dan mentega lebih alami, dan memperbaiki contoh untuk `林`.
5. Memperbaiki urutan pemuatan kedua file data agar keduanya tersedia sebelum kode antarmuka kosakata berjalan.
6. Menambahkan workflow GitHub Actions supaya audit struktur dan integrasi statis berjalan otomatis pada perubahan berikutnya.

## Kosakata yang perlu ditinjau untuk level JLPT

Validator menandai 33 kandidat sebagai **materi tambahan yang perlu diperiksa**, bukan menyatakan kata-kata ini pasti bukan N5:

`台風`, `薬局`, `警察`, `警官`, `運転手`, `地震`, `汽車`, `新幹線`, `地下鉄`, `予約`, `会議`, `説明`, `連絡`, `経験`, `習慣`, `社会`, `歴史`, `科学`, `経済`, `政治`, `方法`, `種類`, `部分`, `途中`, `場合`, `近所`, `特に`, `なるべく`, `とにかく`, `せっかく`, `危険`, `必要`, `十分`.

JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Karena itu, daftar tersebut harus diperlakukan sebagai daftar tinjauan, bukan batas resmi N5. Beberapa kata dapat tetap berguna sebagai materi tambahan untuk pemula.

## Batas audit

- Skrip memeriksa jumlah, keunikan, kolom, kategori, bacaan, tanda baca, konsistensi katakana, dan urutan pemuatan data.
- Skrip tidak bisa memastikan kebenaran setiap terjemahan, nuansa pemakaian, atau tingkat JLPT secara otomatis.
- Integrasi sudah diperiksa secara statis; pemeriksaan ini bukan pengganti uji klik dan uji tampilan langsung di browser.
- Klaim yang aman saat ini: struktur 800 entri lulus audit otomatis, perbaikan yang teridentifikasi sudah diterapkan, dan 33 kandidat level ditandai untuk tinjauan lanjutan. Jangan menganggap hasil ini sebagai sertifikasi linguistik 100%.

## File terkait

- [Batch 1](../data/vocabulary-n5-batch1.js)
- [Batch 2](../data/vocabulary-n5-batch2.js)
- [Validator](../audit-n5-vocabulary.js)
- [Workflow audit](../.github/workflows/audit-n5-vocabulary.yml)
