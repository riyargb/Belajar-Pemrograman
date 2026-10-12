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

## Pemeriksaan bahasa lanjutan — 13 Oktober 2026

Dalam pemeriksaan lanjutan, ditemukan dan diperbaiki dua masalah pada contoh kalimat:

1. `国`: `国へ行きたいです。` diterjemahkan secara janggal sebagai “Saya ingin pergi ke negara.” Diganti menjadi `私の国はインドネシアです。` (“Negara saya adalah Indonesia.”).
2. `泳ぐ`: contoh kalimatnya identik dengan entri `海`. Diganti menjadi `毎週プールで泳ぎます。` (“Saya berenang di kolam renang setiap minggu.”).

Setelah perbaikan tersebut, contoh kalimat yang identik tidak lagi ditemukan dalam pemeriksaan duplikasi data.

Selain itu, entri transportasi `汽車` diganti menjadi `電車` karena `電車` lebih umum dan lebih berguna untuk konteks pemula modern, serta contoh `運転手` diubah menjadi kalimat yang lebih langsung dan alami: `運転手がバスを運転しています。`.


**Status audit bahasa:** ini adalah tinjauan editorial awal, bukan validasi oleh penutur asli atau sertifikasi materi JLPT. Masih diperlukan peninjauan menyeluruh untuk nuansa, bacaan kanji berdasarkan konteks, ketepatan seluruh terjemahan, serta kesesuaian level. Kandidat pada bagian berikut diperlakukan sebagai kosakata tambahan untuk ditinjau, bukan otomatis salah atau harus dihapus.

## Kosakata yang perlu ditinjau untuk level JLPT

Validator menandai 33 kandidat sebagai **materi tambahan yang perlu diperiksa**, bukan menyatakan kata-kata ini pasti bukan N5:

`台風`, `薬局`, `警察`, `警官`, `運転手`, `地震`, `電車`, `新幹線`, `地下鉄`, `予約`, `会議`, `説明`, `連絡`, `経験`, `習慣`, `社会`, `歴史`, `科学`, `経済`, `政治`, `方法`, `種類`, `部分`, `途中`, `場合`, `近所`, `特に`, `なるべく`, `とにかく`, `せっかく`, `危険`, `必要`, `十分`.

JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Karena itu, daftar tersebut harus diperlakukan sebagai daftar tinjauan, bukan batas resmi N5. Beberapa kata dapat tetap berguna sebagai materi tambahan untuk pemula.


## Pemeriksaan tambahan — 13 Oktober 2026

- Jumlah entri yang terbaca: **800** (400 per batch).
- Tidak ditemukan kata kepala duplikat atau contoh kalimat yang identik dalam pemeriksaan otomatis saat ini.
- Tidak ditemukan kolom wajib kosong.
- Kolom `kana` tidak memuat kanji; kolom `bacaan` seluruhnya memakai karakter kana/tanda baca yang diizinkan oleh pemeriksaan statis.
- Daftar kandidat level diselaraskan dengan data terbaru: `汽車` telah diganti menjadi `電車` dalam batch 2.
- Hasil ini memperkuat pemeriksaan struktur, tetapi **belum membuktikan** semua bacaan kanji, terjemahan, nuansa kalimat, atau klasifikasi level sudah benar. Pemeriksaan bahasa secara menyeluruh tetap perlu dilakukan secara editorial.

### Perbaikan konteks kosakata keluarga

- `お父さん`, `お母さん`, `お兄さん`, `お姉さん`, dan `奥さん` kini memakai contoh dengan konteks keluarga orang lain (`田中さんの...`) agar selaras dengan penjelasan maknanya.
- `主人` mendapat contoh kalimat yang lebih informatif; catatan makna menyebutnya sebagai sebutan tradisional.

### Perbaikan contoh makanan dan minuman

- Mengganti contoh yang terlalu berulang untuk `肉`, `牛肉`, `豚肉`, `鶏肉`, `魚`, `野菜`, dan `果物` dengan kalimat yang lebih informatif dan bervariasi.
- Memperbaiki contoh `酒` dan `ビール` yang sebelumnya menyebut minum alkohol setiap pagi; contoh baru menggunakan konteks makan malam dan berkumpul bersama teman.
- Bacaan kana dan terjemahan diperbarui mengikuti kalimat baru. Ini adalah penyuntingan editorial, bukan pengesahan tingkat JLPT.

### Audit sekaligus: lingkungan, cuaca, makanan, dan ungkapan sehari-hari

Pemeriksaan editorial tambahan menemukan beberapa contoh yang secara tata bahasa dapat dipahami tetapi tidak cocok dengan makna atau konteks sehari-hari. Perbaikan diterapkan pada 35 entri di Batch 2, terutama:

- Bentuk alam/cuaca (`砂`, `葉`, `丘`, `池`, `湖`, `浜`, `砂浜`, `雲`, `星`, `太陽`, `氷`, `煙`, `温度`, `気温`, `季節`) diberi contoh yang lebih sesuai secara semantis; contoh yang sebelumnya menempatkan pantai, danau, suhu, dan sebagainya secara janggal di gunung diperbaiki.
- Bahan makanan (`玉葱`, `人参`, `じゃが芋`, `大根`, `キャベツ`, `白菜`, `胡瓜`, `茄子`, `豆`, `味噌`, `酢`, `油`) diberi contoh penggunaan yang lebih alami dalam memasak.
- Ungkapan makanan (`朝ご飯`, `昼ご飯`, `晩ご飯`, `弁当`, `お菓子`) diperbaiki agar terjemahan bahasa Indonesianya alami dan contoh tidak sekadar mengulang pola yang sama.
- `無料` kini memakai konteks masuk museum gratis untuk anak-anak, `農場` memakai contoh pemeliharaan hewan ternak, dan `指` memakai contoh menunjukkan lokasi di peta.

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
