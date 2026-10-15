/* Per-account progress storage + cloud sync for Michishirube. */
(function () {
  const cfg = window.MICHISHIRUBE_SUPABASE_CONFIG || {};
  const project = (() => { try { return new URL(cfg.url).hostname.split(".")[0]; } catch (_) { return ""; } })();
  const authKey = "sb-" + project + "-auth-token";
  const keys = ["sal_kana_learned_v1","sal_vocab_n5_progress_v1","sal_vocab_n4_progress_v1","sal_kanji_progress","sal_lang_checks","sal_lang_opens","sal_lang_notes","sal_checks","sal_opens","sal_notes","sal_lastday","sal_streak","sal_roadmap_v2"];
  const get = Storage.prototype.getItem, set = Storage.prototype.setItem, remove = Storage.prototype.removeItem;
  let uid = null, client = null, ready = false, writing = false, timer;
  function getUid() {
    try {
      const s = JSON.parse(get.call(localStorage, authKey) || "{}");
      if (s.user?.id) return s.user.id;
      const token = s.access_token || s.currentSession?.access_token || s.session?.access_token;
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))).sub || null;
    } catch (_) { return null; }
  }
  function key(k) { return uid && keys.includes(k) ? "__ms_user_" + uid + "__" + k : k; }
  Storage.prototype.getItem = function(k) { return get.call(this, key(String(k))); };
  Storage.prototype.setItem = function(k,v) {
    const result = set.call(this, key(String(k)), String(v));
    if (this === localStorage && ready && !writing && keys.includes(String(k))) queueSave();
    return result;
  };
  Storage.prototype.removeItem = function(k) { return remove.call(this, key(String(k))); };
  function state() {
    const out = {};
    keys.forEach(k => { const raw = get.call(localStorage,key(k)); if(raw!==null) try { out[k]=JSON.parse(raw); } catch(_){} });
    return out;
  }
  function hydrate(s) {
    writing=true;
    try { Object.entries(s||{}).forEach(([k,v])=>{if(keys.includes(k))set.call(localStorage,key(k),JSON.stringify(v));}); }
    finally { writing=false; }
  }
  async function push() {
    if(!client||!uid||!ready)return;
    const {error}=await client.from("user_learning_state").upsert({user_id:uid,state:state(),updated_at:new Date().toISOString()},{onConflict:"user_id"});
    if(error) console.warn("Sinkronisasi progres gagal:",error.message);
  }
  function queueSave(){clearTimeout(timer);timer=setTimeout(()=>push().catch(e=>console.warn(e)),800);}
  async function boot(){
    uid=getUid();
    if(!uid||!cfg.url||!cfg.publishableKey)return;
    try {
      const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.76.1/+esm");
      client=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const {data:{session}}=await client.auth.getSession();
      if(!session?.user||session.user.id!==uid)return;
      const {data,error}=await client.from("user_learning_state").select("state").eq("user_id",uid).maybeSingle();
      if(error)throw error;
      const marker="__ms_hydrated_"+uid;
      if(data?.state&&typeof data.state==="object"){
        hydrate(data.state);
        ready=true;
        if(!sessionStorage.getItem(marker)){sessionStorage.setItem(marker,"1");location.reload();return;}
      } else {
        const legacy={};
        keys.forEach(k=>{const raw=get.call(localStorage,k);if(raw!==null&&get.call(localStorage,key(k))===null)try{legacy[k]=JSON.parse(raw);}catch(_){}});
        hydrate(legacy);ready=true;
        const {error:saveError}=await client.from("user_learning_state").upsert({user_id:uid,state:state(),updated_at:new Date().toISOString()},{onConflict:"user_id"});
        if(saveError)throw saveError;
        if(Object.keys(legacy).length&&!sessionStorage.getItem(marker)){sessionStorage.setItem(marker,"1");location.reload();return;}
      }
      client.auth.onAuthStateChange((_event,s)=>{if(!s?.user||s.user.id!==uid){ready=false;location.reload();}});
    } catch(e) { console.warn("Progres tersimpan lokal; sinkronisasi cloud belum berhasil.",e); }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
  window.MichishirubeProgressSync={syncNow:queueSave};
})();