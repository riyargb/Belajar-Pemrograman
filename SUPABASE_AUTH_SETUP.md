# Mengaktifkan autentikasi Supabase — Michishirube

Halaman `auth.html` mendukung **Login dengan Google (OAuth)** sebagai opsi paling mudah dan email/kata sandi sebagai opsi cadangan. OAuth meminta pengguna memilih akun Google (`prompt=select_account`); Michishirube tidak menerima kata sandi Google.

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

## 3. Aktifkan Login dengan Google
1. Buka Google Cloud Console: https://console.cloud.google.com/auth/clients dan pilih/buat project Google Cloud.
2. Buat OAuth Client ID bertipe **Web application**.
3. Pada Authorized JavaScript origins, tambahkan:
   - `https://riyargb.github.io`
4. Pada Authorized redirect URIs, tambahkan callback Supabase dari **Authentication → Sign In / Providers → Google**, biasanya berbentuk `https://<project-ref>.supabase.co/auth/v1/callback`.
5. Salin Google Client ID dan Client Secret ke pengaturan provider Google di Supabase. **Client Secret hanya boleh dimasukkan ke dashboard Supabase, jangan commit ke GitHub.**
6. Di Supabase **Authentication → URL Configuration**, atur Site URL ke `https://riyargb.github.io/Belajar-Pemrograman/` dan tambahkan redirect URL:
   `https://riyargb.github.io/Belajar-Pemrograman/auth.html`

## 4. Atur Auth
Di Supabase Dashboard → **Authentication → URL Configuration**:
- Tambahkan URL situs GitHub Pages ke **Site URL**.
- Tambahkan URL halaman `auth.html` yang dipublikasikan ke **Redirect URLs**.
- Pastikan provider **Email** aktif. Untuk akun yang lebih aman, biarkan verifikasi email aktif.
- Sesuaikan SMTP untuk produksi bila perlu; email bawaan proyek dapat memiliki batas pengiriman.

## 5. Deploy & uji
1. Isi `supabase-config.js` dengan URL proyek dan publishable key saja; keduanya bukan rahasia server.
2. Deploy GitHub Pages, lalu uji pendaftaran dengan email yang kamu kendalikan, verifikasi email, masuk, refresh halaman, dan keluar.
3. Pastikan URL situs/redirect cocok persis dengan domain publik. Uji juga pada perangkat mobile. Tombol Google harus membuka pemilih akun Google lalu kembali ke `auth.html` dalam keadaan masuk.

## Catatan keamanan dan cakupan
- Kata sandi dikirim melalui HTTPS ke Supabase Auth; aplikasi tidak menyimpan atau mencetak kata sandi.
- Sesi dikelola oleh Supabase JS client; sesi browser tidak membuat halaman belajar otomatis terkunci.
- Jangan menyimpan data profil/progres privat ke tabel baru tanpa kebijakan RLS yang tepat.
- File ini mengimpor `@supabase/supabase-js` versi yang dipatok dari CDN. Koneksi jaringan/CDN diperlukan untuk autentikasi.
- Login Google belum dapat diuji end-to-end sampai project Supabase yang aktif dihubungkan, URL/publishable key diisi, dan kredensial OAuth Google dikonfigurasi.
