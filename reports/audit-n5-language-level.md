# Audit Bahasa dan Level Kosakata Jepang N5

Tanggal audit: 13 Oktober 2026  
Repositori: `riyargb/Belajar-Pemrograman`

## Hasil audit yang dikerjakan

- Memeriksa seluruh 800 entri dari dua batch berdasarkan struktur, pembacaan kana, contoh kalimat, arti, terjemahan, dan kewajaran penggunaan.
- Memperbaiki 32 contoh kalimat beserta bacaan kana dan terjemahan Indonesianya.
- Perbaikan mencakup salam yang sebelumnya terlalu pendek/tidak alami (`どうも`, `よろしく`, `じゃあ`), contoh alam yang tidak masuk akal (`山に山があります` dan pola sejenis), contoh kosakata pelajaran yang hanya berbunyi “memeriksa ...”, serta kalimat yang kurang alami untuk 希望, だいたい, dan もしも.
- Contoh yang diperbaiki disesuaikan antara kalimat Jepang, bacaan hiragana/katakana, dan terjemahan Indonesia.

## Catatan level JLPT

JLPT tidak menerbitkan daftar kosakata resmi yang lengkap dan definitif untuk setiap level. Karena itu, “N5” di sini adalah kurasi bahan belajar pemula, bukan jaminan bahwa setiap entri pasti termasuk daftar resmi N5.

Entri berikut perlu diperlakukan sebagai **kosakata tambahan / perlu konfirmasi level**, bukan otomatis dianggap salah: 台風、薬局、警察官、警察官以外の職業名、運転手、地震、新幹線、地下鉄、予約、会議、説明、連絡、経験、習慣、社会、歴史、科学、経済、政治、方法、種類、部分、途中、場合、近所、特に、なるべく、とにかく、せっかく、危険、必要、十分、丁寧。

Sebagian kata tersebut berguna untuk kehidupan sehari-hari, tetapi bisa lebih sulit atau lebih spesifik daripada inti kosakata pemula. Untuk materi yang lebih ketat, tampilkan sebagai bagian **N5 + kosakata tambahan**, atau verifikasi satu per satu dengan buku ajar/silabus yang dipakai. Jangan menyebutnya daftar resmi JLPT.

## Pemeriksaan teknis

Audit struktur sebelumnya menunjukkan 400 entri pada Batch 1 dan 400 pada Batch 2, 800 headword unik, tidak ada kolom wajib kosong, dan tidak ditemukan ketidakcocokan bacaan untuk headword katakana. Pemeriksaan statis juga memastikan kedua berkas data dimuat sebelum skrip antarmuka.

## Batas audit

Pemeriksaan otomatis membantu menemukan inkonsistensi, tetapi tidak dapat membuktikan secara sempurna semua nuansa makna, tingkat kesopanan, konteks, atau klasifikasi JLPT. Untuk jaminan akademik penuh, tinjauan akhir oleh pengajar bahasa Jepang atau pembandingan langsung dengan buku ajar yang ditetapkan tetap disarankan.
