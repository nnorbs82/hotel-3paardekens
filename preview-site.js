(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');

  const updateHeader = () => {
    if (!header || header.classList.contains('header-solid') || header.classList.contains('menu-open')) return;
    header.classList.toggle('scrolled', window.scrollY > 48);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      if (!open) updateHeader();
    });

    header.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        updateHeader();
      });
    });
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const toYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const checkin = document.querySelector('#preview-checkin');
  const checkout = document.querySelector('#preview-checkout');
  const bookButton = document.querySelector('#preview-book');
  const mewsBase = 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6';

  if (checkin && checkout) {
    checkin.min = toYMD(today);
    checkin.value = toYMD(today);
    checkout.min = toYMD(tomorrow);
    checkout.value = toYMD(tomorrow);

    checkin.addEventListener('change', () => {
      if (!checkin.value) return;
      const inDate = new Date(`${checkin.value}T00:00:00`);
      const minOut = new Date(inDate);
      minOut.setDate(inDate.getDate() + 1);
      const minOutValue = toYMD(minOut);
      checkout.min = minOutValue;
      if (!checkout.value || checkout.value <= checkin.value) checkout.value = minOutValue;
    });
  }

  if (bookButton) {
    bookButton.addEventListener('click', (event) => {
      event.preventDefault();
      const start = checkin?.value || toYMD(today);
      const end = checkout?.value || toYMD(tomorrow);
      const url = `${mewsBase}?mewsStart=${encodeURIComponent(start)}&mewsEnd=${encodeURIComponent(end)}&mewsRoute=rooms`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  document.querySelectorAll('[data-book]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.id === 'preview-book') return;
      event.preventDefault();
      window.open(`${mewsBase}?mewsRoute=rooms`, '_blank', 'noopener,noreferrer');
    });
  });

  /* Fullscreen gallery for the Rooms page */
  const galleryArticles = document.querySelectorAll('.room-showcase[data-gallery]');
  if (galleryArticles.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Room photo gallery');
    lightbox.innerHTML = `
      <div class="lightbox-top">
        <div class="lightbox-title"></div>
        <div class="lightbox-counter"></div>
        <button class="lightbox-close" type="button" aria-label="Close gallery">×</button>
      </div>
      <div class="lightbox-stage">
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">‹</button>
        <img class="lightbox-image" alt="">
        <button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">›</button>
      </div>
      <div class="lightbox-caption"></div>`;
    document.body.appendChild(lightbox);

    const image = lightbox.querySelector('.lightbox-image');
    const title = lightbox.querySelector('.lightbox-title');
    const counter = lightbox.querySelector('.lightbox-counter');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');

    let gallery = [];
    let galleryName = '';
    let galleryIndex = 0;

    const renderGallery = () => {
      if (!gallery.length) return;
      galleryIndex = (galleryIndex + gallery.length) % gallery.length;
      image.src = gallery[galleryIndex];
      image.alt = `${galleryName} - photo ${galleryIndex + 1}`;
      title.textContent = galleryName;
      counter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
      caption.textContent = `Hotel 3 Paardekens · ${galleryName}`;
    };

    const openGallery = (article, index = 0) => {
      try {
        gallery = JSON.parse(article.dataset.gallery || '[]');
      } catch {
        gallery = [];
      }
      if (!gallery.length) return;
      galleryName = article.dataset.roomName || 'Room';
      galleryIndex = Number(index) || 0;
      renderGallery();
      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    const closeGallery = () => {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      image.removeAttribute('src');
    };

    galleryArticles.forEach((article) => {
      article.querySelectorAll('.gallery-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => openGallery(article, trigger.dataset.galleryOpen || 0));
      });
    });

    closeButton.addEventListener('click', closeGallery);
    previousButton.addEventListener('click', () => { galleryIndex -= 1; renderGallery(); });
    nextButton.addEventListener('click', () => { galleryIndex += 1; renderGallery(); });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeGallery();
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') { galleryIndex -= 1; renderGallery(); }
      if (event.key === 'ArrowRight') { galleryIndex += 1; renderGallery(); }
    });
  }
})();
