/**
 * Hotel 3 Paardekens - GDPR-Compliant Cookie Consent System
 * Manages cookie consent and Google Analytics integration
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'hotel3p_cookie_consent';
  const GA_ID = 'G-MX66JGB1Z9';
  
  // Cookie consent state
  let consentState = {
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    timestamp: null
  };

  /**
   * Initialize the cookie consent system
   */
  function init() {
    // Load saved consent preferences
    loadConsent();
    
    // If no consent decision has been made, show the banner
    if (consentState.timestamp === null) {
      showBanner();
    } else {
      // Show cookie settings button
      showCookieSettingsButton();
      
      // Load analytics if consented
      if (consentState.analytics) {
        loadGoogleAnalytics();
      }
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Add keyboard accessibility
    document.addEventListener('keydown', handleEscapeKey);
  }

  /**
   * Load consent preferences from localStorage
   */
  function loadConsent() {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        consentState = { ...consentState, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load consent preferences:', e);
    }
  }

  /**
   * Save consent preferences to localStorage
   */
  function saveConsent() {
    try {
      consentState.timestamp = new Date().toISOString();
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentState));
    } catch (e) {
      console.error('Failed to save consent preferences:', e);
    }
  }

  /**
   * Show the cookie consent banner
   */
  function showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3 id="cookie-banner-title" data-i18n="cookie.banner.title">Cookie consent</h3>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary" data-i18n="cookie.accept.all">
            Accept all cookies
          </button>
          <button id="cookie-reject-all" class="cookie-btn cookie-btn-secondary" data-i18n="cookie.reject.all">
            Reject all cookies
          </button>
          <button id="cookie-customize" class="cookie-btn cookie-btn-tertiary" data-i18n="cookie.customize">
            Customize cookies
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add animation class after a brief delay
    setTimeout(() => banner.classList.add('visible'), 10);
  }

  /**
   * Hide and remove the cookie banner
   */
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  }

  /**
   * Show the cookie settings button
   */
  function showCookieSettingsButton() {
    // Check if button already exists
    if (document.getElementById('cookie-settings-button')) {
      return;
    }
    
    const button = document.createElement('button');
    button.id = 'cookie-settings-button';
    button.className = 'cookie-settings-btn';
    button.setAttribute('aria-label', 'Cookie Settings');
    button.setAttribute('title', 'Cookie Settings');
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z" fill="currentColor"/>
        <path d="M10 6C7.79 6 6 7.79 6 10C6 12.21 7.79 14 10 14C12.21 14 14 12.21 14 10C14 7.79 12.21 6 10 6ZM10 12C8.9 12 8 11.1 8 10C8 8.9 8.9 8 10 8C11.1 8 12 8.9 12 10C12 11.1 11.1 12 10 12Z" fill="currentColor"/>
      </svg>
      <span data-i18n="cookie.settings">Cookie Settings</span>
    `;
    
    document.body.appendChild(button);
  }

  /**
   * Hide the cookie settings button
   */
  function hideCookieSettingsButton() {
    const button = document.getElementById('cookie-settings-button');
    if (button) {
      button.remove();
    }
  }

  /**
   * Show the cookie preferences modal
   */
  function showModal() {
    const modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.className = 'cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'cookie-modal-title');
    modal.setAttribute('aria-modal', 'true');
    
    modal.innerHTML = `
      <div class="cookie-modal-overlay"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2 id="cookie-modal-title" data-i18n="cookie.preferences.title">Cookie Preferences</h2>
          <button class="cookie-modal-close" aria-label="Close" title="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="cookie-modal-body">
          <p data-i18n="cookie.preferences.description">
            We use cookies to improve your experience on our website. You can choose which types of cookies to allow.
          </p>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-category-label">
                <input type="checkbox" checked disabled>
                <span class="cookie-category-title" data-i18n="cookie.necessary.title">Necessary Cookies</span>
              </label>
              <span class="cookie-category-badge" data-i18n="cookie.always.on">Always On</span>
            </div>
            <p class="cookie-category-description" data-i18n="cookie.necessary.description">
              These cookies are essential for the website to function properly. They enable basic features like page navigation, 
              authentication, and access to secure areas. The website cannot function without these cookies.
            </p>
          </div>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-category-label">
                <input type="checkbox" id="analytics-toggle" ${consentState.analytics ? 'checked' : ''}>
                <span class="cookie-category-title" data-i18n="cookie.analytics.title">Analytics Cookies</span>
              </label>
            </div>
            <p class="cookie-category-description" data-i18n="cookie.analytics.description">
              These cookies help us understand how visitors interact with our website by collecting and reporting information 
              anonymously. We use Google Analytics to track page views and user behavior to improve our service.
            </p>
          </div>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <label class="cookie-category-label">
                <input type="checkbox" id="marketing-toggle" ${consentState.marketing ? 'checked' : ''}>
                <span class="cookie-category-title" data-i18n="cookie.marketing.title">Marketing Cookies</span>
              </label>
            </div>
            <p class="cookie-category-description" data-i18n="cookie.marketing.description">
              These cookies are used to track visitors across websites and display relevant advertisements. 
              We currently do not use marketing cookies, but this option is available for future use.
            </p>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="cookie-save-preferences" class="cookie-btn cookie-btn-primary" data-i18n="cookie.save.preferences">
            Save Preferences
          </button>
          <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary" data-i18n="cookie.accept.all">
            Accept All
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add animation class after a brief delay
    setTimeout(() => modal.classList.add('visible'), 10);
    
    // Focus first interactive element
    setTimeout(() => {
      const firstToggle = modal.querySelector('#analytics-toggle');
      if (firstToggle) firstToggle.focus();
    }, 100);
  }

  /**
   * Hide and remove the cookie modal
   */
  function hideModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => modal.remove(), 300);
    }
  }

  /**
   * Handle Accept All action
   */
  function acceptAll() {
    consentState.analytics = true;
    consentState.marketing = true;
    saveConsent();
    loadGoogleAnalytics();
    hideBanner();
    hideModal();
    showCookieSettingsButton();
  }

  /**
   * Handle Reject All action
   */
  function rejectAll() {
    consentState.analytics = false;
    consentState.marketing = false;
    saveConsent();
    hideBanner();
    hideModal();
    showCookieSettingsButton();
  }

  /**
   * Handle Save Preferences action
   */
  function savePreferences() {
    const analyticsToggle = document.getElementById('analytics-toggle');
    const marketingToggle = document.getElementById('marketing-toggle');
    
    if (analyticsToggle) {
      consentState.analytics = analyticsToggle.checked;
    }
    if (marketingToggle) {
      consentState.marketing = marketingToggle.checked;
    }
    
    saveConsent();
    
    // Load analytics if consented
    if (consentState.analytics) {
      loadGoogleAnalytics();
    }
    
    hideBanner();
    hideModal();
    showCookieSettingsButton();
  }

  /**
   * Load Google Analytics script
   */
  function loadGoogleAnalytics() {
    // Check if already loaded
    if (window.gtag || document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
      return;
    }
    
    // Create and load the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, {
      'anonymize_ip': true, // GDPR compliance: anonymize IP addresses
      'cookie_flags': 'SameSite=None;Secure'
    });
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    // Use event delegation for dynamic elements
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Banner actions
      if (target.id === 'cookie-accept-all' || target.closest('#cookie-accept-all')) {
        e.preventDefault();
        acceptAll();
      } else if (target.id === 'cookie-reject-all' || target.closest('#cookie-reject-all')) {
        e.preventDefault();
        rejectAll();
      } else if (target.id === 'cookie-customize' || target.closest('#cookie-customize')) {
        e.preventDefault();
        hideBanner();
        showModal();
      }
      
      // Modal actions
      else if (target.id === 'cookie-accept-all-modal' || target.closest('#cookie-accept-all-modal')) {
        e.preventDefault();
        acceptAll();
      } else if (target.id === 'cookie-save-preferences' || target.closest('#cookie-save-preferences')) {
        e.preventDefault();
        savePreferences();
      } else if (target.classList.contains('cookie-modal-close') || target.closest('.cookie-modal-close')) {
        e.preventDefault();
        hideModal();
        showCookieSettingsButton();
      } else if (target.classList.contains('cookie-modal-overlay')) {
        hideModal();
        showCookieSettingsButton();
      }
      
      // Cookie settings button
      else if (target.id === 'cookie-settings-button' || target.closest('#cookie-settings-button')) {
        e.preventDefault();
        hideCookieSettingsButton();
        showModal();
      }
    });
  }

  /**
   * Handle Escape key press for accessibility
   */
  function handleEscapeKey(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const modal = document.getElementById('cookie-modal');
      const banner = document.getElementById('cookie-consent-banner');
      
      if (modal) {
        hideModal();
        showCookieSettingsButton();
      } else if (banner) {
        // Don't allow dismissing banner without making a choice
        // Just focus on the first button
        const firstButton = banner.querySelector('button');
        if (firstButton) firstButton.focus();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose consent state for debugging (only in development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.cookieConsent = {
      getState: () => consentState,
      reset: () => {
        localStorage.removeItem(CONSENT_KEY);
        location.reload();
      }
    };
  }
})();
