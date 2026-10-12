# Audit Kosakata JLPT N4

Tanggal mulai: 13 Oktober 2026  
Status: **Sedang dikerjakan — batch awal, bukan rilis final**

## Target kerja

Target operasional proyek: 700 entri N4 yang ditinjau. Angka 700 adalah target kurasi proyek, bukan angka resmi JLPT. JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk setiap level.

## Referensi awal

- Jepang.org, **Daftar Kosakata JLPT N4 Lengkap**: https://jepang.org/jlpt/n4/kosakata — halaman tersebut menyajikan 582 item dan menjelaskan N4 sebagai tambahan kosakata di atas N5. Diakses 13 Oktober 2026.
- LTL Japanese, **JLPT N4 Vocabulary List**: https://www.jlpt-quiz.com/blog/jlpt-n4-vocabulary-list — menyajikan daftar 571 kata yang diposisikan sebagai kosakata baru N4. Diakses 13 Oktober 2026.

Kedua daftar adalah referensi pembelajaran pihak ketiga, bukan daftar resmi JLPT. Daftar proyek akan diperiksa silang dan ditandai jika tingkatnya tidak pasti. Jangan menganggap setiap entri otomatis resmi N4 hanya karena muncul di sebuah daftar.

## Batch 1 — status awal

- Entri disimpan di `data/vocabulary-n4-batch1.js`.
- Setiap entri memiliki headword, kana, arti Indonesia, kelas kata, contoh Jepang, bacaan contoh, dan terjemahan Indonesia.
- Audit otomatis memeriksa kolom wajib, kategori, penggunaan kana, tanda baca, duplikasi, dan overlap headword terhadap 800 entri N5 proyek.
- Pemeriksaan otomatis tidak dapat membuktikan bahwa setiap bacaan kanji, nuansa arti, contoh, terjemahan, atau klasifikasi JLPT sudah benar. Temuan linguistik harus ditinjau dan dicatat selama batch berikutnya dibuat.

## Rencana produksi

- Bangun hingga 700 entri dalam batch bertahap.
- Jalankan `node audit-n4-vocabulary.js` setiap kali data berubah.
- Jangan lanjut menambah batch jika ada hard error.
- Tinjau manual bacaan dan terjemahan yang ambigu; tandai status level yang belum pasti.
- Setelah target tercapai, jalankan audit akhir, cek integrasi aplikasi, dan perbarui laporan dengan angka nyata serta semua keterbatasan yang tersisa.
