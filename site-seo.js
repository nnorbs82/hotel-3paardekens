(() => {
  'use strict';

  const LANGS = ['nl','en','fr','es','de'];
  const PROD_ORIGIN = 'https://3paardekens.com';
  const UI_FILE = 'v2/content/ui-i18n.json';
  const MEWS_URL = 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6';
  const LOCALES = { nl:'nl_BE', en:'en_GB', fr:'fr_BE', es:'es_ES', de:'de_DE' };

  const pageFile = () => {
    const value = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    return value.includes('.') ? value : `${value}.html`;
  };

  const productionPath = () => {
    const page = pageFile();
    return page === 'index.html' ? '/' : `/${page}`;
  };

  const currentLang = () => {
    const value = window.Hotel3P?.getLanguage?.() || document.documentElement.lang || 'en';
    const code = String(value).slice(0,2).toLowerCase();
    return LANGS.includes(code) ? code : 'en';
  };

  const productionUrl = language => `${PROD_ORIGIN}${productionPath()}?lang=${language}`;
  const isProduction = () => ['3paardekens.com','www.3paardekens.com'].includes(location.hostname.toLowerCase());

  let uiPromise = null;
  const getUI = () => {
    if (!uiPromise) {
      uiPromise = fetch(UI_FILE,{cache:'no-store'})
        .then(response => {
          if (!response.ok) throw new Error(`Unable to load SEO translations: ${response.status}`);
          return response.json();
        });
    }
    return uiPromise;
  };

  const upsertLink = (key, attrs) => {
    let node = document.head.querySelector(`link[data-seo-key="${key}"]`);
    if (!node) {
      node = document.createElement('link');
      node.dataset.seoKey = key;
      document.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([name,value]) => node.setAttribute(name,value));
    return node;
  };

  const upsertMeta = (key, attrs) => {
    let node = document.head.querySelector(`meta[data-seo-key="${key}"]`);
    if (!node) {
      node = document.createElement('meta');
      node.dataset.seoKey = key;
      document.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([name,value]) => node.setAttribute(name,value));
    return node;
  };

  const localizeInternalLinks = language => {
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.hasAttribute('data-book')) return;
      const raw = link.getAttribute('href') || '';
      if (!raw || raw.startsWith('#') || /^(mailto:|tel:|javascript:|data:)/i.test(raw)) return;

      let url;
      try { url = new URL(raw, location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (!(/\.html$/i.test(url.pathname) || url.pathname === '/' || url.pathname === '')) return;

      url.searchParams.set('lang', language);
      const replacement = `${url.pathname}${url.search}${url.hash}`;
      link.setAttribute('href', replacement);
    });
  };

  const ensureLanguageInUrl = language => {
    const url = new URL(location.href);
    const requested = url.searchParams.get('lang');
    if (requested === language) return;
    if (!requested && LANGS.includes(language)) {
      url.searchParams.set('lang', language);
      history.replaceState({},'',`${url.pathname}${url.search}${url.hash}`);
    }
  };

  const applyCanonicalAndHreflang = language => {
    if (!isProduction()) return;

    upsertLink('canonical',{rel:'canonical',href:productionUrl(language)});
    LANGS.forEach(code => {
      upsertLink(`hreflang-${code}`,{
        rel:'alternate',
        hreflang:code,
        href:productionUrl(code)
      });
    });
    upsertLink('hreflang-default',{
      rel:'alternate',
      hreflang:'x-default',
      href:productionUrl('en')
    });
  };

  const applySocialMeta = (language, title, description) => {
    if (!isProduction()) return;
    const canonical = productionUrl(language);
    const image = `${PROD_ORIGIN}/assets/background.jpg`;

    upsertMeta('og-type',{property:'og:type',content:'website'});
    upsertMeta('og-site-name',{property:'og:site_name',content:'Hotel 3 Paardekens'});
    upsertMeta('og-title',{property:'og:title',content:title});
    upsertMeta('og-description',{property:'og:description',content:description});
    upsertMeta('og-url',{property:'og:url',content:canonical});
    upsertMeta('og-image',{property:'og:image',content:image});
    upsertMeta('og-image-alt',{property:'og:image:alt',content:'Hotel 3 Paardekens in Mechelen'});
    upsertMeta('og-locale',{property:'og:locale',content:LOCALES[language] || LOCALES.en});

    document.head.querySelectorAll('meta[data-seo-locale-alt="true"]').forEach(node => node.remove());
    LANGS.filter(code => code !== language).forEach(code => {
      const node = document.createElement('meta');
      node.property = 'og:locale:alternate';
      node.content = LOCALES[code];
      node.dataset.seoLocaleAlt = 'true';
      document.head.appendChild(node);
    });

    upsertMeta('twitter-card',{name:'twitter:card',content:'summary_large_image'});
    upsertMeta('twitter-title',{name:'twitter:title',content:title});
    upsertMeta('twitter-description',{name:'twitter:description',content:description});
    upsertMeta('twitter-image',{name:'twitter:image',content:image});
  };

  const applyStructuredData = (language, description) => {
    if (!isProduction()) return;

    const hotel = {
      '@type':'Hotel',
      '@id':`${PROD_ORIGIN}/#hotel`,
      name:'Hotel 3 Paardekens',
      url:PROD_ORIGIN,
      description,
      image:[
        `${PROD_ORIGIN}/assets/background.jpg`,
        `${PROD_ORIGIN}/assets/3paardekens-breakfast.webp`,
        `${PROD_ORIGIN}/Rooms/Double/6.jpg`
      ],
      logo:`${PROD_ORIGIN}/assets/3plogo.png`,
      telephone:'+32 15 342 713',
      email:'info@3paardekens.be',
      address:{
        '@type':'PostalAddress',
        streetAddress:'Begijnenstraat 3',
        postalCode:'2800',
        addressLocality:'Mechelen',
        addressCountry:'BE'
      },
      geo:{
        '@type':'GeoCoordinates',
        latitude:51.0259,
        longitude:4.4777
      },
      starRating:{
        '@type':'Rating',
        ratingValue:3
      },
      numberOfRooms:33,
      hasMap:'https://www.google.com/maps?q=Begijnenstraat+3,+2800+Mechelen',
      potentialAction:{
        '@type':'ReserveAction',
        target:{
          '@type':'EntryPoint',
          urlTemplate:MEWS_URL
        }
      }
    };

    const graph = [hotel];
    if (pageFile() === 'index.html') {
      graph.push({
        '@type':'WebSite',
        '@id':`${PROD_ORIGIN}/#website`,
        url:PROD_ORIGIN,
        name:'Hotel 3 Paardekens',
        alternateName:'3 Paardekens',
        inLanguage:language,
        publisher:{'@id':`${PROD_ORIGIN}/#hotel`}
      });
    }

    let script = document.head.querySelector('script[data-seo-jsonld="true"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonld = 'true';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context':'https://schema.org',
      '@graph':graph
    });
  };

  async function applySEO() {
    const language = currentLang();
    ensureLanguageInUrl(language);
    localizeInternalLinks(language);

    if (!isProduction()) return;

    try {
      const ui = await getUI();
      const meta = ui.meta?.[pageFile()]?.[language] || ui.meta?.[pageFile()]?.en;
      const title = meta?.[0] || document.title || 'Hotel 3 Paardekens';
      const description = meta?.[1] || document.querySelector('meta[name="description"]')?.content || '';

      applyCanonicalAndHreflang(language);
      applySocialMeta(language,title,description);
      applyStructuredData(language,description);
    } catch (error) {
      console.error(error);
    }
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applySEO();
    });
  };

  document.addEventListener('hotelLanguageChanged', schedule);
  applySEO();
})();
