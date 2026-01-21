(function() {
  'use strict';

  // Load navigation HTML
  function loadNav() {
    const menubar = document.getElementById('menubar');
    if (!menubar) return;

    fetch('assets/nav.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        menubar.innerHTML = html;
        initNav();
      })
      .catch(err => console.error('Failed to load navigation:', err));
  }

  // Initialize navigation after loading
  function initNav() {
    const menubar = document.getElementById('menubar');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!burgerBtn || !mobileMenu || !menubar) return;

    // Determine current page and update links
    // Primary: URL-based detection to handle production routing (/rooms, /rooms/, rooms.html, rooms.htm)
    // Fallback: DOM-based detection for cases where URL detection might not work
    // This ensures About Us and Contact links navigate to homepage sections when on rooms page
    let currentPage = 'index';
    const pathname = window.location.pathname;
    
    // Check if we're on the rooms page using URL patterns
    // Pattern matches: [/]rooms[/|.html|.htm]
    // Examples: /rooms, /rooms/, /rooms.html, /rooms.htm, rooms.html, rooms.htm
    if (pathname.match(/\/?rooms(\/|\.html?)?$/i)) {
      currentPage = 'rooms';
    }
    // Check if we're on the info page using URL patterns
    // Pattern matches: [/]info[/|.html|.htm]
    // Examples: /info, /info/, /info.html, /info.htm, info.html, info.htm
    else if (pathname.match(/\/?info(\/|\.html?)?$/i)) {
      currentPage = 'info';
    }
    // Fallback: check for #rooms element (unique to rooms.html)
    else if (document.getElementById('rooms')) {
      currentPage = 'rooms';
    }
    // Fallback: check for #infoBlocks element (unique to info.html)
    else if (document.getElementById('infoBlocks')) {
      currentPage = 'info';
    }
    
    const links = mobileMenu.querySelectorAll('a.pill');
    
    links.forEach(link => {
      const href = link.getAttribute(`data-page-${currentPage}`);
      if (href) {
        link.setAttribute('href', href);
      }
    });

    // Close menu helper function
    function closeMenu() {
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

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
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
        burgerBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('is-open') && 
          !menubar.contains(e.target)) {
        closeMenu();
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
