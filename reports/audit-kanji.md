# Audit Kanji — Status Setelah Penambahan Dataset

Tanggal pemeriksaan: 13 Oktober 2026

## Ringkasan inventaris

**Target struktural tercapai:** dataset memuat 300 entri unik dengan 100 berlabel N5 dan 200 berlabel N4.

| Pemeriksaan | Hasil |
|---|---:|
| Total entri yang diparse | 300 |
| Karakter unik | 300 |
| Entri berlabel N5 | 100/100 |
| Entri berlabel N4 | 200/200 |
| Kunci yang bukan satu karakter kanji | 0 |
| Duplikasi karakter | 0 |
| Kolom wajib kosong (arti, onyomi, kosakata, contoh) | 0 |
| Contoh dengan pola spasi mencurigakan yang diperiksa | 0 |

Dataset ada di array `KL_DATA` dalam `english-roadmap.html`. Penambahan ini mempertahankan 100 entri lama dan menambahkan 51 entri N5 serta 149 entri N4. Pemeriksaan di atas dilakukan pada konten file di branch, menggunakan parser struktural yang sepadan dengan pola pada `audit-kanji.js`; belum diklaim sebagai eksekusi Node.js di checkout lokal.

## Status kualitas bahasa

**Status rilis: perlu tinjauan linguistik sebelum dinyatakan final.**

Audit struktural memastikan jumlah, keunikan kunci, format, dan kelengkapan kolom. Audit ini **tidak** membuktikan bahwa setiap onyomi/kunyomi, arti, kosakata, contoh kalimat, atau terjemahan sudah benar dan alami. Contoh kalimat pada entri baru saat ini memakai pola latihan seragam untuk menghafal kosakata; pola ini sengaja konsisten, tetapi sebaiknya ditinjau dan dibuat lebih alami/beragam dalam audit editorial berikutnya.

Label N5/N4 adalah pengelompokan belajar praktis, bukan klaim bahwa ada daftar kanji resmi JLPT yang menetapkan setiap karakter secara definitif.

## Perubahan pada branch

- Menambahkan 51 entri berlabel N5 dan 149 entri berlabel N4.
- Memastikan setiap kunci adalah satu karakter kanji, tidak ada kunci duplikat, dan kolom wajib terisi.
- Memperkuat `audit-kanji.js` agar mendeteksi kunci multi-karakter.
- Memperbaiki tiga contoh kalimat yang sebelumnya memiliki spasi salah.

## Langkah berikutnya

1. Tinjau bacaan dan arti setiap kanji.
2. Verifikasi kosakata, bacaan kana, contoh kalimat, dan terjemahan.
3. Jalankan `node audit-kanji.js` di checkout repository setelah perubahan diambil.
4. Uji tampilan flashcard, filter level, kuis, dan penyimpanan progres sebelum merge.

**Kesimpulan:** target jumlah 100 N5 + 200 N4 sudah tercapai secara struktural. Dataset belum boleh disebut tervalidasi secara linguistik sampai pemeriksaan manual selesai.
