/* Shared Supabase session gate and profile logout for Michishirube.
 * Only the public publishable key is loaded in the browser.
 */
const cfg = window.MICHISHIRUBE_SUPABASE_CONFIG || {};
const BASE_PATH = "/Belajar-Pemrograman/";
const authUrl = new URL("./auth.html", window.location.href);
const requestedNext = window.location.pathname + window.location.search + window.location.hash;
authUrl.searchParams.set("next", requestedNext.startsWith(BASE_PATH) ? requestedNext : BASE_PATH);

// The landing page must remain reachable from the login screen even when signed out.
const isLandingPage = window.location.pathname === "/" || /\/index\.html$/i.test(window.location.pathname);
if (isLandingPage) {
  document.documentElement.classList.remove("auth-pending");
} else {
  startSiteAuth();
}

function addAuthControls(user, supabase) {
  let profile = document.querySelector(".nav a.profile");
  if (!profile) {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    let controls = topbar.querySelector(".site-auth-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "site-auth-controls";
      controls.style.cssText = "display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-left:auto";
      topbar.appendChild(controls);
    }
    profile = controls.querySelector("a");
    if (!profile) {
      profile = document.createElement("a");
      profile.href = "./auth.html";
      profile.textContent = "Profil ↗";
      profile.style.cssText = "display:inline-flex;align-items:center;padding:8px 10px;border:1px solid var(--border2,#d8cdbb);border-radius:999px;text-decoration:none;color:var(--text,#182f45);font:600 11px sans-serif;white-space:nowrap";
      controls.appendChild(profile);
    }
  }
  profile.textContent = user.user_metadata?.display_name ? "Profil · " + user.user_metadata.display_name : "Profil ↗";
  profile.href = "./auth.html";
  let logout = document.getElementById("site-logout");
  if (!logout) {
    logout = document.createElement("button");
    logout.id = "site-logout";
    logout.type = "button";
    logout.textContent = "Keluar";
    logout.style.cssText = "display:inline-flex;align-items:center;justify-content:center;padding:8px 11px;border:1px solid var(--border2,#d8cdbb);border-radius:999px;background:transparent;color:var(--text,#182f45);font:600 11px sans-serif;white-space:nowrap;cursor:pointer";
    profile.parentElement.appendChild(logout);
  }
  logout.onclick = async () => {
    logout.disabled = true;
    logout.textContent = "Keluar…";
    const { error } = await supabase.auth.signOut();
    if (error) {
      logout.disabled = false;
      logout.textContent = "Coba lagi";
      return;
    }
    window.location.replace("./auth.html");
  };
}

async function startSiteAuth() {
  const reveal = () => document.documentElement.classList.remove("auth-pending");
  const url = String(cfg.url || "").trim();
  const key = String(cfg.publishableKey || "").trim();
  if (!url || !key) {
    window.location.replace(authUrl.href);
    return;
  }
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.76.1/+esm");
    const supabase = createClient(url, key, { auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true } });
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) {
      window.location.replace(authUrl.href);
      return;
    }
    addAuthControls(data.session.user, supabase);
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) window.location.replace(authUrl.href);
    });
    reveal();
  } catch (_error) {
    document.documentElement.classList.remove("auth-pending");
    document.body.innerHTML = '<main style="max-width:560px;margin:12vh auto;padding:24px;font:16px/1.7 sans-serif;color:#182f45"><h1>Michishirube belum bisa memeriksa sesi</h1><p>Periksa koneksi internet, lalu muat ulang. Jika masalah berlanjut, buka halaman masuk dan pastikan konfigurasi Supabase benar.</p><p><a href="./auth.html">Buka halaman masuk</a></p></main>';
  }
}
