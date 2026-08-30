(() => {
  'use strict';
  const list=document.querySelector('#faq-list');
  if(!list)return;
  const file=document.body.dataset.faqFile;
  const firebasePath=document.body.dataset.firebasePath;
  let blocks=[];

  const lang=()=>window.Hotel3P?.getLanguage?.()||'en';
  const sanitize=html=>window.DOMPurify?DOMPurify.sanitize(String(html||''),{USE_PROFILES:{html:true}}):String(html||'').replace(/[<>]/g,'');

  function staticEntry(entry,l){
    return {title:entry[`question_${l}`]||entry.question_en||entry.question||'',body:entry[`answer_${l}`]||entry.answer_en||entry.answer||''};
  }
  function firebaseEntry(entry,l){
    if(entry?.[l]&&(entry[l].title||entry[l].body))return entry[l];
    if(entry?.en&&(entry.en.title||entry.en.body))return entry.en;
    return {title:entry?.title||'',body:entry?.body||''};
  }
  function render(){
    list.innerHTML='';
    const l=lang();
    if(!blocks.length){const p=document.createElement('p');p.className='lead';p.dataset.i18n='faq.empty';p.textContent=window.Hotel3P?.translate?.('faq.empty')||'No frequently asked questions are available yet.';list.appendChild(p);return;}
    blocks.forEach(block=>{
      const entry=block.__static?staticEntry(block,l):firebaseEntry(block,l);
      if(!entry.title&&!entry.body)return;
      const details=document.createElement('details');details.className='faq-item';
      const summary=document.createElement('summary');summary.textContent=entry.title||'FAQ';
      const answer=document.createElement('div');answer.className='faq-answer';answer.innerHTML=sanitize(entry.body||'');
      details.append(summary,answer);list.appendChild(details);
    });
  }

  async function loadStatic(){
    if(!file)return false;
    try{const res=await fetch(file,{cache:'no-store'});if(!res.ok)return false;const data=await res.json();const entries=Array.isArray(data.entries)?data.entries:[];if(!entries.length)return false;blocks=entries.map(x=>({...x,__static:true}));render();return true}catch{return false}
  }
  async function loadFirebase(){
    if(!firebasePath||typeof firebase==='undefined'||!firebase.database)return false;
    try{const snap=await firebase.database().ref(firebasePath).once('value');const data=snap.val();if(!data)return false;blocks=(Array.isArray(data)?data:Object.keys(data).map(k=>({...data[k],id:k}))).filter(Boolean).sort((a,b)=>(a.order||0)-(b.order||0));render();return true}catch{return false}
  }
  async function load(){if(await loadStatic())return;if(await loadFirebase())return;render()}
  document.addEventListener('hotelLanguageChanged',render);
  load();
})();
