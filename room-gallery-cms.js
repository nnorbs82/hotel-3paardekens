(() => {
  'use strict';

  const normalizeRoomImage = value => {
    let src = String(value || '').trim();
    if (!src) return '';
    if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
    src = src.replace(/^\/?images\/legacy\/rooms\//i, '/Rooms/');
    if (/^\/?Rooms\//.test(src)) return src.startsWith('/') ? src : `/${src}`;
    if (src.startsWith('/')) return src;
    return `/${src.replace(/^\.?\//, '')}`;
  };

  const localizedName = data => {
    const lang = window.Hotel3P?.getLanguage?.() || 'en';
    return data?.[`name_${lang}`] || data?.name_en || data?.name || 'Room';
  };

  const updateHomeCard = (root, gallery, name) => {
    if (!root.classList.contains('room-card') || !gallery.length) return;
    const image = root.querySelector('img');
    if (!image) return;
    image.src = gallery[0];
    image.alt = `${name} at Hotel 3 Paardekens`;
  };

  const updateShowcase = (root, gallery, name) => {
    if (!root.classList.contains('room-showcase') || !gallery.length) return;

    root.dataset.gallery = JSON.stringify(gallery);
    root.dataset.roomName = name;

    const featureImage = root.querySelector('.room-feature-image img');
    if (featureImage) {
      featureImage.src = gallery[0];
      featureImage.alt = `${name} at Hotel 3 Paardekens`;
    }

    const thumbnails = root.querySelector('.room-thumbnails');
    if (!thumbnails) return;

    const buttons = [...thumbnails.querySelectorAll('.gallery-trigger')];
    const remaining = gallery.slice(1);
    thumbnails.hidden = remaining.length === 0;
    if (!remaining.length || !buttons.length) return;

    const visibleCount = Math.min(remaining.length, buttons.length);
    thumbnails.style.gridTemplateColumns = `repeat(${visibleCount},1fr)`;

    buttons.forEach((button, index) => {
      button.classList.remove('gallery-more');
      const oldBadge = button.querySelector('span');
      if (oldBadge) oldBadge.remove();

      if (index >= remaining.length) {
        button.hidden = true;
        return;
      }

      button.hidden = false;
      const galleryIndex = index + 1;
      button.dataset.galleryOpen = String(galleryIndex);
      const image = button.querySelector('img');
      if (image) {
        image.src = gallery[galleryIndex];
        image.alt = `${name} photo ${galleryIndex + 1}`;
      }

      if (index === buttons.length - 1 && remaining.length > buttons.length) {
        button.classList.add('gallery-more');
        const badge = document.createElement('span');
        badge.textContent = `+${remaining.length - index}`;
        button.appendChild(badge);
      }
    });
  };

  async function loadRoomGalleries() {
    const roots = [...document.querySelectorAll('[data-room-id]')];
    if (!roots.length) return;
    const ids = [...new Set(roots.map(root => root.dataset.roomId).filter(Boolean))];

    await Promise.all(ids.map(async id => {
      try {
        const response = await fetch(`v2/content/rooms/${id}.json`, { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        const gallery = Array.isArray(data.gallery)
          ? data.gallery.map(normalizeRoomImage).filter(Boolean)
          : [];
        if (!gallery.length) return;
        const name = localizedName(data);

        document.querySelectorAll(`[data-room-id="${id}"]`).forEach(root => {
          updateHomeCard(root, gallery, name);
          updateShowcase(root, gallery, name);
        });
      } catch (_) {
        // Existing HTML photography remains as a safe fallback.
      }
    }));
  }

  document.addEventListener('hotelLanguageChanged', loadRoomGalleries);
  loadRoomGalleries();
})();
