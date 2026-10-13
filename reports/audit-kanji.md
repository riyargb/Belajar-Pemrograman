# Audit Kanji Lab — Status Terverifikasi

Tanggal pemeriksaan: 13 Oktober 2026  
Branch: `fix/kanji-audit-cleanup`  
Pull request: [#1](https://github.com/riyargb/Belajar-Pemrograman/pull/1)

## Inventaris

| Pemeriksaan | Hasil |
|---|---:|
| Entri kanji | 300 |
| Kanji unik | 300 |
| Kelompok N5 | 100 |
| Kelompok N4 | 200 |
| Kolom wajib kosong | 0 |
| Kunci yang bukan satu karakter | 0 |
| Headword kosakata tidak memuat kanji target | 0 |
| Contoh berpola generik lama | 0 |
| Terjemahan contoh kosong | 0 |
| Spasi mencurigakan yang terdeteksi | 0 |
| Penanda kunyomi eksplisit `—` | 37 |

`—` pada kolom kunyomi berarti bacaan tidak dicantumkan di dataset ini; itu bukan bacaan untuk dihafal. Pembagian N5/N4 adalah pengelompokan kurasi belajar, bukan klaim daftar resmi JLPT yang lengkap dan definitif.

## Perbaikan dan pengujian

- Memperbaiki spasi salah pada contoh dan bacaan, serta mengganti contoh generik dengan contoh kontekstual berterjemahan Indonesia.
- Memperketat `audit-kanji.js`: target jumlah, duplikasi, format onyomi/kunyomi, kolom wajib, format kosakata, tanda baca contoh, terjemahan, dan pola generik.
- Menambahkan smoke test UI Node dengan DOM tiruan untuk dek, filter, pencarian, kartu, progres, pemulihan data progres rusak, dan kuis.
- Menambahkan tes browser Playwright/Chromium pada viewport 390 px dan 1440 px; tes memeriksa level, pencarian, kartu, progres dan reload, kuis 10 soal, overflow horizontal, dan JavaScript error.

## Hasil CI terbaru pada commit yang diperiksa

- [Kanji data audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002517) — success.
- [Real browser UI tests](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002501) — success.
- [N5 vocabulary audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002523) — success.
- [N4 vocabulary audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002569) — success.

Commit yang diperiksa untuk empat workflow tersebut: `2a27e8cd34995a94d274496915086cf13c73104e`.

## Batasan yang belum boleh dianggap selesai

Lulusnya tes otomatis membuktikan struktur dan alur UI yang diuji, bukan kebenaran linguistik setiap entri. Proofreading independen untuk semua bacaan, arti, contoh, terjemahan, dan pengelompokan level 300 kanji **belum selesai**. Tes browser berjalan di Chromium headless pada CI, bukan pada perangkat Android fisik pengguna. Jangan menyebut dataset telah disertifikasi penutur asli.
