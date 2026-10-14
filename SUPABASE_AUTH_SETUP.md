# Mengaktifkan autentikasi Supabase — Michishirube

Halaman `auth.html` mendukung **Login dengan Google (OAuth)** sebagai opsi utama dan email/kata sandi sebagai opsi cadangan. OAuth meminta pengguna memilih akun Google (`prompt=select_account`); Michishirube tidak menerima kata sandi Google.

## 1. Proyek Supabase yang sudah dibuat

- Dashboard: https://supabase.com/dashboard/project/tckhlrauxlwfyujejeiz
- Project URL: `https://tckhlrauxlwfyujejeiz.supabase.co`
- Region: Singapore (`ap-southeast-1`)
- Konfigurasi URL dan publishable key sudah diisi di `supabase-config.js` pada branch `feature/google-oauth-login`.

Publishable key memang dapat dilihat di browser. Jangan pernah gunakan `service_role` atau secret key di browser, HTML, atau repository publik.

## 2. Aktifkan Login dengan Google

1. Buka Google Cloud Console: https://console.cloud.google.com/auth/clients dan pilih/buat project Google Cloud.
2. Buat OAuth Client ID bertipe **Web application**.
3. Pada **Authorized JavaScript origins**, tambahkan:
   - `https://riyargb.github.io`
4. Pada **Authorized redirect URIs**, tambahkan callback ini:
   - `https://tckhlrauxlwfyujejeiz.supabase.co/auth/v1/callback`
5. Salin Google Client ID dan Client Secret yang dihasilkan.
6. Buka [Supabase Google provider settings](https://supabase.com/dashboard/project/tckhlrauxlwfyujejeiz/auth/providers) dan aktifkan provider Google. Masukkan Client ID dan Client Secret, lalu simpan. **Client Secret hanya boleh dimasukkan ke dashboard Supabase, jangan kirim ke chat atau commit ke GitHub.**

## 3. Atur URL redirect Supabase

Buka [Supabase Auth URL Configuration](https://supabase.com/dashboard/project/tckhlrauxlwfyujejeiz/auth/url-configuration):

- **Site URL:** `https://riyargb.github.io/Belajar-Pemrograman/`
- **Redirect URLs:** tambahkan `https://riyargb.github.io/Belajar-Pemrograman/auth.html`

Pastikan URL sama persis dengan URL GitHub Pages yang dipakai. Untuk pengembangan lokal, tambahkan redirect lokal secara terpisah dan hapus bila tidak diperlukan saat produksi.

## 4. Uji autentikasi

Setelah provider Google disimpan dan konfigurasi URL selesai:

1. Buka https://riyargb.github.io/Belajar-Pemrograman/auth.html setelah perubahan di-merge dan dipublikasikan.
2. Klik **Lanjutkan dengan Google**, pilih akun, lalu pastikan browser kembali ke `auth.html`.
3. Uji sesi setelah refresh, logout, dan email/password bila fitur itu dibutuhkan.
4. Jangan anggap autentikasi sebagai kontrol akses untuk data privat tanpa kebijakan database dan Row Level Security (RLS) yang sesuai.

## Catatan keamanan

- Google Client Secret dan Supabase secret/service-role key tidak boleh masuk ke repository.
- Publishable key boleh ada di frontend; proteksi data ditentukan oleh Auth, grants, dan RLS.
- Sesi browser tidak otomatis membuat seluruh halaman belajar terkunci.
- Login Google belum dianggap selesai sampai provider diaktifkan dengan kredensial Google yang valid dan alur callback berhasil diuji end-to-end.
