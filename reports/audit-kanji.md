# Audit Kanji — Pemeriksaan Struktural dan Integrasi

Tanggal pemeriksaan: 13 Oktober 2026

## Inventaris struktural

| Pemeriksaan | Hasil |
|---|---:|
| Total entri | 300 |
| Karakter unik | 300 |
| N5 | 100/100 |
| N4 | 200/200 |
| Kunci bukan satu karakter | 0 |
| Kolom wajib kosong (arti, onyomi, kosakata, contoh) | 0 |
| Kolom kunyomi kosong | 0 |
| Penanda kunyomi eksplisit "—" untuk bacaan yang tidak dicantumkan | 37 |
| Headword kosakata tidak memuat karakter kunci | 0 |
| Contoh kalimat dengan pola generik "という言葉を覚えます" | 0 |
| Contoh yang disunting pada putaran sebelumnya | 107 |
| Contoh generik yang diganti pada putaran terbaru | 103 |

**Target jumlah terpenuhi secara struktural:** 300 entri unik, terdiri dari 100 N5 dan 200 N4.

## Perubahan yang dilakukan

- Memperbaiki spasi janggal pada sejumlah contoh kalimat, termasuk typo `手紙を書 きます` menjadi `手紙を書きます` dan bacaan `先生（せん せい）` menjadi `先生（せんせい）`.
- Memperluas deteksi spasi mencurigakan agar juga menangkap spasi di antara kanji dan kana, yang terlewat oleh pola pemeriksaan sebelumnya.
- Menyunting 107 contoh kalimat dalam putaran sebelumnya.
- Mengganti seluruh 103 contoh berpola generik dengan kalimat kontekstual dan terjemahan Indonesia.
- Memperbaiki entri 用 agar kosakata yang ditampilkan memuat karakter target.
- Mengubah kolom kunyomi yang tidak dicantumkan menjadi penanda eksplisit "—" (37 entri pada hasil terbaru). Penanda ini bukan bacaan; artinya bacaan kunyomi tidak dicantumkan dalam data belajar ini dan perlu pemeriksaan linguistik jika hendak dilengkapi.
- Memperkuat `audit-kanji.js` agar jumlah target, duplikasi, kolom wajib, headword, spasi mencurigakan, dan pola contoh generik dapat diperiksa.
- Menambahkan pemeriksaan integrasi statis untuk keberadaan elemen UI utama, fungsi kartu/filter/kuis, dan kunci penyimpanan progres.
- Menambahkan `test-kanji-ui.js`, smoke test runtime Node dengan DOM tiruan untuk dek 300 kartu, filter N5/N4, pencarian kosong/terisi, buka kartu, tandai hafal, simpan/muat progres, pemulihan data progres rusak, dan alur kuis. Workflow CI menjalankan test ini setelah audit data.
- Memperbaiki bacaan kunyomi `気` yang meragukan menjadi penanda `—`, mengganti contoh kosakata kucing menjadi `猫（ねこ）`, menggunakan `今（いま）` sebagai contoh bacaan dasar, memperjelas bacaan `へ` pada `下手`, menambahkan bacaan `ニ` yang dipakai dalam `日本`, menambahkan bacaan `え` pada `笑顔`, dan memperluas gloss `兄弟` agar mencakup makna saudara kandung.
- Menambahkan `.github/workflows/kanji-audit.yml` untuk menjalankan audit otomatis dengan Node.js saat ada push dan pull request.

## Batasan validasi

Pemeriksaan struktur tidak membuktikan bahwa seluruh onyomi/kunyomi, makna, klasifikasi N5/N4, contoh, atau terjemahan sudah sempurna. Label N5/N4 dipakai sebagai pengelompokan belajar praktis, bukan klaim daftar kanji resmi JLPT yang definitif. Sebagian contoh berbagi konteks karena karakter dipelajari melalui kosakata gabungan yang sama; ini wajar, tetapi seluruh kalimat tetap perlu pemeriksaan bahasa oleh penutur/pengajar yang kompeten.

## Pemeriksaan integrasi aplikasi

Kode yang ditinjau memuat filter level dan pencarian, daftar kartu, kuis, serta penyimpanan progres melalui `localStorage`. Audit otomatis memeriksa keberadaan ID dan fungsi utama, dan render detail menggunakan escaping teks. Peninjauan kode bukan pengganti uji klik di browser. Uji interaksi nyata pada perangkat/browser belum dapat diklaim lulus dari pemeriksaan source saja.

## Langkah validasi yang harus dijalankan pada checkout

1. `node audit-kanji.js`: **lulus** pada GitHub Actions run #38343779322.
2. `node test-kanji-ui.js`: **lulus** pada run yang sama; ini adalah smoke test dengan DOM tiruan di Node.js, bukan pengujian browser sungguhan.
3. Buka halaman di browser dan uji filter N5/N4, pencarian, buka/tutup jawaban, kuis, tandai dipelajari, serta progres setelah reload — **belum diuji secara interaktif di browser**.
4. Periksa tampilan saat `localStorage` diblokir/bersih di browser — **belum diuji di browser**. Kode penyimpanan sudah menangani exception, dan test menguji pemulihan nilai progres rusak.
5. Lakukan proofreading linguistik akhir pada bacaan, kosakata, kalimat, klasifikasi level, dan terjemahan — **belum selesai untuk seluruh 300 entri**.

Catatan validasi: parsing ulang branch menghasilkan 300 entri, 300 unik, N5 100, N4 200, kolom wajib kosong 0, kunyomi kosong 0 (36 entri ditandai `—` sebagai penanda tinjauan, bukan bacaan), pola contoh generik 0, spasi mencurigakan 0 setelah aturan deteksi diperluas, dan headword mismatch 0. GitHub Actions `Kanji data audit` dan smoke test UI lulus pada revisi terbaru yang diperiksa, run #38343779322: https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38343779322. Audit kosakata N5 juga lulus pada run #38343779312: https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38343779312. Parsing ulang sumber terbaru menghasilkan 300/300 entri unik (N5 100, N4 200), kolom wajib kosong 0, 37 penanda kunyomi `—`, contoh generik 0, mismatch headword 0, terjemahan kosong 0, dan spasi mencurigakan pada kosakata/contoh 0. Pemeriksaan ID dan fungsi UI statis lengkap. Smoke test menggunakan DOM tiruan dan tidak menggantikan browser real; proofreading linguistik menyeluruh masih belum selesai sehingga hasil ini belum boleh disebut audit linguistik final 100%.


## Pembaruan CI — 13 Oktober 2026

Commit yang diuji: `67b22c21d827a71e9a0027bbb3c5bb0c3558453f`.

- [Kanji data audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354849760) — **success**.
- [N4 vocabulary audit + UI smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354849765) — **success**.
- [N5 vocabulary audit + UI smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354849739) — **success**.

Tes baru laboratorium kosakata memakai DOM tiruan dan memeriksa pemuatan N5/N4, pencarian tanpa hasil, filter kategori, buka/tutup jawaban, kartu berikutnya, tandai hafal, daftar checkbox, serta penyimpanan progres terpisah per level dan pemulihan progres saat skrip dimuat ulang. Ini memperluas cakupan tes runtime otomatis, tetapi **belum merupakan pengujian browser nyata pada HP/desktop**. Peninjauan linguistik seluruh 300 kanji secara independen juga tetap belum lengkap.


## Regresi penyimpanan progres kosakata — pembaruan terbaru

Commit kode yang diuji: `50ffaec69fbefa38d33d6501d72de2972ece2cd6`.

- [Kanji data audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354991023) — **success**.
- [N4 vocabulary audit + runtime smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354990936) — **success**.
- [N5 vocabulary audit + runtime smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354990961) — **success**.

Kode laboratorium kosakata kini memvalidasi data progres dari `localStorage`: JSON rusak, array, atau nilai progres yang bukan boolean `true` dibuang dengan aman. Tes mencakup pemulihan JSON rusak, bentuk array yang salah, dan nilai progres yang tidak valid. Ini tetap merupakan uji DOM tiruan; browser nyata dan audit linguistik independen belum tuntas.


## Validasi tambahan — audit bacaan dan browser nyata

Commit kode dan tes terbaru yang diuji: `76e0169592cefd2549bb676f94b98434271eb175`.

- [Kanji audit dengan pemeriksaan skema yang diperketat](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38355896057) — **success**. Pemeriksaan kini juga menolak format onyomi yang bukan katakana, kunyomi yang bukan hiragana/penanda eksplisit, format kosakata tanpa bacaan/gloss, contoh tanpa pemisah, tanda baca Jepang, atau terjemahan kosong.
- [Uji UI Chromium nyata](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38355896037) — **success**. Playwright menjalankan halaman pada viewport ponsel 390 px dan desktop 1440 px; menguji pemilihan N5/N4, buka jawaban, kartu berikutnya, pencarian kosong, progres kosakata dan kanji, penyimpanan progres, serta alur kuis 10 soal. Tes juga memeriksa tidak ada horizontal overflow dan tidak ada uncaught JavaScript error.
- [Audit kosakata N5](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38355856976) — **success** pada commit kode yang sama sebelum penambahan tes browser terakhir; perubahan setelah itu hanya pada skrip tes browser.
- [Audit kosakata N4](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38355856996) — **success** pada commit kode yang sama sebelum penambahan tes browser terakhir; perubahan setelah itu hanya pada skrip tes browser.

Penting: browser automation membuktikan alur UI yang diuji berjalan di Chromium CI, bukan pengujian pada perangkat Android milik pengguna. Validasi struktur dan skema juga tidak menggantikan proofreading independen seluruh bacaan, arti, level, contoh, dan terjemahan 1.500 kosakata serta 300 kanji. Tinjauan linguistik menyeluruh masih menjadi satu-satunya blokir substansial sebelum materi layak disebut final secara bahasa.
