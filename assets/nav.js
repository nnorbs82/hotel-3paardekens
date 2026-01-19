(function() {
  'use strict';

  // Load navigation HTML
  function loadNav() {
    const menubar = document.getElementById('menubar');
    if (!menubar) return;

    fetch('assets/nav.html')
      .then(response => response.text())
      .then(html => {
        menubar.innerHTML = html;
        initNav();
      })
      .catch(err => console.error('Failed to load navigation:', err));
  }

  // Initialize navigation after loading
  function initNav() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!burgerBtn || !mobileMenu) return;

    // Determine current page and update links
    const currentPage = window.location.pathname.includes('rooms.html') ? 'rooms' : 'index';
    const links = mobileMenu.querySelectorAll('a.pill');
    
    links.forEach(link => {
      const href = link.getAttribute(`data-page-${currentPage}`);
      if (href) {
        link.setAttribute('href', href);
      }
    });

    // Burger menu toggle
    burgerBtn.addEventListener('click', function() {
      const expanded = burgerBtn.getAttribute('aria-expanded') === 'true';
      burgerBtn.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('is-open');
      
      // Prevent body scroll when menu is open
      if (!expanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu on link click
    links.forEach(link => {
      link.addEventListener('click', function() {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
        burgerBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('is-open') && 
          !menubar.contains(e.target)) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // Load navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNav);
  } else {
    loadNav();
  }
})();
