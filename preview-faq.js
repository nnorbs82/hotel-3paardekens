(() => {
  'use strict';
  const list=document.querySelector('#faq-list');
  if(!list)return;
  const file=document.body.dataset.faqFile;
  let blocks=[];
  let overrides={};
  let overrideLang='';
  let refreshToken=0;

  const lang=()=>window.Hotel3P?.getLanguage?.()||'en';
  const sanitize=html=>window.DOMPurify?DOMPurify.sanitize(String(html||''),{USE_PROFILES:{html:true}}):String(html||'').replace(/[<>]/g,'');

  function entryForLanguage(entry,l){
    const translated=overrideLang===l?overrides[entry.id]:null;
    return {
      title:translated?.question||entry[`question_${l}`]||entry.question_en||entry.question||'',
      body:translated?.answer||entry[`answer_${l}`]||entry.answer_en||entry.answer||''
    };
  }

  function render(){
    list.innerHTML='';
    const l=lang();
    if(!blocks.length){
      const p=document.createElement('p');
      p.className='lead';
      p.dataset.i18n='faq.empty';
      p.textContent=window.Hotel3P?.translate?.('faq.empty')||'No frequently asked questions are available yet.';
      list.appendChild(p);
      return;
    }
    blocks.forEach(block=>{
      const entry=entryForLanguage(block,l);
      if(!entry.title&&!entry.body)return;
      const details=document.createElement('details');
      details.className='faq-item';
      const summary=document.createElement('summary');
      summary.textContent=entry.title||'FAQ';
      const answer=document.createElement('div');
      answer.className='faq-answer';
      answer.innerHTML=sanitize(entry.body||'');
      details.append(summary,answer);
      list.appendChild(details);
    });
  }

  async function loadOverride(l,token){
    if(!file?.includes('apple-wallet')||l==='en'){
      if(token!==refreshToken)return;
      overrides={};
      overrideLang='';
      return;
    }
    try{
      const res=await fetch(`v2/content/faqs/apple-wallet-${l}.json`,{cache:'no-store'});
      if(!res.ok)throw new Error(`Unable to load ${l} Apple Wallet FAQ: ${res.status}`);
      const data=await res.json();
      if(token!==refreshToken||l!==lang())return;
      overrides=Object.fromEntries((Array.isArray(data.entries)?data.entries:[]).map(entry=>[entry.id,entry]));
      overrideLang=l;
    }catch(error){
      console.error(error);
      if(token!==refreshToken)return;
      overrides={};
      overrideLang='';
    }
  }

  async function refresh(){
    const token=++refreshToken;
    const l=lang();
    await loadOverride(l,token);
    if(token===refreshToken)render();
  }

  async function load(){
    if(!file){refresh();return;}
    try{
      const res=await fetch(file,{cache:'no-store'});
      if(!res.ok)throw new Error(`Unable to load FAQ content: ${res.status}`);
      const data=await res.json();
      blocks=Array.isArray(data.entries)?data.entries:[];
    }catch(error){
      console.error(error);
      blocks=[];
    }
    refresh();
  }

  document.addEventListener('hotelLanguageChanged',refresh);
  load();
})();
