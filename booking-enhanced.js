(() => {
  'use strict';

  const mewsBase = 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6';
  const languageMap = { nl:'nl-NL', en:'en-GB', fr:'fr-FR', es:'es-ES', de:'de-DE' };
  const localeMap = { nl:'nl-BE', en:'en-GB', fr:'fr-BE', es:'es-ES', de:'de-DE' };
  const copy = {
    nl:{ guests:'Gasten', adults:'Volwassenen', children:'Kinderen', adultOne:'volwassene', adultMany:'volwassenen', childOne:'kind', childMany:'kinderen', chooseArrival:'Kies aankomst', chooseDeparture:'Kies vertrek', arrivalHint:'Selecteer uw aankomstdatum', departureHint:'Selecteer uw vertrekdatum' },
    en:{ guests:'Guests', adults:'Adults', children:'Children', adultOne:'adult', adultMany:'adults', childOne:'child', childMany:'children', chooseArrival:'Choose arrival', chooseDeparture:'Choose departure', arrivalHint:'Select your check-in date', departureHint:'Select your check-out date' },
    fr:{ guests:'Personnes', adults:'Adultes', children:'Enfants', adultOne:'adulte', adultMany:'adultes', childOne:'enfant', childMany:'enfants', chooseArrival:'Choisir l’arrivée', chooseDeparture:'Choisir le départ', arrivalHint:'Sélectionnez votre date d’arrivée', departureHint:'Sélectionnez votre date de départ' },
    es:{ guests:'Huéspedes', adults:'Adultos', children:'Niños', adultOne:'adulto', adultMany:'adultos', childOne:'niño', childMany:'niños', chooseArrival:'Elegir llegada', chooseDeparture:'Elegir salida', arrivalHint:'Seleccione su fecha de llegada', departureHint:'Seleccione su fecha de salida' },
    de:{ guests:'Gäste', adults:'Erwachsene', children:'Kinder', adultOne:'Erwachsener', adultMany:'Erwachsene', childOne:'Kind', childMany:'Kinder', chooseArrival:'Anreise wählen', chooseDeparture:'Abreise wählen', arrivalHint:'Wählen Sie Ihr Anreisedatum', departureHint:'Wählen Sie Ihr Abreisedatum' }
  };

  let adults = 2;
  let children = 0;
  const dateStates = [];

  const getLang = () => {
    const lang = window.Hotel3P?.getLanguage?.() || document.documentElement.lang || 'en';
    return String(lang).slice(0,2).toLowerCase();
  };
  const getCopy = () => copy[getLang()] || copy.en;
  const getLocale = () => localeMap[getLang()] || localeMap.en;

  const parseYMD = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const toYMD = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const addDays = (date, amount) => { const next = new Date(date); next.setDate(next.getDate() + amount); return next; };
  const addMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1, 12, 0, 0, 0);
  const monthStart = date => new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0, 0);
  const sameDate = (a,b) => Boolean(a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate());

  const formatDisplayDate = value => {
    const date = parseYMD(value);
    if (!date) return '';
    return new Intl.DateTimeFormat(getLocale(), { day:'2-digit', month:'short', year:'numeric' }).format(date);
  };

  const weekdayNames = () => {
    const monday = new Date(2024,0,1,12,0,0,0);
    const formatter = new Intl.DateTimeFormat(getLocale(), { weekday:'short' });
    return Array.from({length:7}, (_,index) => formatter.format(addDays(monday,index)).replace('.',''));
  };

  const longDateLabel = date => new Intl.DateTimeFormat(getLocale(), { weekday:'long', day:'numeric', month:'long', year:'numeric' }).format(date);

  const calendarCopy = input => {
    const s = getCopy();
    const checkout = input.id === 'preview-checkout';
    return {
      title: checkout ? s.chooseDeparture : s.chooseArrival,
      hint: checkout ? s.departureHint : s.arrivalHint
    };
  };

  const calendarIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3M17 2v3M3.5 9h17M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  const closeCalendar = state => {
    if (!state) return;
    state.field.classList.remove('is-open');
    state.toggle.setAttribute('aria-expanded','false');
  };

  const closeAllCalendars = except => {
    dateStates.forEach(state => { if (state !== except) closeCalendar(state); });
  };

  const syncDateDisplays = () => {
    dateStates.forEach(state => {
      state.value.textContent = formatDisplayDate(state.input.value);
      const calendarText = calendarCopy(state.input);
      state.toggle.setAttribute('aria-label', `${calendarText.title}: ${state.value.textContent}`);
    });
  };

  const renderMonth = (state, monthDate) => {
    const monthName = new Intl.DateTimeFormat(getLocale(), { month:'long', year:'numeric' }).format(monthDate);
    const weekdays = weekdayNames();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1, 12, 0, 0, 0);
    const daysInMonth = new Date(year, month + 1, 0, 12, 0, 0, 0).getDate();
    const leading = (first.getDay() + 6) % 7;
    const minDate = parseYMD(state.input.min);
    const today = parseYMD(toYMD(new Date()));
    const checkin = parseYMD(document.querySelector('#preview-checkin')?.value);
    const checkout = parseYMD(document.querySelector('#preview-checkout')?.value);

    const cells = [];
    for (let index=0; index<leading; index++) cells.push('<span class="calendar-day-empty" aria-hidden="true"></span>');

    for (let day=1; day<=daysInMonth; day++) {
      const date = new Date(year, month, day, 12, 0, 0, 0);
      const value = toYMD(date);
      const disabled = Boolean(minDate && date < minDate);
      const isStart = sameDate(date,checkin);
      const isEnd = sameDate(date,checkout);
      const inRange = Boolean(checkin && checkout && date > checkin && date < checkout);
      const classes = ['calendar-day'];
      if (sameDate(date,today)) classes.push('is-today');
      if (isStart) classes.push('is-start');
      if (isEnd) classes.push('is-end');
      if (inRange) classes.push('is-in-range');
      cells.push(`<button class="${classes.join(' ')}" type="button" data-calendar-date="${value}" aria-label="${longDateLabel(date)}"${disabled?' disabled':''}${(isStart||isEnd)?' aria-pressed="true"':''}>${day}</button>`);
    }

    while (cells.length % 7 !== 0) cells.push('<span class="calendar-day-empty" aria-hidden="true"></span>');
    while (cells.length < 42) cells.push('<span class="calendar-day-empty" aria-hidden="true"></span>');

    return `<section class="calendar-month"><h3 class="calendar-month-name">${monthName}</h3><div class="calendar-weekdays">${weekdays.map(day=>`<span>${day}</span>`).join('')}</div><div class="calendar-days">${cells.join('')}</div></section>`;
  };

  const renderCalendar = state => {
    const text = calendarCopy(state.input);
    state.popover.innerHTML = `
      <div class="calendar-toolbar">
        <button class="calendar-nav" type="button" data-calendar-nav="prev" aria-label="Previous month">‹</button>
        <div class="calendar-toolbar-title">${text.title}</div>
        <button class="calendar-nav" type="button" data-calendar-nav="next" aria-label="Next month">›</button>
      </div>
      <div class="calendar-months">
        ${renderMonth(state,state.viewMonth)}
        ${renderMonth(state,addMonths(state.viewMonth,1))}
      </div>
      <div class="calendar-footer">${text.hint}</div>`;
  };

  const openCalendar = state => {
    if (!state) return;
    closeAllCalendars(state);
    document.querySelectorAll('.booking-guest-field.is-open').forEach(field => {
      field.classList.remove('is-open');
      field.querySelector('.booking-guest-toggle')?.setAttribute('aria-expanded','false');
    });
    const selected = parseYMD(state.input.value) || parseYMD(state.input.min) || new Date();
    state.viewMonth = monthStart(selected);
    renderCalendar(state);
    state.field.classList.add('is-open');
    state.toggle.setAttribute('aria-expanded','true');
  };

  const chooseDate = (state, value) => {
    state.input.value = value;
    state.input.dispatchEvent(new Event('input',{bubbles:true}));
    state.input.dispatchEvent(new Event('change',{bubbles:true}));
    syncDateDisplays();
    dateStates.filter(item => item.field.classList.contains('is-open')).forEach(renderCalendar);
    closeCalendar(state);

    if (state.input.id === 'preview-checkin') {
      const checkoutState = dateStates.find(item => item.input.id === 'preview-checkout');
      if (checkoutState) window.setTimeout(() => openCalendar(checkoutState), 80);
    }
  };

  const enhanceDateFields = () => {
    document.querySelectorAll('.booking-bar input[type="date"]').forEach(input => {
      const field = input.closest('.booking-field');
      if (!field || field.dataset.enhancedDate === 'true') return;
      field.dataset.enhancedDate = 'true';
      field.dataset.calendarSide = input.id === 'preview-checkout' ? 'checkout' : 'checkin';
      field.classList.add('booking-date-field');
      input.classList.add('booking-native-date');
      input.tabIndex = -1;
      input.setAttribute('aria-hidden','true');

      const toggle = document.createElement('button');
      toggle.className = 'booking-date-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-haspopup','dialog');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML = `<span class="booking-date-value"></span><span class="booking-date-icon">${calendarIcon}</span>`;
      input.before(toggle);

      const popover = document.createElement('div');
      popover.className = 'calendar-popover';
      popover.setAttribute('role','dialog');
      popover.setAttribute('aria-label', calendarCopy(input).title);
      field.appendChild(popover);

      const state = { input, field, toggle, popover, value:toggle.querySelector('.booking-date-value'), viewMonth:monthStart(parseYMD(input.value) || new Date()) };
      dateStates.push(state);

      toggle.addEventListener('click', event => {
        event.stopPropagation();
        if (field.classList.contains('is-open')) closeCalendar(state);
        else openCalendar(state);
      });

      field.addEventListener('click', event => {
        if (event.target.closest('.calendar-popover') || event.target.closest('.booking-date-toggle')) return;
        openCalendar(state);
      });

      popover.addEventListener('click', event => {
        event.stopPropagation();
        const nav = event.target.closest('[data-calendar-nav]');
        if (nav) {
          state.viewMonth = addMonths(state.viewMonth, nav.dataset.calendarNav === 'prev' ? -1 : 1);
          renderCalendar(state);
          return;
        }
        const day = event.target.closest('[data-calendar-date]');
        if (day && !day.disabled) chooseDate(state,day.dataset.calendarDate);
      });

      input.addEventListener('change', () => {
        syncDateDisplays();
        dateStates.filter(item => item.field.classList.contains('is-open')).forEach(renderCalendar);
      });
    });

    syncDateDisplays();
  };

  const guestSummary = () => {
    const s = getCopy();
    const parts = [`${adults} ${adults === 1 ? s.adultOne : s.adultMany}`];
    if (children > 0) parts.push(`${children} ${children === 1 ? s.childOne : s.childMany}`);
    return parts.join(' · ');
  };

  const updateGuestField = field => {
    if (!field) return;
    const s = getCopy();
    field.querySelector('.booking-label').textContent = s.guests;
    field.querySelector('.guest-summary').textContent = guestSummary();
    field.querySelector('[data-guest-copy="adults"]').textContent = s.adults;
    field.querySelector('[data-guest-copy="children"]').textContent = s.children;
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
          <div class="guest-row-copy"><strong data-guest-copy="adults">Adults</strong></div>
          <div class="guest-stepper">
            <button type="button" data-guest-action="adults-minus" aria-label="Remove adult">−</button>
            <span class="guest-count" data-guest-count="adults">2</span>
            <button type="button" data-guest-action="adults-plus" aria-label="Add adult">+</button>
          </div>
        </div>
        <div class="guest-row">
          <div class="guest-row-copy"><strong data-guest-copy="children">Children</strong></div>
          <div class="guest-stepper">
            <button type="button" data-guest-action="children-minus" aria-label="Remove child">−</button>
            <span class="guest-count" data-guest-count="children">0</span>
            <button type="button" data-guest-action="children-plus" aria-label="Add child">+</button>
          </div>
        </div>
      </div>`;

    bar.insertBefore(field,submit);
    const toggle = field.querySelector('.booking-guest-toggle');
    const close = () => {
      field.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    };

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      closeAllCalendars();
      const open = field.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
    });

    field.querySelectorAll('[data-guest-action]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const action = button.dataset.guestAction;
        if (action === 'adults-minus') adults = Math.max(1,adults-1);
        if (action === 'adults-plus') adults = Math.min(8,adults+1);
        if (action === 'children-minus') children = Math.max(0,children-1);
        if (action === 'children-plus') children = Math.min(6,children+1);
        updateGuestField(field);
      });
    });

    document.addEventListener('click', event => { if (!field.contains(event.target)) close(); });
    document.addEventListener('hotelLanguageChanged', () => updateGuestField(field));
    updateGuestField(field);
    return field;
  };

  const buildMewsUrl = () => {
    const url = new URL(mewsBase);
    const checkin = document.querySelector('#preview-checkin');
    const checkout = document.querySelector('#preview-checkout');
    url.searchParams.set('mewsRoute','rooms');
    if (checkin?.value) url.searchParams.set('mewsStart',checkin.value);
    if (checkout?.value) url.searchParams.set('mewsEnd',checkout.value);
    url.searchParams.set('mewsAdultCount',String(adults));
    url.searchParams.set('mewsChildCount',String(children));
    url.searchParams.set('language',languageMap[getLang()] || 'en-GB');
    return url.toString();
  };

  const interceptBookingLinks = () => {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('#preview-book, [data-book]');
      if (!trigger || !document.querySelector('.booking-bar')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(buildMewsUrl(),'_blank','noopener,noreferrer');
    },true);
  };

  document.addEventListener('click', () => closeAllCalendars());
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAllCalendars(); });
  document.addEventListener('hotelLanguageChanged', () => {
    syncDateDisplays();
    dateStates.filter(state => state.field.classList.contains('is-open')).forEach(renderCalendar);
  });
  window.addEventListener('resize', () => {
    dateStates.filter(state => state.field.classList.contains('is-open')).forEach(renderCalendar);
  });

  enhanceDateFields();
  addGuestField();
  interceptBookingLinks();
})();
