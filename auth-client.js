/* Michishirube Supabase Auth client.
 * Browser code may use only a Supabase publishable/legacy anon key.
 * Do not add service_role keys or passwords to logs, storage, or source code.
 */
const config = window.MICHISHIRUBE_SUPABASE_CONFIG || {};
const statusBox = document.getElementById("status");
const form = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const nameField = document.getElementById("nameField");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
const googleLogin = document.getElementById("googleLogin");
const fine = document.getElementById("fine");
const signedIn = document.getElementById("signedIn");
const sessionText = document.getElementById("sessionText");
let mode = "login";
let supabase = null;
let busy = false;

function showStatus(message, kind = "info") {
  statusBox.textContent = message;
  statusBox.dataset.kind = kind;
  statusBox.style.display = "block";
}
function clearStatus() {
  statusBox.textContent = "";
  statusBox.style.display = "none";
  delete statusBox.dataset.kind;
}
function setMode(next) {
  mode = next;
  const registering = mode === "register";
  loginTab.classList.toggle("active", !registering);
  registerTab.classList.toggle("active", registering);
  loginTab.setAttribute("aria-selected", String(!registering));
  registerTab.setAttribute("aria-selected", String(registering));
  nameField.hidden = !registering;
  nameInput.required = registering;
  document.getElementById("heading").textContent = registering ? "Mulai perjalananmu" : "Selamat datang kembali";
  document.getElementById("sub").textContent = registering
    ? "Buat ruang untuk perjalanan belajarmu."
    : "Masuk untuk melanjutkan perjalanan belajarmu.";
  submitButton.textContent = registering ? "Buat akun" : "Masuk";
  passwordInput.autocomplete = registering ? "new-password" : "current-password";
  clearStatus();
}
function setBusy(next) {
  busy = next;
  submitButton.disabled = next;
  submitButton.textContent = next ? "Memproses…" : (mode === "register" ? "Buat akun" : "Masuk");
}
function friendlyError(error) {
  const message = String(error?.message || "");
  if (/invalid login credentials/i.test(message)) return "Email atau kata sandi belum benar.";
  if (/email not confirmed/i.test(message)) return "Periksa email dan selesaikan verifikasi sebelum masuk.";
  if (/user already registered/i.test(message)) return "Email ini sudah terdaftar. Coba masuk.";
  if (/password/i.test(message) && /least|short|weak/i.test(message)) return "Kata sandi belum memenuhi aturan keamanan Supabase.";
  if (/rate limit|too many requests/i.test(message)) return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  return "Permintaan belum berhasil. Periksa koneksi dan konfigurasi Supabase, lalu coba lagi.";
}
function showSignedIn(user) {
  form.classList.add("hidden");
  googleLogin.classList.add("hidden");
  document.querySelector(".switch").classList.add("hidden");
  signedIn.classList.remove("hidden");
  document.getElementById("heading").textContent = "Kamu sudah masuk";
  document.getElementById("sub").textContent = "Perjalanan belajarmu siap dilanjutkan.";
  sessionText.textContent = user?.email ? "Masuk sebagai " + user.email : "Sesi aktif.";
  fine.textContent = "Sesi autentikasi dikelola oleh Supabase. Jangan bagikan tautan pemulihan atau kode verifikasi kepada siapa pun.";
}
function showSignedOut() {
  form.classList.remove("hidden");
  googleLogin.classList.remove("hidden");
  document.querySelector(".switch").classList.remove("hidden");
  signedIn.classList.add("hidden");
  document.getElementById("heading").textContent = mode === "register" ? "Mulai perjalananmu" : "Selamat datang kembali";
  document.getElementById("sub").textContent = mode === "register" ? "Buat ruang untuk perjalanan belajarmu." : "Masuk untuk melanjutkan perjalanan belajarmu.";
  fine.textContent = "Autentikasi menggunakan Supabase Auth. Gunakan hanya URL proyek dan publishable key; jangan pernah memasukkan service_role atau secret key ke aplikasi browser.";
}
function safeNextUrl() {
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw) return new URL("/index.html", window.location.origin).href;
  try {
    const target = new URL(raw, window.location.origin);
    if (target.origin !== window.location.origin || /\/auth\.html$/i.test(target.pathname)) return new URL("/index.html", window.location.origin).href;
    return target.href;
  } catch { return new URL("/index.html", window.location.origin).href; }
}
function redirectAfterAuth() {
  window.location.replace(safeNextUrl());
}
googleLogin.addEventListener("click", async () => {
  if (!supabase || busy) {
    if (!supabase) showStatus("Supabase belum siap. Periksa koneksi dan konfigurasi, lalu coba lagi.", "error");
    return;
  }
  clearStatus();
  googleLogin.disabled = true;
  googleLogin.textContent = "Membuka Google…";
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href }
    });
    if (error) throw error;
  } catch (error) {
    showStatus(friendlyError(error), "error");
    googleLogin.disabled = false;
    googleLogin.textContent = "Lanjutkan dengan Google";
  }
});
loginTab.addEventListener("click", () => setMode("login"));
registerTab.addEventListener("click", () => setMode("register"));

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy) return;
  clearStatus();
  if (!supabase) {
    showStatus("Supabase belum dikonfigurasi. Isi URL proyek dan publishable key di supabase-config.js, lalu deploy ulang. Tidak ada kata sandi yang dikirim atau disimpan oleh Michishirube.", "error");
    return;
  }
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!emailInput.validity.valid) {
    showStatus("Masukkan alamat email yang valid.", "error");
    emailInput.focus();
    return;
  }
  if (password.length < 8 || password.length > 128) {
    showStatus("Kata sandi harus terdiri dari 8–128 karakter.", "error");
    passwordInput.focus();
    return;
  }
  if (mode === "register" && !nameInput.value.trim()) {
    showStatus("Isi nama tampilan terlebih dahulu.", "error");
    nameInput.focus();
    return;
  }
  setBusy(true);
  try {
    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: nameInput.value.trim().slice(0, 80) },
          emailRedirectTo: new URL("./auth.html", window.location.href).href
        }
      });
      if (error) throw error;
      passwordInput.value = "";
      if (data.session && data.user) {
        showSignedIn(data.user);
        showStatus("Akun berhasil dibuat dan kamu sudah masuk.", "success");
        redirectAfterAuth();
      } else {
        setMode("login");
        showStatus("Pendaftaran diterima. Periksa email untuk memverifikasi akun sebelum masuk.", "success");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      passwordInput.value = "";
      showSignedIn(data.user);
      showStatus("Berhasil masuk. Selamat belajar!", "success");
      redirectAfterAuth();
    }
  } catch (error) {
    showStatus(friendlyError(error), "error");
  } finally {
    setBusy(false);
  }
});
document.getElementById("logout").addEventListener("click", async () => {
  if (!supabase) return;
  const button = document.getElementById("logout");
  button.disabled = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showSignedOut();
    showStatus("Kamu sudah keluar dari akun.", "success");
  } catch (error) {
    showStatus(friendlyError(error), "error");
  } finally {
    button.disabled = false;
  }
});

async function initialise() {
  const url = String(config.url || "").trim();
  const key = String(config.publishableKey || "").trim();
  if (!url || !key) {
    showStatus("Supabase belum dikonfigurasi. Isi URL proyek dan publishable key di supabase-config.js untuk mengaktifkan login dan registrasi.", "error");
    return;
  }
  let parsedUrl;
  try { parsedUrl = new URL(url); } catch { showStatus("URL Supabase tidak valid. Periksa supabase-config.js.", "error"); return; }
  if (parsedUrl.protocol !== "https:" || !/^[a-z0-9-]+\.supabase\.co$/i.test(parsedUrl.hostname)) {
    showStatus("Gunakan URL HTTPS resmi proyek Supabase pada supabase-config.js.", "error");
    return;
  }
  if (!/^(sb_publishable_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9._-]+)$/.test(key)) {
    showStatus("Kunci harus berupa publishable key sb_publishable_… atau legacy anon key. Jangan gunakan service_role/secret key.", "error");
    return;
  }
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.76.1/+esm");
    supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session?.user) { showSignedIn(data.session.user); redirectAfterAuth(); }
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        showSignedIn(session.user);
        if (event === "SIGNED_IN") redirectAfterAuth();
      } else showSignedOut();
    });
    clearStatus();
  } catch (_error) {
    showStatus("Koneksi ke Supabase gagal dimulai. Periksa koneksi internet, URL/kunci proyek, dan apakah CDN dapat diakses.", "error");
  }
}
setMode("login");
initialise();
