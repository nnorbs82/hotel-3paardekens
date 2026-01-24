(function() {
  'use strict';

  // Load footer HTML
  function loadFooter() {
    const footer = document.getElementById('footerContainer');
    if (!footer) return;

    fetch('assets/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        footer.innerHTML = html;
        
        // Set the year
        const yearSpan = footer.querySelector('.footer-year');
        if (yearSpan) {
          yearSpan.textContent = new Date().getFullYear();
        }
        
        // Translate the newly inserted footer elements
        if (window.i18n) {
          window.i18n.translatePage();
        }
      })
      .catch(err => console.error('Failed to load footer:', err));
  }

  // Load footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();
