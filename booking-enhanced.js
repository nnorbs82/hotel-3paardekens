(() => {
  'use strict';

  const mewsBase = 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6';
  const languageMap = { nl:'nl-NL', en:'en-GB', fr:'fr-FR', es:'es-ES', de:'de-DE' };
  const copy = {
    nl:{ guests:'Gasten', adults:'Volwassenen', adultHint:'', children:'Kinderen', childHint:'', adultOne:'volwassene', adultMany:'volwassenen', childOne:'kind', childMany:'kinderen' },
    en:{ guests:'Guests', adults:'Adults', adultHint:'', children:'Children', childHint:'', adultOne:'adult', adultMany:'adults', childOne:'child', childMany:'children' },
    fr:{ guests:'Personnes', adults:'Adultes', adultHint:'', children:'Enfants', childHint:'', adultOne:'adulte', adultMany:'adultes', childOne:'enfant', childMany:'enfants' },
    es:{ guests:'Huéspedes', adults:'Adultos', adultHint:'', children:'Niños', childHint:'', adultOne:'adulto', adultMany:'adultos', childOne:'niño', childMany:'niños' },
    de:{ guests:'Gäste', adults:'Erwachsene', adultHint:'', children:'Kinder', childHint:'', adultOne:'Erwachsener', adultMany:'Erwachsene', childOne:'Kind', childMany:'Kinder' }
  };

  let adults = 2;
  let children = 0;

  const getLang = () => {
    const lang = window.Hotel3P?.getLanguage?.() || document.documentElement.lang || 'en';
    return String(lang).slice(0,2).toLowerCase();
  };

  const getCopy = () => copy[getLang()] || copy.en;

  const openDatePicker = (input) => {
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') input.showPicker();
      else input.focus();
    } catch (_) {
      input.focus();
    }
  };

  const enhanceDateFields = () => {
    document.querySelectorAll('.booking-bar input[type="date"]').forEach(input => {
      const field = input.closest('.booking-field');
      if (!field || field.dataset.enhancedDate === 'true') return;
      field.dataset.enhancedDate = 'true';
      field.classList.add('booking-date-field');

      field.addEventListener('click', () => openDatePicker(input));

      input.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openDatePicker(input);
      });
    });
  };

  const guestSummary = () => {
    const s = getCopy();
    const parts = [`${adults} ${adults === 1 ? s.adultOne : s.adultMany}`];
    if (children > 0) parts.push(`${children} ${children === 1 ? s.childOne : s.childMany}`);
    return parts.join(' · ');
  };

  const updateGuestField = (field) => {
    if (!field) return;
    const s = getCopy();
    field.querySelector('.booking-label').textContent = s.guests;
    field.querySelector('.guest-summary').textContent = guestSummary();
    field.querySelector('[data-guest-copy="adults"]').textContent = s.adults;
    field.querySelector('[data-guest-copy="adultHint"]').textContent = s.adultHint;
    field.querySelector('[data-guest-copy="children"]').textContent = s.children;
    field.querySelector('[data-guest-copy="childHint"]').textContent = s.childHint;
    field.querySelector('[data-guest-count="adults"]').textContent = String(adults);
    field.querySelector('[data-guest-count="children"]').textContent = String(children);
    field.querySelector('[data-guest-action="adults-minus"]').disabled = adults <= 1;
    field.querySelector('[data-guest-action="adults-plus"]').disabled = adults >= 8;
    field.querySelector('[data-guest-action="children-minus"]').disabled = children <= 0;
    field.querySelector('[data-guest-action="children-plus"]').disabled = children >= 6;
  };

  const addGuestField = () => {
    const bar = document.querySelector('.booking-bar');
    if (!bar || bar.querySelector('.booking-guest-field')) return null;
    const submit = bar.querySelector('.booking-submit');
    if (!submit) return null;

    const field = document.createElement('div');
    field.className = 'booking-field booking-guest-field';
    field.innerHTML = `
      <span class="booking-label">Guests</span>
      <button class="booking-guest-toggle" type="button" aria-haspopup="dialog" aria-expanded="false">
        <span class="guest-summary">2 adults</span><span class="guest-chevron" aria-hidden="true">⌄</span>
      </button>
      <div class="guest-popover" role="dialog" aria-label="Guest selection">
        <div class="guest-row">
          <div class="guest-row-copy"><strong data-guest-copy="adults">Adults</strong><span data-guest-copy="adultHint"></span></div>
          <div class="guest-stepper">
            <button type="button" data-guest-action="adults-minus" aria-label="Remove adult">−</button>
            <span class="guest-count" data-guest-count="adults">2</span>
            <button type="button" data-guest-action="adults-plus" aria-label="Add adult">+</button>
          </div>
        </div>
        <div class="guest-row">
          <div class="guest-row-copy"><strong data-guest-copy="children">Children</strong><span data-guest-copy="childHint"></span></div>
          <div class="guest-stepper">
            <button type="button" data-guest-action="children-minus" aria-label="Remove child">−</button>
            <span class="guest-count" data-guest-count="children">0</span>
            <button type="button" data-guest-action="children-plus" aria-label="Add child">+</button>
          </div>
        </div>
      </div>`;

    bar.insertBefore(field, submit);
    const toggle = field.querySelector('.booking-guest-toggle');

    const close = () => {
      field.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    };

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const open = field.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    field.querySelectorAll('[data-guest-action]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const action = button.dataset.guestAction;
        if (action === 'adults-minus') adults = Math.max(1, adults - 1);
        if (action === 'adults-plus') adults = Math.min(8, adults + 1);
        if (action === 'children-minus') children = Math.max(0, children - 1);
        if (action === 'children-plus') children = Math.min(6, children + 1);
        updateGuestField(field);
      });
    });

    document.addEventListener('click', event => {
      if (!field.contains(event.target)) close();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') close();
    });

    document.addEventListener('hotelLanguageChanged', () => updateGuestField(field));
    updateGuestField(field);
    return field;
  };

  const buildMewsUrl = () => {
    const url = new URL(mewsBase);
    const checkin = document.querySelector('#preview-checkin');
    const checkout = document.querySelector('#preview-checkout');
    url.searchParams.set('mewsRoute','rooms');
    if (checkin?.value) url.searchParams.set('mewsStart', checkin.value);
    if (checkout?.value) url.searchParams.set('mewsEnd', checkout.value);
    url.searchParams.set('mewsAdultCount', String(adults));
    url.searchParams.set('mewsChildCount', String(children));
    url.searchParams.set('language', languageMap[getLang()] || 'en-GB');
    return url.toString();
  };

  const interceptBookingLinks = () => {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('#preview-book, [data-book]');
      if (!trigger) return;
      if (!document.querySelector('.booking-bar')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(buildMewsUrl(), '_blank', 'noopener,noreferrer');
    }, true);
  };

  enhanceDateFields();
  addGuestField();
  interceptBookingLinks();
})();
