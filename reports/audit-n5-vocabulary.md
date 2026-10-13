# Audit Kosakata Jepang N5 — 800 Entri

Tanggal audit terakhir diperbarui: 13 Oktober 2026  
Cakupan: `data/vocabulary-n5-batch1.js`, `data/vocabulary-n5-batch2.js`, `english-roadmap.html`, dan `audit-n5-vocabulary.js`.

## Ringkasan hasil

| Pemeriksaan | Hasil |
|---|---:|
| Entri Batch 1 | 400 |
| Entri Batch 2 | 400 |
| Total entri | 800 |
| Headword unik | 800 |
| Headword duplikat | 0 |
| Contoh kalimat identik | 0 |
| Kolom wajib kosong | 0 |
| Kategori di luar daftar yang diizinkan | 0 |
| Kolom bacaan mengandung kanji | 0 |
| Contoh tanpa tanda baca Jepang di akhir | 0 |
| Ketidaksesuaian katakana headword dengan kolom `kana` | 0 |
| Referensi file data hilang / urutan loader salah | 0 |

Pemeriksaan Node.js berjalan di GitHub Actions dan lulus. Ini membuktikan pemeriksaan struktur dan integrasi statis, bukan bahwa setiap arti, bacaan, contoh, dan terjemahan telah dibuktikan benar secara linguistik.

## Perbaikan yang dilakukan

1. Menormalkan 29 nilai kolom `kana` untuk headword katakana agar memakai ejaan katakana yang konsisten.
2. Mengganti lima entri yang hanya mengulang kata buah yang sudah ada dengan kosakata berbeda, tanpa mengubah total 800 entri:
   - `林檎` → `さくらんぼ` (buah ceri)
   - `蜜柑` → `メロン` (melon)
   - `葡萄` → `キウイ` (buah kiwi)
   - `苺` → `マンゴー` (mangga)
   - `西瓜` → `柿` (buah kesemek)
3. Memperjelas beberapa terjemahan, termasuk `林`, `お皿`, `マンション`, `風邪`, `連絡`, `普通`, dan `とにかく`.
4. Membuat contoh untuk lemon dan mentega lebih alami, dan memperbaiki contoh untuk `林`.
5. Memperbaiki urutan pemuatan kedua file data agar keduanya tersedia sebelum kode antarmuka kosakata berjalan.
6. Menambahkan workflow GitHub Actions supaya audit struktur dan integrasi statis berjalan otomatis pada perubahan berikutnya.

## Pemeriksaan bahasa lanjutan — 13 Oktober 2026

Dalam pemeriksaan lanjutan, ditemukan dan diperbaiki dua masalah pada contoh kalimat:

1. `国`: `国へ行きたいです。` diterjemahkan secara janggal sebagai “Saya ingin pergi ke negara.” Diganti menjadi `私の国はインドネシアです。` (“Negara saya adalah Indonesia.”).
2. `泳ぐ`: contoh kalimatnya identik dengan entri `海`. Diganti menjadi `毎週プールで泳ぎます。` (“Saya berenang di kolam renang setiap minggu.”).

Setelah perbaikan tersebut, contoh kalimat yang identik tidak lagi ditemukan dalam pemeriksaan duplikasi data.

Selain itu, entri transportasi `汽車` diganti menjadi `電車` karena `電車` lebih umum dan lebih berguna untuk konteks pemula modern, serta contoh `運転手` diubah menjadi kalimat yang lebih langsung dan alami: `運転手がバスを運転しています。`.


**Status audit bahasa:** ini adalah tinjauan editorial awal, bukan validasi oleh penutur asli atau sertifikasi materi JLPT. Masih diperlukan peninjauan menyeluruh untuk nuansa, bacaan kanji berdasarkan konteks, ketepatan seluruh terjemahan, serta kesesuaian level. Kandidat pada bagian berikut diperlakukan sebagai kosakata tambahan untuk ditinjau, bukan otomatis salah atau harus dihapus.

## Kosakata yang perlu ditinjau untuk level JLPT

Validator menandai 33 kandidat sebagai **materi tambahan yang perlu diperiksa**, bukan menyatakan kata-kata ini pasti bukan N5:

`台風`, `薬局`, `警察`, `警官`, `運転手`, `地震`, `電車`, `新幹線`, `地下鉄`, `予約`, `会議`, `説明`, `連絡`, `経験`, `習慣`, `社会`, `歴史`, `科学`, `経済`, `政治`, `方法`, `種類`, `部分`, `途中`, `場合`, `近所`, `特に`, `なるべく`, `とにかく`, `せっかく`, `危険`, `必要`, `十分`.

JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan tertutup untuk tiap level. Karena itu, daftar tersebut harus diperlakukan sebagai daftar tinjauan, bukan batas resmi N5. Beberapa kata dapat tetap berguna sebagai materi tambahan untuk pemula.


## Pemeriksaan tambahan — 13 Oktober 2026

- Jumlah entri yang terbaca: **800** (400 per batch).
- Tidak ditemukan kata kepala duplikat atau contoh kalimat yang identik dalam pemeriksaan otomatis saat ini.
- Tidak ditemukan kolom wajib kosong.
- Kolom `kana` tidak memuat kanji; kolom `bacaan` seluruhnya memakai karakter kana/tanda baca yang diizinkan oleh pemeriksaan statis.
- Daftar kandidat level diselaraskan dengan data terbaru: `汽車` telah diganti menjadi `電車` dalam batch 2.
- Hasil ini memperkuat pemeriksaan struktur, tetapi **belum membuktikan** semua bacaan kanji, terjemahan, nuansa kalimat, atau klasifikasi level sudah benar. Pemeriksaan bahasa secara menyeluruh tetap perlu dilakukan secara editorial.

### Perbaikan konteks kosakata keluarga

- `お父さん`, `お母さん`, `お兄さん`, `お姉さん`, dan `奥さん` kini memakai contoh dengan konteks keluarga orang lain (`田中さんの...`) agar selaras dengan penjelasan maknanya.
- `主人` mendapat contoh kalimat yang lebih informatif; catatan makna menyebutnya sebagai sebutan tradisional.

### Perbaikan contoh makanan dan minuman

- Mengganti contoh yang terlalu berulang untuk `肉`, `牛肉`, `豚肉`, `鶏肉`, `魚`, `野菜`, dan `果物` dengan kalimat yang lebih informatif dan bervariasi.
- Memperbaiki contoh `酒` dan `ビール` yang sebelumnya menyebut minum alkohol setiap pagi; contoh baru menggunakan konteks makan malam dan berkumpul bersama teman.
- Bacaan kana dan terjemahan diperbarui mengikuti kalimat baru. Ini adalah penyuntingan editorial, bukan pengesahan tingkat JLPT.

### Audit sekaligus: lingkungan, cuaca, makanan, dan ungkapan sehari-hari

Pemeriksaan editorial tambahan menemukan beberapa contoh yang secara tata bahasa dapat dipahami tetapi tidak cocok dengan makna atau konteks sehari-hari. Perbaikan diterapkan pada 35 entri di Batch 2, terutama:

- Bentuk alam/cuaca (`砂`, `葉`, `丘`, `池`, `湖`, `浜`, `砂浜`, `雲`, `星`, `太陽`, `氷`, `煙`, `温度`, `気温`, `季節`) diberi contoh yang lebih sesuai secara semantis; contoh yang sebelumnya menempatkan pantai, danau, suhu, dan sebagainya secara janggal di gunung diperbaiki.
- Bahan makanan (`玉葱`, `人参`, `じゃが芋`, `大根`, `キャベツ`, `白菜`, `胡瓜`, `茄子`, `豆`, `味噌`, `酢`, `油`) diberi contoh penggunaan yang lebih alami dalam memasak.
- Ungkapan makanan (`朝ご飯`, `昼ご飯`, `晩ご飯`, `弁当`, `お菓子`) diperbaiki agar terjemahan bahasa Indonesianya alami dan contoh tidak sekadar mengulang pola yang sama.
- `無料` kini memakai konteks masuk museum gratis untuk anak-anak, `農場` memakai contoh pemeliharaan hewan ternak, dan `指` memakai contoh menunjukkan lokasi di peta.

### Audit sekaligus: musim dan kebutuhan sehari-hari

- Contoh untuk `春`, `夏`, `秋`, dan `冬` dibuat lebih berbeda dan kontekstual, tidak lagi mengulang pola “saya suka musim ...”.
- Contoh untuk `りんご`, `みかん`, `バナナ`, `いちご`, `ぶどう`, dan `スイカ` divariasikan agar memberi pola kalimat sehari-hari yang lebih bermanfaat.
- Contoh `牛乳`, `水`, `お湯`, `醤油`, dan `皿` juga disunting untuk konteks penggunaan yang lebih jelas.
- Perubahan ini menambahkan 15 penyuntingan contoh di Batch 1; bacaan dan terjemahan diselaraskan dengan kalimat yang baru.

### Pemeriksaan editorial tambahan: arti, contoh, dan terjemahan

Pada putaran ini, contoh dan keterangan makna disunting lagi di kedua batch. Perubahan terbaru mencakup:

- **Batch 1:** 21 entri ditinjau, termasuk pemakaian kata ganti `あなた`, makna kontekstual `彼女`, kata sopan `方`, serta contoh untuk cuaca, sifat, dan situasi sehari-hari.
- **Batch 2:** 14 entri ditinjau, termasuk `警察`, `料理人`, `形`, `有料`, `政治`, dan beberapa kata sifat; contoh serta terjemahannya dibuat lebih informatif.
- Contoh `方` diganti lagi agar tidak sama dengan contoh `どなた`. Contoh `有料` juga diperbaiki supaya kata target benar-benar digunakan dalam kalimat.
- Setiap perubahan contoh disertai penyesuaian kolom `bacaan` dan `terjemahan` yang sesuai.

Perubahan ini merupakan tinjauan editorial berbasis pemeriksaan internal. Bacaan seluruh kanji tetap memerlukan verifikasi bahasa khusus; lolos pemeriksaan struktur tidak otomatis membuktikan bahwa setiap bacaan benar.

### Putaran pemeriksaan lanjutan — 13 Oktober 2026

Penyuntingan tambahan pada putaran ini:

- **Batch 1:** 15 entri diperbaiki, termasuk contoh sapaan, kata ganti, `会社員`, dan beberapa contoh dasar yang terlalu pendek atau kurang kontekstual.
- **Batch 2:** 31 entri diperbaiki, termasuk kosakata rumah tangga, buah, makanan, anggota tubuh, kesehatan, komunikasi, serta `無料` agar konteks “gratis” lebih alami.
- Kolom contoh, bacaan kana, dan terjemahan Indonesia diperbarui bersama-sama pada entri yang disunting.
- Skrip audit diperbarui: kandidat kata tambahan yang perlu dibandingkan dengan bahan belajar N5 sekarang mencakup istilah seperti `薬局`, `警察`, `新幹線`, `経済`, dan `丁寧`; kandidat tersebut bukan vonis bahwa kata-kata itu pasti di luar N5.

### Putaran penyuntingan lanjutan — 13 Oktober 2026 (keluarga dan sapaan)

- Menambah konteks pada contoh sapaan formal/kasual dan merapikan kapitalisasi terjemahan untuk beberapa ungkapan.
- Mengganti contoh anggota keluarga yang terlalu berulang dengan konteks yang lebih informatif (aktivitas, pekerjaan, perjalanan, dan hubungan keluarga).
- Kolom bacaan dan terjemahan diperbarui bersama contoh pada setiap entri yang diubah.
- Perubahan ini tetap bersifat editorial; pemeriksaan otomatis tidak dapat memastikan seluruh bacaan dan makna sudah tervalidasi oleh penutur asli.

### Perbandingan silang kosakata

Sebagai pemeriksaan tambahan, 800 entri dibandingkan dengan data kosakata N5 proyek komunitas OpenJLPT (https://github.com/evanclan/OpenJLPT/tree/main/data/csv). Data referensi tersebut berisi 674 headword N5; 404 entri cocok persis berdasarkan ejaan. Ini hanya pembanding eksternal, bukan daftar resmi JLPT. Ketidakcocokan ejaan dapat berasal dari sinonim, variasi ejaan, kata tambahan, atau kosakata di luar daftar referensi dan tidak otomatis membuktikan tingkat kata.

Perbedaan bacaan ditinjau: 私 (わたし), 毎月 (まいつき), dan 毎年 (まいとし) adalah bacaan yang lazim; 何 dapat dibaca なに atau なん sesuai konteks. Bacaan contoh これは何ですか。 kini ditulis これはなんですか。 agar sesuai dengan pelafalan kalimat yang diajarkan. 一月 tetap dibaca いちがつ karena entri ini berarti bulan Januari, bukan durasi satu bulan.

Perbandingan silang membantu menemukan variasi dan kandidat untuk diperiksa, tetapi tidak menggantikan pemeriksaan bahasa menyeluruh.

### Dasar klasifikasi tingkat JLPT

Penyelenggara JLPT menjelaskan bahwa daftar kosakata, kanji, dan tata bahasa dalam *Test Content Specifications* tidak lagi diterbitkan setelah revisi 2010. Karena itu, daftar ini diperlakukan sebagai **materi belajar berorientasi N5 dengan kosakata tambahan**, bukan daftar resmi yang menjamin setiap entri pasti masuk N5. Rujukan resmi: [JLPT FAQ — Why is “Test Content Specifications” no longer available?](https://www.jlpt.jp/e/faq/index.html) dan [ringkasan kemampuan bahasa tiap level](https://www.jlpt.jp/e/about/levelsummary.html).

## Batas audit

- Skrip memeriksa jumlah, keunikan, kolom, kategori, kolom `kana` dan `bacaan` agar tidak berisi kanji/huruf Latin, tanda baca Jepang pada akhir contoh, konsistensi katakana, dan urutan pemuatan data.
- Skrip tidak bisa memastikan kebenaran setiap terjemahan, nuansa pemakaian, atau tingkat JLPT secara otomatis.
- Integrasi sudah diperiksa secara statis; pemeriksaan ini bukan pengganti uji klik dan uji tampilan langsung di browser.
- Klaim yang aman saat ini: struktur 800 entri lulus audit otomatis, perbaikan yang teridentifikasi sudah diterapkan, dan kandidat kosakata tambahan ditandai untuk tinjauan lanjutan; daftar tersebut telah diperbarui di skrip audit dan bukan klasifikasi resmi. Jangan menganggap hasil ini sebagai sertifikasi linguistik 100%.



### Putaran pemeriksaan makna — 13 Oktober 2026

- Memperjelas makna ungkapan `よろしく` agar tidak diterjemahkan hanya sebagai “mohon bantuannya”; ungkapan ini juga dipakai untuk menyampaikan harapan hubungan baik, bergantung konteks.
- Memperjelas nuansa `友人` sebagai “teman (lebih formal)” dan menjelaskan awalan hormat `お` pada `お皿`.
- Memperluas arti `戸` menjadi “pintu; daun pintu” karena tidak selalu berarti pintu geser.
- Memperluas arti `場合`, `知らせ`, `向かい`, dan `せっかく` agar mencakup pemakaian yang lebih tepat sesuai konteks.
- Ini adalah koreksi makna yang teridentifikasi pada peninjauan ini, bukan bukti bahwa seluruh 800 entri telah menjalani validasi profesional satu per satu.

### Pemeriksaan validator tambahan — 13 Oktober 2026

- Validator kini memeriksa bukan hanya kolom `bacaan`, tetapi juga kolom `kana`, agar bacaan kata kepala dan bacaan contoh tidak berisi kanji atau huruf Latin.
- Workflow GitHub Actions otomatis dijalankan untuk memvalidasi perubahan ini. Hasil final workflow perlu dinyatakan berdasarkan status run yang selesai, bukan status antre.
- Pemeriksaan linguistik tetap memerlukan verifikasi makna, konteks pemakaian, dan bacaan kata per kata; validator otomatis tidak menggantikan peninjauan tersebut.

### Penutupan putaran pemeriksaan N5 — 13 Oktober 2026

Seluruh **800 entri** ditinjau kembali dalam satu putaran editorial untuk memeriksa makna, kecocokan contoh, bacaan kana, dan terjemahan. Dua ketidaksesuaian yang terkonfirmasi pada putaran ini diperbaiki:

1. **寺** — bacaan contoh dikoreksi dari `ふるいおてらをけんがくしました。` menjadi `ふるいてらをけんがくしました。`, sesuai kalimat `古い寺を見学しました。`.
2. **砂** — tanda koma yang tidak ada pada kalimat Jepang dihapus dari kolom bacaan agar tanda baca contoh dan bacaan konsisten.

Makna **戸** juga sudah diperluas menjadi “pintu; daun pintu”, bukan hanya “pintu geser”. Validator diperkuat untuk membandingkan jumlah tanda baca Jepang antara kolom `contoh` dan `bacaan`, sehingga jenis ketidaksesuaian yang ditemukan pada `砂` dapat dicegah pada perubahan berikutnya.

**Status praktis:** daftar 800 kata dapat dipakai sebagai materi belajar pemula berorientasi N5. Daftar ini bukan daftar resmi JLPT yang tertutup: 33 kata masih ditandai validator sebagai kandidat materi tambahan untuk ditinjau levelnya, dan pembanding komunitas OpenJLPT cocok persis dengan 404 headword. Angka tersebut tidak berarti sisanya otomatis salah; JLPT tidak menyediakan daftar kosakata resmi lengkap per level. Jadi, audit editorial satu putaran dan pemeriksaan struktur sudah dilakukan, sementara klaim “setiap kata pasti resmi N5” tidak dapat dibuat.


### Verifikasi silang bacaan — 13 Oktober 2026

Data pembanding komunitas OpenJLPT berisi 674 baris kosakata N5. Dari 800 headword proyek, 404 cocok persis dengan kolom kata pembanding; 396 tidak cocok persis. Ketidakcocokan persis bukan bukti kesalahan, karena daftar dan bentuk kata yang dicakup berbeda serta JLPT tidak menerbitkan daftar kosakata resmi lengkap per level.

Lima perbedaan bacaan pada headword yang cocok diperiksa satu per satu dan tidak diperlakukan otomatis sebagai kesalahan:

- **私** — proyek memakai わたし, bacaan umum; pembanding memilih わたくし, bentuk lebih formal.
- **何** — headword memakai なに; contoh これは何ですか。 secara alami dibaca これはなんですか。
- **毎月** — まいつき dan まいげつ sama-sama digunakan. Arti kini mencatat bacaan alternatif.
- **毎年** — まいとし dan まいねん sama-sama digunakan. Arti kini mencatat bacaan alternatif.
- **一月** — pada entri ini artinya Januari, sehingga いちがつ tepat; ひとつき berarti durasi satu bulan.

Kesimpulan putaran ini: perbedaan bacaan yang terdeteksi sudah ditinjau secara kontekstual; dua bacaan alternatif dicatat pada entri terkait. Pemeriksaan silang ini melengkapi audit editorial dan struktural, tetapi tidak membuktikan secara otomatis setiap nuansa/terjemahan benar atau mengesahkan semua 800 kata sebagai kosakata resmi N5.


### Audit linguistik mendalam — 13 Oktober 2026

Pada putaran ini, semua 800 entri ditinjau secara editorial dengan fokus pada kewajaran kalimat Jepang, kecocokan bacaan contoh, ketepatan makna dalam bahasa Indonesia, dan penggunaan kata sesuai konteks. Koreksi yang dikonfirmasi lalu diterapkan:

- **着く** — urutan kata pada contoh dirapikan menjadi `八時に駅に着きます。` agar lebih alami.
- **弱い** — contoh tentang “rasa kopi yang lemah” diganti dengan `このチームは弱いです。`, pemakaian yang lebih wajar untuk makna “lemah”.
- **木の葉** — bacaan pada dua contoh terkait diperjelas menjadi `このは`.
- **戸** — terjemahan contoh diubah menjadi “Tolong buka pintu”, sebab 戸 tidak selalu berarti pintu geser.
- **新幹線** — terjemahan diperbaiki menjadi “Kereta cepat itu sangat cepat”.
- **会議室** — terjemahan 打ち合わせをします diperhalus menjadi “mengadakan rapat koordinasi”.
- **農場** — terjemahan diperjelas dengan keterangan lokasi peternakan.
- **成績** — kalimat dirapikan menjadi `今回のテストの成績はよかったです。`.
- **味** — contoh dirapikan menjadi `このスープは味がいいです。`.
- **案内** — makna contoh diperbaiki menjadi “menunjukkan jalan sampai ke stasiun”, bukan mengantar secara fisik.
- **場合** — contoh diberi partikel topik `は` agar lebih alami: `雨の場合は、家にいます。`.
- **しっかり** — terjemahan dibuat lebih alami: “Tolong makan sarapan dengan cukup”.
- **丁寧** — terjemahan `丁寧に説明します` disesuaikan menjadi “menjelaskan dengan cermat”.

Audit ini adalah pemeriksaan editorial menyeluruh, bukan sertifikasi oleh penutur asli atau jaminan bahwa semua 800 entri termasuk daftar resmi JLPT N5. Kosakata tingkat lanjut tetap dipertahankan sebagai materi tambahan; JLPT tidak menerbitkan daftar resmi kosakata lengkap per level.

## File terkait

- [Batch 1](../data/vocabulary-n5-batch1.js)
- [Batch 2](../data/vocabulary-n5-batch2.js)
- [Validator](../audit-n5-vocabulary.js)
- [Workflow audit](../.github/workflows/audit-n5-vocabulary.yml)


## Uji runtime laboratorium kosakata — 13 Oktober 2026

Workflow [N5 audit dan UI smoke test](https://github.com/riyargb/Belajar-Pemrograman/actions/runs/38354849739) selesai dengan status **success** pada commit `67b22c21d827a71e9a0027bbb3c5bb0c3558453f`. Tes DOM tiruan memverifikasi total 800 entri N5, pencarian kosong, reset filter, pembukaan jawaban, navigasi kartu, penandaan hafal, filter kategori, daftar checkbox, progres terpisah untuk N5/N4, dan pemulihan progres saat skrip dimuat ulang.

Batasan: tes ini bukan pengujian browser nyata di HP/desktop. Audit linguistik sebelumnya adalah putaran editorial, bukan sertifikasi penutur asli; beberapa kandidat level tambahan tetap perlu ditinjau dan daftar proyek tidak boleh disebut daftar resmi JLPT.
