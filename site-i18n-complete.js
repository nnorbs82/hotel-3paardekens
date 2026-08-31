(() => {
  'use strict';

  const LANGS = ['nl','en','fr','es','de'];
  const UI_FILE = 'v2/content/ui-i18n.json';
  let uiData = null;
  let uiPromise = null;
  let privacyEnglish = null;
  const privacyCache = {};

  const lang = () => {
    const value = window.Hotel3P?.getLanguage?.() || document.documentElement.lang || 'en';
    const code = String(value).slice(0,2).toLowerCase();
    return LANGS.includes(code) ? code : 'en';
  };
  const filename = () => {
    const value = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
    return value.includes('.') ? value : `${value}.html`;
  };
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach(el => { if (el) el.textContent = value; });
  };
  async function getUI() {
    if (uiData) return uiData;
    if (!uiPromise) {
      uiPromise = fetch(UI_FILE,{cache:'no-store'})
        .then(response => {
          if (!response.ok) throw new Error(`Unable to load UI translations: ${response.status}`);
          return response.json();
        })
        .then(data => (uiData = data));
    }
    return uiPromise;
  }
  function attachMobileClose(link) {
    if (!link || link.dataset.mobileCloseBound === 'true') return;
    link.dataset.mobileCloseBound = 'true';
    link.addEventListener('click', () => {
      const header = link.closest('.site-header');
      const toggle = header?.querySelector('.menu-toggle');
      header?.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded','false');
    });
  }
  function ensureInfoLinks(c) {
    document.querySelectorAll('.site-header .nav').forEach(nav => {
      let link = nav.querySelector('a[href="info.html"]');
      if (!link) {
        link = document.createElement('a');
        link.href = 'info.html';
        const contact = nav.querySelector('a[href*="#contact"]');
        if (contact) nav.insertBefore(link, contact);
        else nav.appendChild(link);
      }
      link.textContent = c.navInfo;
      link.removeAttribute('data-i18n');
      attachMobileClose(link);
    });
    document.querySelectorAll('.site-footer .footer-col').forEach(col => {
      if (!col.querySelector('h3[data-i18n="footer.explore"]')) return;
      let link = col.querySelector('a[href="info.html"]');
      if (!link) {
        link = document.createElement('a');
        link.href = 'info.html';
        const locationLink = col.querySelector('a[href*="#location"]');
        if (locationLink) col.insertBefore(link, locationLink);
        else col.appendChild(link);
      }
      link.textContent = c.navInfo;
      link.removeAttribute('data-i18n');
    });
  }
  function localizeWalletLinks(c) {
    document.querySelectorAll('a[href="faqs.html"]').forEach(link => {
      link.textContent = c.googleFaq;
      link.removeAttribute('data-i18n');
    });
    document.querySelectorAll('a[href="apple-wallet-faqs.html"]').forEach(link => {
      link.textContent = c.appleFaq;
      link.removeAttribute('data-i18n');
    });
  }
  async function localizePrivacyBody() {
    if (filename() !== 'privacy-policy.html') return;
    const policy = document.querySelector('.content-section .policy');
    if (!policy) return;
    if (privacyEnglish == null) privacyEnglish = policy.innerHTML;
    const code = lang();
    if (code === 'en') {
      policy.innerHTML = privacyEnglish;
      return;
    }
    try {
      if (!privacyCache[code]) {
        const response = await fetch(`v2/content/privacy/${code}.html`,{cache:'no-store'});
        if (!response.ok) throw new Error(`Unable to load privacy translation: ${response.status}`);
        privacyCache[code] = await response.text();
      }
      if (code === lang()) policy.innerHTML = privacyCache[code];
    } catch (error) {
      console.error(error);
    }
  }
  function localizePageChrome(c) {
    const page = filename();
    if (page === 'faqs.html') {
      setText('.content-hero .eyebrow', c.googleEyebrow);
      setText('.content-hero h1', c.googleTitle);
      setText('.content-hero .lead', c.googleLead);
    } else if (page === 'apple-wallet-faqs.html') {
      setText('.content-hero .eyebrow', c.appleEyebrow);
      setText('.content-hero h1', c.appleTitle);
      setText('.content-hero .lead', c.appleLead);
    } else if (page === 'privacy-policy.html') {
      setText('.content-hero .eyebrow', c.privacyEyebrow);
      setText('.content-hero h1', c.privacyTitle);
      setText('.content-hero .lead', c.privacyLead);
      localizePrivacyBody();
    } else if (page === 'cookie-policy.html') {
      setText('.content-hero .eyebrow', c.cookieEyebrow);
    } else if (page === 'terms-and-conditions.html') {
      setText('.content-hero .eyebrow', c.termsEyebrow);
    }
    if (page === 'index.html') {
      const breakfastCaption = document.querySelector('.breakfast-modern-caption span:last-child');
      if (breakfastCaption) breakfastCaption.textContent = c.breakfastLandmark;
      const tags = document.querySelectorAll('.breakfast-modern-card .feature-tags span');
      [c.topFloor,c.glassEnclosed,c.cathedralView].forEach((value,index) => {
        if (tags[index]) tags[index].textContent = value;
      });
      const mapsLink = document.querySelector('.location-map-link');
      if (mapsLink) mapsLink.innerHTML = `${c.openMaps} <span aria-hidden="true">↗</span>`;
      const photoLabel = document.querySelector('.location-photo > span');
      if (photoLabel) photoLabel.textContent = c.historicCentre;
      const heroHotel = document.querySelector('.hero-media img');
      if (heroHotel) heroHotel.alt = c.heroHotelAlt;
      const cathedral = document.querySelector('.intro-image-main');
      if (cathedral) cathedral.alt = c.cathedralAlt;
      const detail = document.querySelector('.intro-image-small');
      if (detail) detail.alt = c.hotelDetailAlt;
      const breakfast = document.querySelector('.breakfast-modern-media > img');
      if (breakfast) breakfast.alt = c.breakfastAlt;
      const sister = document.querySelector('.sister-modern-image img');
      if (sister) sister.alt = c.sisterAlt;
      const locationHotel = document.querySelector('.location-photo img');
      if (locationHotel) locationHotel.alt = c.heroHotelAlt;
    } else if (page === 'rooms.html') {
      const roomsHero = document.querySelector('.rooms-hero-media img');
      if (roomsHero) roomsHero.alt = c.roomsHeroAlt;
    }
    document.querySelectorAll('.site-footer .footer-bottom span:last-child').forEach(el => {
      if (/preview|aperçu|vista previa|vorschau/i.test(el.textContent || '') || el.dataset.previewNotice === 'true') {
        el.dataset.previewNotice = 'true';
        el.textContent = c.previewNotice;
      }
    });
  }
  function localizeMeta(data) {
    const values = data.meta?.[filename()]?.[lang()] || data.meta?.[filename()]?.en;
    if (!values) return;
    document.title = values[0];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', values[1]);
  }
  function localizeDynamicAria(c) {
    document.querySelectorAll('.site-header').forEach(el => el.setAttribute('aria-label', c.mainNavigation));
    document.querySelectorAll('.site-header .nav').forEach(el => el.setAttribute('aria-label', c.mainNavigation));
    document.querySelectorAll('.brand').forEach(el => el.setAttribute('aria-label', c.hotelHome));
    document.querySelectorAll('.lang-toggle').forEach(el => el.setAttribute('aria-label', c.languageSelector));
    document.querySelectorAll('.menu-toggle').forEach(el => el.setAttribute('aria-label', c.openMenu));
    document.querySelectorAll('.booking-shell').forEach(el => el.setAttribute('aria-label', c.checkAvailability));
    document.querySelectorAll('[data-calendar-nav="prev"]').forEach(el => el.setAttribute('aria-label', c.previousMonth));
    document.querySelectorAll('[data-calendar-nav="next"]').forEach(el => el.setAttribute('aria-label', c.nextMonth));
    document.querySelectorAll('.guest-popover').forEach(el => el.setAttribute('aria-label', c.guestSelection));
    document.querySelectorAll('[data-guest-action="adults-minus"]').forEach(el => el.setAttribute('aria-label', c.removeAdult));
    document.querySelectorAll('[data-guest-action="adults-plus"]').forEach(el => el.setAttribute('aria-label', c.addAdult));
    document.querySelectorAll('[data-guest-action="children-minus"]').forEach(el => el.setAttribute('aria-label', c.removeChild));
    document.querySelectorAll('[data-guest-action="children-plus"]').forEach(el => el.setAttribute('aria-label', c.addChild));
    document.querySelectorAll('.lightbox-close').forEach(el => el.setAttribute('aria-label', c.closeGallery));
    document.querySelectorAll('.lightbox-prev').forEach(el => el.setAttribute('aria-label', c.previousPhoto));
    document.querySelectorAll('.lightbox-next').forEach(el => el.setAttribute('aria-label', c.nextPhoto));
    document.querySelectorAll('[data-room-id]').forEach(root => {
      const name = root.querySelector('[data-room-role="name"]')?.textContent?.trim() || root.dataset.roomName || '';
      if (!name) return;
      [...root.querySelectorAll('img')].forEach((image,index) => {
        if (root.classList.contains('room-card')) image.alt = `${name} ${c.atHotel}`;
        else image.alt = index === 0 ? `${name} ${c.atHotel}` : `${name} - ${c.photo} ${index + 1}`;
      });
    });
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = lightbox?.querySelector('.lightbox-image');
    const lightboxTitle = lightbox?.querySelector('.lightbox-title')?.textContent?.trim();
    const counter = lightbox?.querySelector('.lightbox-counter')?.textContent?.trim();
    if (lightboxImage && lightboxTitle && counter) {
      const index = counter.split('/')[0]?.trim() || '';
      lightboxImage.alt = `${lightboxTitle} - ${c.photo} ${index}`;
    }
  }
  async function applyCompleteTranslations() {
    try {
      const data = await getUI();
      const c = data.copy?.[lang()] || data.copy?.en;
      if (!c) return;
      ensureInfoLinks(c);
      localizeWalletLinks(c);
      localizePageChrome(c);
      localizeMeta(data);
      localizeDynamicAria(c);
    } catch (error) {
      console.error(error);
    }
  }
  let dynamicScheduled = false;
  const scheduleDynamic = () => {
    if (dynamicScheduled) return;
    dynamicScheduled = true;
    requestAnimationFrame(async () => {
      dynamicScheduled = false;
      try {
        const data = await getUI();
        const c = data.copy?.[lang()] || data.copy?.en;
        if (c) localizeDynamicAria(c);
      } catch (_) {}
    });
  };
  document.addEventListener('hotelLanguageChanged', applyCompleteTranslations);
  const observer = new MutationObserver(scheduleDynamic);
  observer.observe(document.documentElement, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src']});
  applyCompleteTranslations();
})();
