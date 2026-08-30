(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');

  const updateHeader = () => {
    if (!header || header.classList.contains('header-solid')) return;
    header.classList.toggle('scrolled', window.scrollY > 36);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && header) {
    menuToggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    header.querySelectorAll('.nav a').forEach((link) => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
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
})();
