/**
 * Authentication Module for Hotel 3 Paardekens Admin Panel
 * Manages login/logout and session state using sessionStorage
 */

(function() {
  'use strict';

  const ADMIN_EMAIL = 'rev.management@groupdaedalus.be';
  const SESSION_KEY = 'hotel3p_admin_session';

  // NOTE: This is a hardcoded credential as specified in the requirements.
  // In a production environment, this should be replaced with proper
  // server-side authentication with secure password hashing.

  // Authentication API
  window.HotelAuth = {
    /**
     * Check if user is currently authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (!session) return false;
      
      try {
        const data = JSON.parse(session);
        return data.authenticated === true && data.email === ADMIN_EMAIL;
      } catch (e) {
        return false;
      }
    },

    /**
     * Attempt to login with provided email
     * @param {string} email - Email address to authenticate
     * @returns {boolean} - True if login successful
     */
    login(email) {
      if (!email) return false;
      
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedAdmin = ADMIN_EMAIL.toLowerCase();
      
      if (normalizedEmail === normalizedAdmin) {
        const session = {
          authenticated: true,
          email: ADMIN_EMAIL,
          timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return true;
      }
      
      return false;
    },

    /**
     * Logout current user
     */
    logout() {
      sessionStorage.removeItem(SESSION_KEY);
    },

    /**
     * Get current session info
     * @returns {object|null}
     */
    getSession() {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (!session) return null;
      
      try {
        return JSON.parse(session);
      } catch (e) {
        return null;
      }
    },

    /**
     * Protect a page - redirect to login if not authenticated
     * Call this at the start of admin pages
     */
    requireAuth() {
      if (!this.isAuthenticated()) {
        // Store intended destination
        sessionStorage.setItem('hotel3p_redirect', window.location.pathname);
        window.location.href = 'hoteladmin.html';
      }
    },

    /**
     * Redirect to admin dashboard if already authenticated
     * Call this on login page
     */
    redirectIfAuthenticated() {
      if (this.isAuthenticated()) {
        const redirect = sessionStorage.getItem('hotel3p_redirect');
        sessionStorage.removeItem('hotel3p_redirect');
        window.location.href = redirect || 'hoteladmin.html';
      }
    }
  };
})();
