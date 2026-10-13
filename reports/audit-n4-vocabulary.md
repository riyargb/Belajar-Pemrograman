# Audit Kosakata JLPT N4 — 700 Entri

Tanggal pembaruan: 13 Oktober 2026  
Status: **700 entri telah disusun; audit otomatis struktural/integrasi N4 lulus. Tinjauan linguistik menyeluruh tetap diperlukan.**

## Ringkasan data saat ini

| Pemeriksaan inventaris | Hasil |
|---|---:|
| Target kurasi proyek | 700 entri |
| Batch data | 16 |
| Entri terhimpun | 700 |
| Headword unik di N4 | 700 |
| Duplikasi headword internal N4 | 0 |
| Overlap headword dengan 800 entri N5 proyek | 0 |
| Kolom per entri | 7 |

Data tersimpan pada `data/vocabulary-n4-batch1.js` sampai `data/vocabulary-n4-batch16.js`. Setiap entri berisi `jp`, `kana`, `arti`, `kelas`, `contoh`, `bacaan`, dan `terjemahan`.

Angka di atas merupakan pemeriksaan inventaris lintas file. Workflow audit N4 berhasil pada commit `598d251d`: https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38298722683

Audit tersebut sempat menemukan satu kesalahan bacaan pada contoh `気づく` di batch 8 (kanji tertinggal di kolom bacaan). Bacaan diperbaiki menjadi kana penuh, lalu audit dijalankan ulang dan lulus. Audit N5 juga lulus setelah validator integrasi diperbarui untuk mendukung pemilih level N5/N4: https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38298815671.

## Integrasi aplikasi

- Semua 16 file N4 ditambahkan sebagai skrip sebelum loader kosakata.
- Laboratorium kosakata memiliki pemilih level **N5 / N4**.
- Progres hafalan disimpan dengan kunci terpisah per level agar progres N5 lama tidak bercampur dengan N4.
- Validator memeriksa bahwa file N4 direferensikan aplikasi dan dimuat sebelum loader.

## Referensi pembelajaran

1. Jepang.org, [Daftar Kosakata JLPT N4 Lengkap](https://jepang.org/jlpt/n4/kosakata) — halaman menyajikan 582 item kosakata N4. Diakses 13 Oktober 2026.
2. LTL Japanese, [JLPT N4 Vocabulary List](https://www.jlpt-quiz.com/blog/jlpt-n4-vocabulary-list) — halaman menyajikan 571 kata yang diposisikan sebagai kosakata baru N4. Diakses 13 Oktober 2026.

Referensi tersebut adalah materi pihak ketiga, bukan daftar resmi JLPT. JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Karena itu, **700 adalah target kurasi proyek**, bukan angka resmi atau jaminan bahwa semua kata akan muncul dalam ujian N4.

## Metode audit

### Pemeriksaan otomatis

Validator `audit-n4-vocabulary.js` memeriksa:

- file batch dapat dimuat sebagai array;
- kolom wajib terisi dan kategori termasuk daftar yang diizinkan;
- kolom bacaan tidak mengandung kanji atau huruf Latin;
- konsistensi bacaan untuk headword katakana;
- tanda baca contoh dan bacaan;
- keunikan headword di antara batch N4;
- tidak ada headword N4 yang bertumpang tindih dengan data N5 saat ini;
- total rilis tepat 700;
- semua skrip batch N4 dimuat sebelum loader aplikasi dan pemilih level tersedia.

### Batasan pemeriksaan

Pemeriksaan otomatis tidak bisa membuktikan seluruh nuansa arti, bacaan kanji berdasarkan konteks, tata bahasa, kewajaran contoh, atau ketepatan terjemahan Indonesia. Sebagian entri adalah kosakata tambahan tingkat dasar-lanjutan yang perlu pemeriksaan editorial; daftar N4 ini tidak boleh disebut sebagai daftar resmi JLPT atau hasil validasi penutur asli.

## Pekerjaan lanjutan sebelum dinyatakan final

- Tunggu hasil workflow audit terbaru dan perbaiki semua hard error jika ada.
- Tinjau manual contoh, bacaan, makna, dan terjemahan yang berpotensi ambigu.
- Uji laboratorium kosakata pada tampilan aplikasi: pemilihan level, pencarian, filter, kartu, tandai hafal, dan progres terpisah.
- Catat setiap temuan linguistik yang masih belum terselesaikan, alih-alih mengklaim semua entri sempurna.


## Uji runtime laboratorium kosakata — 13 Oktober 2026

Workflow [N4 audit dan UI smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354849765) selesai dengan status **success** pada commit `67b22c21d827a71e9a0027bbb3c5bb0c3558453f`. Tes DOM tiruan memverifikasi bahwa aplikasi memuat 700 entri N4, level N4 tidak mencampur progres N5, pencarian dan filter memperbarui tampilan, kartu bisa dibuka/ditutup dan dilanjutkan, tandai hafal dan checkbox daftar menyimpan progres.

Batasan: ini adalah smoke test otomatis dengan DOM tiruan, bukan browser sesungguhnya. Pemeriksaan linguistik manual menyeluruh atas 700 entri N4 tetap merupakan pekerjaan yang belum selesai; hasil struktural tidak membuktikan setiap bacaan, arti, contoh, terjemahan, atau klasifikasi level benar.
