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
| Penanda kunyomi eksplisit "—" untuk bacaan yang tidak dicantumkan | 36 |
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
- Mengubah 36 kolom kunyomi kosong menjadi penanda eksplisit "—". Penanda ini bukan bacaan; artinya bacaan kunyomi tidak dicantumkan dalam data belajar ini dan perlu pemeriksaan linguistik jika hendak dilengkapi.
- Memperkuat `audit-kanji.js` agar jumlah target, duplikasi, kolom wajib, headword, spasi mencurigakan, dan pola contoh generik dapat diperiksa.
- Menambahkan pemeriksaan integrasi statis untuk keberadaan elemen UI utama, fungsi kartu/filter/kuis, dan kunci penyimpanan progres.
- Menambahkan `.github/workflows/kanji-audit.yml` untuk menjalankan audit otomatis dengan Node.js saat ada push dan pull request.

## Batasan validasi

Pemeriksaan struktur tidak membuktikan bahwa seluruh onyomi/kunyomi, makna, klasifikasi N5/N4, contoh, atau terjemahan sudah sempurna. Label N5/N4 dipakai sebagai pengelompokan belajar praktis, bukan klaim daftar kanji resmi JLPT yang definitif. Sebagian contoh berbagi konteks karena karakter dipelajari melalui kosakata gabungan yang sama; ini wajar, tetapi seluruh kalimat tetap perlu pemeriksaan bahasa oleh penutur/pengajar yang kompeten.

## Pemeriksaan integrasi aplikasi

Kode yang ditinjau memuat filter level dan pencarian, daftar kartu, kuis, serta penyimpanan progres melalui `localStorage`. Audit otomatis memeriksa keberadaan ID dan fungsi utama, dan render detail menggunakan escaping teks. Peninjauan kode bukan pengganti uji klik di browser. Uji interaksi nyata pada perangkat/browser belum dapat diklaim lulus dari pemeriksaan source saja.

## Langkah validasi yang harus dijalankan pada checkout

1. `node audit-kanji.js`: **lulus pada GitHub Actions run #38343036164** (langkah audit selesai dengan sukses).
2. Buka halaman di browser dan uji filter N5/N4, pencarian, buka/tutup jawaban, kuis, tandai dipelajari, serta progres setelah reload — **belum diuji secara interaktif**.
3. Periksa tampilan saat `localStorage` diblokir/bersih — **belum diuji di browser**.
4. Lakukan proofreading linguistik akhir pada bacaan, kosakata, kalimat, dan terjemahan — **belum selesai untuk seluruh 300 entri**.

Catatan validasi: parsing ulang branch menghasilkan 300 entri, 300 unik, N5 100, N4 200, kolom wajib kosong 0, kunyomi kosong 0 (36 entri ditandai `—` sebagai penanda tinjauan, bukan bacaan), pola contoh generik 0, spasi mencurigakan 0 setelah aturan deteksi diperluas, dan headword mismatch 0. GitHub Actions workflow `Kanji data audit` selesai sukses pada run #38343036164 setelah perbaikan contoh dan perluasan deteksi spasi: https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38343036164. Parsing ulang sumber terbaru menghasilkan 300/300 entri unik (N5 100, N4 200), kolom wajib kosong 0, kunyomi kosong 0 (36 penanda `—`), contoh generik 0, mismatch headword 0, terjemahan kosong 0, dan spasi mencurigakan pada kosakata/contoh 0. Pemeriksaan ID dan fungsi UI statis lengkap. Namun, uji interaksi browser dan proofreading linguistik menyeluruh belum dilakukan; karena itu hasil ini belum boleh disebut audit final 100%.
