# Mengaktifkan autentikasi Supabase — Michishirube

Halaman `auth.html` memakai Supabase Auth untuk email/password. UI tidak menyimpan kata sandi ke database aplikasi atau mencatatnya ke console.

## 1. Siapkan proyek
1. Buat atau pilih proyek Supabase di https://supabase.com/dashboard.
2. Buka **Project Settings → API** (atau bagian API Keys pada dashboard yang lebih baru).
3. Salin **Project URL** dan **publishable key** (`sb_publishable_...`). Legacy `anon` key dapat dipakai untuk kompatibilitas.
4. Jangan pernah gunakan `service_role` atau secret key di browser, HTML, atau repository publik.

## 2. Isi konfigurasi frontend
Edit `supabase-config.js`:
- `url`: Project URL HTTPS dari dashboard.
- `publishableKey`: publishable key (atau legacy anon key).

Publishable/anon key memang dapat dilihat di browser; keamanan data harus ditentukan oleh Supabase Auth, grants, dan Row Level Security. Jangan menaruh rahasia server di file ini.

## 3. Atur Auth
Di Supabase Dashboard → **Authentication → URL Configuration**:
- Tambahkan URL situs GitHub Pages ke **Site URL**.
- Tambahkan URL halaman `auth.html` yang dipublikasikan ke **Redirect URLs**.
- Pastikan provider **Email** aktif. Untuk akun yang lebih aman, biarkan verifikasi email aktif.
- Sesuaikan SMTP untuk produksi bila perlu; email bawaan proyek dapat memiliki batas pengiriman.

## 4. Deploy & uji
1. Commit perubahan konfigurasi yang hanya berisi URL proyek dan publishable key; keduanya bukan rahasia server.
2. Deploy GitHub Pages, lalu uji pendaftaran dengan email yang kamu kendalikan, verifikasi email, masuk, refresh halaman, dan keluar.
3. Pastikan URL situs/redirect cocok persis dengan domain publik. Uji juga pada perangkat mobile.

## Catatan keamanan dan cakupan
- Kata sandi dikirim melalui HTTPS ke Supabase Auth; aplikasi tidak menyimpan atau mencetak kata sandi.
- Sesi dikelola oleh Supabase JS client; sesi browser tidak membuat halaman belajar otomatis terkunci.
- Jangan menyimpan data profil/progres privat ke tabel baru tanpa kebijakan RLS yang tepat.
- File ini mengimpor `@supabase/supabase-js` versi yang dipatok dari CDN. Koneksi jaringan/CDN diperlukan untuk autentikasi.
- Proyek Supabase belum terhubung ke sesi kerja saat integrasi ini disiapkan; uji autentikasi end-to-end harus dilakukan setelah konfigurasi proyek nyata dimasukkan.
