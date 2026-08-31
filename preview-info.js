(() => {
  'use strict';

  const list = document.querySelector('#info-blocks');
  const indexLinks = document.querySelector('#info-index-links');
  const empty = document.querySelector('#info-empty');
  if (!list) return;

  const file = document.body.dataset.infoFile;
  let blocks = [];
  let overrides = {};
  let overrideLang = '';
  let refreshToken = 0;

  const copy = {
    nl:{eyebrow:'Uw verblijf',title:'Alles wat u moet weten.',lead:'Praktische informatie voor een vlot verblijf bij Hotel 3 Paardekens.',index:'Op deze pagina',empty:'Er is momenteel geen hotelinformatie beschikbaar.',ctaEyebrow:'Klaar voor Mechelen?',ctaTitle:'Kies uw data. Wij zorgen voor de rest.',ctaButton:'Bekijk beschikbaarheid'},
    en:{eyebrow:'Your stay',title:'Everything you need to know.',lead:'Practical information to make your stay at Hotel 3 Paardekens straightforward from arrival to departure.',index:'On this page',empty:'No hotel information is available at the moment.',ctaEyebrow:'Ready for Mechelen?',ctaTitle:'Choose your dates. We’ll take care of the rest.',ctaButton:'Check availability'},
    fr:{eyebrow:'Votre séjour',title:'Tout ce qu’il faut savoir.',lead:'Les informations pratiques pour faciliter votre séjour à l’Hotel 3 Paardekens, de l’arrivée au départ.',index:'Sur cette page',empty:'Aucune information sur l’hôtel n’est disponible pour le moment.',ctaEyebrow:'Prêt pour Malines ?',ctaTitle:'Choisissez vos dates. Nous nous occupons du reste.',ctaButton:'Vérifier les disponibilités'},
    es:{eyebrow:'Su estancia',title:'Todo lo que necesita saber.',lead:'Información práctica para que su estancia en Hotel 3 Paardekens sea sencilla desde la llegada hasta la salida.',index:'En esta página',empty:'No hay información del hotel disponible en este momento.',ctaEyebrow:'¿Listo para Malinas?',ctaTitle:'Elija sus fechas. Nosotros nos encargamos del resto.',ctaButton:'Consultar disponibilidad'},
    de:{eyebrow:'Ihr Aufenthalt',title:'Alles, was Sie wissen müssen.',lead:'Praktische Informationen für einen unkomplizierten Aufenthalt im Hotel 3 Paardekens - von der Anreise bis zur Abreise.',index:'Auf dieser Seite',empty:'Zurzeit sind keine Hotelinformationen verfügbar.',ctaEyebrow:'Bereit für Mechelen?',ctaTitle:'Wählen Sie Ihre Daten. Wir kümmern uns um den Rest.',ctaButton:'Verfügbarkeit prüfen'}
  };

  const lang = () => window.Hotel3P?.getLanguage?.() || 'en';
  const text = () => copy[lang()] || copy.en;
  const sanitize = html => window.DOMPurify ? DOMPurify.sanitize(String(html || ''), {USE_PROFILES:{html:true}}) : String(html || '').replace(/[<>]/g,'');
  const escapeText = value => { const div=document.createElement('div'); div.textContent=String(value||''); return div.innerHTML; };
  const pad = n => String(n).padStart(2,'0');

  function entryForLanguage(entry,l){
    const translated = overrideLang === l ? overrides[entry.id] : null;
    return {
      id:entry.id || '',
      order:Number(translated?.order ?? entry.order ?? 0),
      title:translated?.title || entry[`title_${l}`] || entry.title_en || entry.title || '',
      body:translated?.body || entry[`body_${l}`] || entry.body_en || entry.body || ''
    };
  }

  function pageCopy(){
    const c=text();
    const map={
      '#info-eyebrow':c.eyebrow,
      '#info-title':c.title,
      '#info-lead':c.lead,
      '#info-index-title':c.index,
      '#info-empty':c.empty,
      '#info-cta-eyebrow':c.ctaEyebrow,
      '#info-cta-title':c.ctaTitle,
      '#info-cta-button':c.ctaButton
    };
    Object.entries(map).forEach(([selector,value])=>{const el=document.querySelector(selector);if(el)el.textContent=value;});
  }

  function render(){
    pageCopy();
    const l=lang();
    const entries=blocks
      .map(block=>entryForLanguage(block,l))
      .filter(entry=>entry.title||entry.body)
      .sort((a,b)=>a.order-b.order);

    list.innerHTML='';
    if(indexLinks) indexLinks.innerHTML='';

    if(!entries.length){
      if(empty) empty.hidden=false;
      return;
    }
    if(empty) empty.hidden=true;

    entries.forEach((entry,index)=>{
      const id=`info-${entry.id ? String(entry.id).replace(/[^a-zA-Z0-9_-]/g,'-') : index+1}`;
      const article=document.createElement('article');
      article.className='info-block';
      article.id=id;
      article.innerHTML=`<div class="info-block-number">${pad(index+1)}</div><div class="info-block-content"><h2>${escapeText(entry.title)}</h2><div class="info-block-body">${sanitize(entry.body)}</div></div>`;
      list.appendChild(article);

      if(indexLinks){
        const link=document.createElement('a');
        link.href=`#${id}`;
        link.innerHTML=`<span>${pad(index+1)}</span><span>${escapeText(entry.title)}</span>`;
        indexLinks.appendChild(link);
      }
    });
  }

  async function loadOverride(l,token){
    if(!['es','de'].includes(l)){
      if(token!==refreshToken)return;
      overrides={};
      overrideLang='';
      return;
    }
    try{
      const res=await fetch(`v2/content/info-${l}.json`,{cache:'no-store'});
      if(!res.ok)throw new Error(`Unable to load ${l} info content: ${res.status}`);
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
      if(!res.ok)throw new Error(`Unable to load info content: ${res.status}`);
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
