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


## Kandidat pemeriksaan linguistik lanjutan — belum dinyatakan salah

Pemeriksaan awal berbasis pola menemukan sejumlah bacaan kunyomi yang ditulis sebagai batang kata tanpa okurigana. Ini mungkin mengikuti konvensi ringkas dataset, tetapi perlu dipastikan konsisten dan jelas untuk pelajar pemula:

| Kanji | Kunyomi tercatat | Contoh kosakata | Hal yang perlu ditinjau |
|---|---|---|---|
| 大 | おお | 大学（だいがく） | Pastikan pembaca memahami bentuk lengkap seperti おおきい/おおい pada entri terkait |
| 書 | か | 書く（かく） | Pastikan notasi batang か dibedakan dari bentuk kata lengkap かく |
| 食 | た | 食べる（たべる） | Pastikan notasi batang た dibedakan dari bentuk kata lengkap たべる |
| 休 | やす | 休み（やすみ） | Pastikan notasi batang やす dibedakan dari bentuk kata lengkap やすむ |
| 作 | つく | 作る（つくる） | Pastikan notasi batang つく dibedakan dari bentuk kata lengkap つくる |
| 始 | はじ | 始まる（はじまる） | Pastikan notasi batang はじ dibedakan dari bentuk kata lengkap はじまる |
| 終 | お | 終わる（おわる） | Pastikan notasi batang お dibedakan dari bentuk kata lengkap おわる |
| 強 | つよ | 強い（つよい） | Pastikan notasi batang つよ dibedakan dari bentuk kata lengkap つよい |
| 弱 | よわ | 弱い（よわい） | Pastikan notasi batang よわ dibedakan dari bentuk kata lengkap よわい |
| 早 | はや | 早い（はやい） | Pastikan notasi batang はや dibedakan dari bentuk kata lengkap はやい |
| 多 | おお | 多い（おおい） | Pastikan notasi batang おお dibedakan dari bentuk kata lengkap おおい |
| 別 | わか | 別々（べつべつ） | Pastikan contoh kosakata dan kunyomi yang ditampilkan tidak memberi kesan bahwa 別々 dibaca わか |
| 有 | あ | 有名（ゆうめい） | Pastikan contoh kosakata berbasis onyomi tidak disalahartikan sebagai contoh kunyomi |

Kandidat di atas adalah **antrian review**, bukan klaim bahwa entri tersebut salah. Sebagian dataset mungkin sengaja memakai batang kunyomi tanpa okurigana. Sebelum mengubahnya, format tampilan dan aturan validasi harus diselaraskan agar bacaan lengkap bisa dijelaskan secara konsisten.

Pemeriksaan pola ini tidak menggantikan verifikasi kamus untuk setiap bacaan, arti, dan contoh. Audit linguistik 300 kanji dan 1.500 kosakata tetap terbuka sampai semua entri diperiksa satu per satu.


## Audit regresi satu lintasan — 13 Oktober 2026

Dataset KL_DATA diperiksa ulang langsung dari english-roadmap.html pada branch ini. Hasil parse: **300 entri, 300 karakter unik, 100 N5, 200 N4**. Pemeriksaan format otomatis tambahan menemukan 0 kolom wajib kosong, 0 format onyomi tidak valid, 0 format kunyomi tidak valid, 0 format headword kosakata tidak valid, dan 0 contoh tanpa pemisah/terjemahan atau tanda baca akhir yang diharapkan.

Hasil ini mengonfirmasi struktur dan format yang diuji, bukan ketepatan semantik seluruh bacaan. Sebanyak 123 nilai kunyomi pendek ditandai oleh aturan heuristik sederhana untuk perhatian; angka ini **bukan** jumlah kesalahan karena banyak daftar kanji memang menuliskan batang bacaan tanpa okurigana. Kandidat perlu dinilai menurut konvensi tampilan proyek, bukan diubah otomatis.
