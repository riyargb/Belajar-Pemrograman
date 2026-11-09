(()=>{
function attach(){
document.querySelectorAll('#roadmap [id^="ph-ai"]').forEach(el=>{
 const id=el.id.slice(3),n=Number(id.replace("ai",""));
 if(!n||el.querySelector(".pytools"))return;
 const target=el.querySelector(".ph-body");if(!target)return;
 const box=document.createElement("div");box.className="pytools";
 box.innerHTML='<a href="./ai-quiz.html?level='+n+'">✦ Kuis level</a><a href="./ai-flashcards.html?level='+n+'">▤ Flashcard</a>';
 target.appendChild(box);
});
}
const st=document.createElement("style");st.textContent='.pytools{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:14px 0 2px}.pytools a{display:block;padding:11px 8px;border:1px solid #d8cdbb;border-radius:9px;background:#fffdf8;color:#142d45;text-align:center;text-decoration:none;font:600 11px sans-serif}.pytools a:first-child{background:#142d45;color:white}';document.head.appendChild(st);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});else attach();
new MutationObserver(attach).observe(document.getElementById("roadmap"),{childList:true,subtree:true});
})();