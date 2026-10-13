# Audit Kosakata Jepang N5 — 800 Entri

Tanggal pemeriksaan: 13 Oktober 2026  
Branch: `fix/kanji-audit-cleanup`  
Pull request: [#1](https://github.com/riyargb/Belajar-Pemrograman/pull/1)

## Inventaris data

| Pemeriksaan | Hasil |
|---|---:|
| Batch 1 | 400 |
| Batch 2 | 400 |
| Total | 800 |
| Headword unik | 800 |
| Headword duplikat | 0 |
| Contoh kalimat identik | 0 |
| Kolom wajib kosong | 0 |
| Kategori di luar daftar yang diizinkan | 0 |
| Kolom kana mengandung kanji | 0 |
| Contoh tanpa tanda baca Jepang di akhir | 0 |
| Ketidaksesuaian headword katakana dengan kolom kana | 0 |
| Referensi file hilang / urutan loader salah | 0 |

Cakupan data: `data/vocabulary-n5-batch1.js`, `data/vocabulary-n5-batch2.js`, `english-roadmap.html`, dan `audit-n5-vocabulary.js`.

## Perbaikan editorial yang telah dicatat

- Menormalkan ejaan kana untuk sejumlah headword katakana.
- Mengganti beberapa entri buah yang berulang dengan kata berbeda tanpa mengubah total 800.
- Memperjelas sejumlah terjemahan dan membuat contoh lebih kontekstual.
- Memperbaiki beberapa contoh yang janggal atau berulang, termasuk contoh untuk 国 dan 泳ぐ.
- Mengganti 汽車 dengan 電車 untuk konteks transportasi modern.
- Menyunting contoh keluarga, makanan/minuman, cuaca/alam, bahan makanan, musim, dan kebutuhan sehari-hari agar konteksnya lebih bermanfaat.

Perubahan tersebut merupakan penyuntingan editorial, bukan pengesahan seluruh data oleh penutur asli.

## Catatan tinjauan level

Sebagian kata dalam daftar N5 proyek dapat berfungsi sebagai materi tambahan yang lebih menantang. Kandidat yang pernah ditandai untuk tinjauan mencakup istilah seperti 台風, 薬局, 新幹線, 予約, 経験, 経済, dan 必要. Daftar itu bukan keputusan bahwa kata-kata tersebut pasti bukan N5. Karena JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level, N5 di sini merupakan pengelompokan belajar proyek, bukan daftar resmi definitif.

## Pengujian

- [N5 vocabulary audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002523) — success.
- [Real browser UI tests](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002501) — success.

Workflow terakhir diverifikasi pada commit `2a27e8cd34995a94d274496915086cf13c73104e`. Tes Chromium headless menguji viewport 390 px dan 1440 px, pergantian level, pencarian, kartu, progres dan reload, kuis kanji, horizontal overflow, serta JavaScript errors.

## Batasan yang belum boleh dianggap selesai

Audit struktural tidak membuktikan seluruh bacaan, makna, nuansa contoh, terjemahan, atau klasifikasi level benar. Proofreading independen untuk seluruh 800 entri N5 **belum selesai**. Tes browser dijalankan pada Chromium headless di GitHub Actions, bukan perangkat Android fisik pengguna. Jangan mengklaim dataset telah disertifikasi penutur asli.


## Pemeriksaan tambahan lintas contoh

Pemeriksaan ulang terhadap seluruh 800 entri pada dua batch menemukan **0 contoh kalimat Jepang yang identik**. Ini hanya memeriksa duplikasi persis; kalimat berbeda yang memakai pola terlalu mirip atau memiliki terjemahan yang kurang tepat tetap memerlukan penilaian manusia.

Kandidat level yang tercatat dalam skrip audit tetap harus diperlakukan sebagai antrian review, bukan kesimpulan otomatis bahwa kata tersebut salah level. Setiap kandidat perlu dinilai berdasarkan penggunaan, tingkat kesulitan, dan tujuan kurasi belajar.
