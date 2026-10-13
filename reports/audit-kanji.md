# Audit Kanji — Pemeriksaan Struktural dan Tindak Lanjut Bahasa

Tanggal pemeriksaan: 13 Oktober 2026

## Inventaris

| Pemeriksaan | Hasil |
|---|---:|
| Total entri | 300 |
| Karakter unik | 300 |
| N5 | 100/100 |
| N4 | 200/200 |
| Kunci bukan satu karakter | 0 |
| Kolom wajib kosong (arti, onyomi, kosakata, contoh) | 0 |
| Entri dengan kunyomi kosong untuk tinjauan | 36 |
| Headword kosakata tidak memuat karakter kunci | 0 |
| Entri contoh yang telah disunting dalam dua putaran | 72 |

**Target jumlah terpenuhi secara struktural:** 300 entri unik, terdiri dari 100 N5 dan 200 N4.

## Perbaikan audit tahap ini

- Memperbaiki contoh dengan spasi keliru yang ditemukan sebelumnya, termasuk 足 dan 時.
- Menyunting 72 contoh kalimat menjadi lebih kontekstual dan memperbaiki spasi yang janggal, dengan terjemahan Indonesia.
- Memperbaiki entri 用: kosakata diubah dari 必要（ひつよう） yang tidak memuat karakter 用 menjadi 使用（しよう）— penggunaan; contoh menjadi この道具を使用します。— Saya menggunakan alat ini.
- Memperkuat `audit-kanji.js` untuk memperingatkan jika headword kosakata tidak memuat karakter kunci.
- Menambahkan peringatan tinjauan bagi kolom kunyomi kosong. Kunyomi kosong tidak otomatis berarti salah, karena sebagian karakter lebih umum dipelajari melalui gabungan kanji; tiap kasus tetap perlu dikonfirmasi.

## Tinjauan linguistik yang masih diperlukan

Pemeriksaan pola teks bukan pengganti pemeriksaan oleh pembelajar mahir atau pengajar bahasa Jepang. Bacaan onyomi/kunyomi, arti, kecocokan kosakata, kewajaran kalimat, dan terjemahan masih harus diverifikasi. Masih ada 138 entri dengan pola kalimat latihan seragam, misalnya 「…」という言葉を覚えます。 Pola itu dapat dipahami, tetapi perlu disunting bertahap agar contoh lebih alami dan beragam.

Label N5/N4 dipakai sebagai pengelompokan belajar praktis; ini bukan klaim daftar kanji resmi JLPT yang definitif.

## Pengujian lanjutan

1. Jalankan `node audit-kanji.js` pada checkout branch untuk melihat peringatan lengkap.
2. Tinjau setiap peringatan kunyomi dan kosakata.
3. Verifikasi contoh kalimat dan terjemahan secara linguistik.
4. Uji kartu kanji, filter level, kuis, serta penyimpanan progres.
5. Baru setelah itu pertimbangkan merge PR.

Catatan: angka di atas dihitung dengan mem-parse isi file branch melalui tool GitHub. Perintah Node.js belum dijalankan dalam checkout lokal; laporan ini tidak mengklaim demikian.
