# Audit Akhir Kanji — Status Terverifikasi

Tanggal pemeriksaan: 13 Oktober 2026

## Ringkasan

**Status rilis: TERBLOKIR — target 300 kanji belum terpenuhi.**

Dataset kanji saat ini ditanam langsung di `english-roadmap.html` pada array `KL_DATA`.

| Pemeriksaan | Hasil saat diperiksa |
|---|---:|
| Total entri kanji | 100 |
| Karakter unik | 100 |
| Duplikasi karakter internal | 0 |
| Label N5 | 49 |
| Label N4 | 51 |
| Target N5 | 100 |
| Target tambahan N4 | 200 |
| Kekurangan terhadap target | 200 entri |

Inventaris dihitung dari array data yang ada, bukan dari label antarmuka. Data saat ini tidak memenuhi target 100 kanji N5 + 200 kanji N4. Karena itu, fitur tidak boleh dinyatakan selesai berdasarkan target tersebut.

## Status PR dan branch

Pencarian PR pada integrasi GitHub yang tersedia tidak mengembalikan PR terbuka maupun PR yang cocok dengan kata kunci kanji. Pencarian branch hanya menampilkan `main`. Perubahan flashcard kanji ditemukan sebagai commit langsung:

- [Commit penambahan flashcard kanji](https://github.com/riyargb/Belajar-Pemrograman/commit/9d79156b8e6dcce6ed89c4bd1cdb2e50fcaca408)

Audit ini tidak dapat mengonfirmasi adanya PR terpisah berisi 100 kanji N5 dan 200 kanji N4. Jika PR tersebut berada di fork atau repository lain, tautannya perlu ditemukan sebelum perubahan PR dapat diperiksa.

## Temuan implementasi

1. Dataset kurang 200 entri: ada 49 label N5 dan 51 label N4, bukan 100 + 200.
2. Label level perlu ditinjau secara editorial. JLPT tidak menerbitkan daftar resmi kanji tertutup yang membuktikan level setiap karakter.
3. Progres hafalan menggunakan karakter sebagai kunci. Pertahankan pendekatan ini saat dataset diperluas agar progres tidak hilang.
4. Kuis mengambil pilihan jawaban salah dari seluruh dataset, meskipun pengguna memilih level tertentu. Kuis N5 dapat menampilkan pilihan kanji berlabel N4; sebaiknya distraktor mengikuti level terpilih.
5. Audit otomatis tidak membuktikan kebenaran bacaan onyomi/kunyomi, arti, kosakata, contoh kalimat, atau terjemahan.

## Langkah penutupan

- Tambahkan dan tinjau 51 kanji N5 lagi untuk mencapai 100.
- Tambahkan dan tinjau 149 kanji N4 lagi untuk mencapai 200.
- Periksa bacaan, arti, kosakata contoh, kalimat, dan terjemahan setiap entri.
- Perbaiki distraktor kuis agar mengikuti level yang sedang dipilih.
- Tambahkan pemeriksaan otomatis jumlah, keunikan, kolom, dan integrasi setelah dataset diperbarui.
- Verifikasi PR yang benar bila perubahan kanji memang diajukan melalui PR.

## Batas klaim

Hasil saat ini membuktikan inventaris berisi 100 karakter unik: 49 berlabel N5 dan 51 berlabel N4. Audit ini tidak menyatakan target 300 sudah tercapai, tidak mengesahkan semua bacaan/arti, dan tidak mengklaim daftar tersebut resmi JLPT.
