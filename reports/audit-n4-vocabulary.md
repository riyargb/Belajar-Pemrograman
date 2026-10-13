# Audit Kosakata Jepang N4 — 700 Entri

Tanggal pemeriksaan: 13 Oktober 2026  
Branch: `fix/kanji-audit-cleanup`  
Pull request: [#1](https://github.com/riyargb/Belajar-Pemrograman/pull/1)

## Inventaris data

| Pemeriksaan | Hasil |
|---|---:|
| Target kurasi N4 | 700 |
| File batch | 16 |
| Entri terhimpun | 700 |
| Headword unik | 700 |
| Duplikasi headword internal | 0 |
| Overlap headword dengan data N5 proyek | 0 |
| Kolom wajib per entri | 7 |

Data berada di `data/vocabulary-n4-batch1.js` sampai `data/vocabulary-n4-batch16.js`. Setiap entri memiliki `jp`, `kana`, `arti`, `kelas`, `contoh`, `bacaan`, dan `terjemahan`.

## Integrasi dan pengujian

- File batch N4 dimuat sebelum loader UI kosakata.
- Pemilih N5/N4 dan penyimpanan progres per level tersedia.
- Validator memeriksa struktur batch, kolom wajib, kategori, format bacaan, headword duplikat, total 700, overlap dengan data N5, dan integrasi loader.
- Smoke test runtime memakai DOM tiruan untuk level, pencarian/filter, kartu, progres, dan pemulihan progres rusak.
- Tes browser Playwright/Chromium menjalankan alur UI di viewport ponsel 390 px dan desktop 1440 px, termasuk pergantian level, pencarian, progres/reload, kuis kanji, overflow horizontal, dan uncaught JavaScript errors.

## Hasil CI terbaru yang tersedia

- [N4 vocabulary audit](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002569) — success.
- [Real browser UI tests](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38356002501) — success.

Workflow ini terakhir diverifikasi pada commit `2a27e8cd34995a94d274496915086cf13c73104e`; dokumentasi audit sedang diperbarui setelah pemeriksaan tersebut.

## Referensi dan batasan level

Referensi pihak ketiga yang digunakan dalam riset sebelumnya:
1. [Jepang.org — Daftar Kosakata JLPT N4](https://jepang.org/jlpt/n4/kosakata)
2. [LTL Japanese — JLPT N4 Vocabulary List](https://www.jlpt-quiz.com/blog/jlpt-n4-vocabulary-list)

Referensi tersebut bukan daftar resmi JLPT. JLPT tidak menyediakan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Angka 700 adalah target kurasi proyek, bukan jumlah resmi atau jaminan kata-kata yang akan muncul di ujian.

## Batasan yang belum boleh dianggap selesai

Audit otomatis dan tes browser tidak membuktikan setiap bacaan, arti, contoh, terjemahan, atau klasifikasi level tepat secara linguistik. Proofreading independen seluruh 700 entri N4 **belum selesai**. Dataset tidak boleh disebut tervalidasi penuh atau disertifikasi penutur asli.


## Pemeriksaan tambahan lintas contoh

Pemeriksaan ulang terhadap seluruh 700 entri pada 16 batch menemukan **0 contoh kalimat Jepang yang identik**. Ini tidak menjamin bahwa contoh yang berbeda semuanya alami, kontekstual, atau diterjemahkan dengan tepat.

Audit linguistik berikutnya harus memeriksa tiap pasangan headword/kana, makna, kelas kata, contoh, bacaan contoh, dan terjemahan Indonesia. Kandidat level harus dicatat sebagai bahan review, bukan otomatis dihapus atau dipindahkan hanya berdasarkan intuisi.
