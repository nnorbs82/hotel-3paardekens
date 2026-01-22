/**
 * Authentication Module for Hotel 3 Paardekens Admin Panel
 * Manages login/logout and session state using sessionStorage
 */

(function() {
  'use strict';

  const ADMIN_EMAIL = 'rev.management@groupdaedalus.be';
  const ADMIN_PASSWORD = 'Hotel3Paardekens2024!'; // Hardcoded password for demo
  const SESSION_KEY = 'hotel3p_admin_session';
  
  // EmailJS Configuration
  // These should match the Service ID and Template ID in your EmailJS dashboard
  const EMAILJS_SERVICE_ID = 'service_iu8cxtm';  // EmailJS service ID
  const EMAILJS_TEMPLATE_ID = 'template_2oxmlh8';  // EmailJS template ID for password reset
  
  // Password reminder email message
  const PASSWORD_REMINDER_MESSAGE = 'You requested a password reminder for the Hotel 3 Paardekens Admin Panel. Your login credentials are shown below - use the password to log in.';

  // NOTE: This is a hardcoded credential as specified in the requirements.
  // In a production environment, this should be replaced with proper
  // server-side authentication with secure password hashing.

  // Authentication API
  window.HotelAuth = {
    // Expose EmailJS configuration for reference
    config: {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: 'MEiKFhBHfwDzT-xz1'
    },
    
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
     * Attempt to login with provided email and password
     * @param {string} email - Email address to authenticate
     * @param {string} password - Password to authenticate
     * @returns {Promise<boolean>} - Promise resolving to true if login successful
     */
    async login(email, password) {
      if (!email || !password) return false;
      
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedAdmin = ADMIN_EMAIL.toLowerCase();
      
      if (normalizedEmail === normalizedAdmin && password === ADMIN_PASSWORD) {
        // Sign in to Firebase Auth to enable database writes
        try {
          if (typeof firebase !== 'undefined' && firebase.auth) {
            console.log('Authenticating with Firebase...');
            // Use Firebase Auth with persistence enabled
            // This ensures auth state persists across page refreshes and browser sessions
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            
            // Sign in with email/password to Firebase Auth
            // This creates an authenticated context for Firebase operations
            try {
              await firebase.auth().signInWithEmailAndPassword(email, password);
              console.log('✓ Firebase authentication successful with email/password');
            } catch (authError) {
              // If user doesn't exist in Firebase Auth, create them
              if (authError.code === 'auth/user-not-found') {
                console.log('Creating Firebase Auth user...');
                try {
                  await firebase.auth().createUserWithEmailAndPassword(email, password);
                  console.log('✓ Firebase Auth user created and signed in');
                } catch (createError) {
                  console.warn('Could not create Firebase Auth user:', createError);
                  throw createError; // Don't fall back to anonymous auth - fail explicitly
                }
              } else {
                throw authError;
              }
            }
          }
        } catch (firebaseError) {
          console.warn('Firebase authentication failed, continuing with local auth only:', firebaseError);
          // Continue with sessionStorage auth even if Firebase auth fails
        }
        
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
    async logout() {
      // Sign out from Firebase Auth
      try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
          await firebase.auth().signOut();
          console.log('✓ Signed out from Firebase');
        }
      } catch (error) {
        console.warn('Error signing out from Firebase:', error);
      }
      
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
    },

    /**
     * Request password reset
     * @param {string} email - Email address to send reset link to
     * @returns {Promise<object>} - Promise resolving to object with success status and optional error message
     * 
     * EmailJS Variable Replacement:
     * ==============================
     * When EmailJS sends the email, it automatically replaces template variables with the values
     * provided in templateParams. The variables use double curly brace syntax: {{variable_name}}
     * 
     * Available variables for the email template (configured in EmailJS dashboard):
     * - {{email}} - The recipient's email address (standardized variable name)
     * - {{link}} - The password reset/login link (standardized variable name)
     * - {{to_name}} - Name of the recipient (Admin)
     * - {{admin_email}} - Admin email for reference in email body
     * - {{admin_password}} - Admin password (demo only - NOT for production)
     * - {{message}} - Custom message text
     * 
     * Example template usage in EmailJS dashboard:
     * --------------------------------------------
     * Subject: Password Reset - Hotel 3 Paardekens
     * 
     * Body:
     *   Hello {{to_name}},
     *   
     *   {{message}}
     *   
     *   Click the button below to access the admin panel:
     *   <a href="{{link}}" style="...">Access Admin Panel</a>
     *   
     *   Your email: {{email}}
     *   Your credentials are included below for reference.
     *   
     *   Email: {{admin_email}}
     *   Password: {{admin_password}}
     */
    async requestPasswordReset(email) {
      if (!email) {
        return { success: false, error: 'email_required' };
      }
      
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedAdmin = ADMIN_EMAIL.toLowerCase();
      
      // Check if email matches the admin email
      if (normalizedEmail !== normalizedAdmin) {
        return { success: false, error: 'email_not_found' };
      }
      
      // Check if EmailJS is loaded
      if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded. Password reset email cannot be sent.');
        return { success: false, error: 'emailjs_not_loaded' };
      }
      
      // Send password reset email using EmailJS
      // This uses EmailJS service to send emails from client-side
      // The template should be configured in EmailJS dashboard
      try {
        // Since this is a demo app with hardcoded credentials,
        // we'll send the password directly in the email
        // In a production environment, you would send a secure token instead
        
        // Prepare template parameters for EmailJS
        // The EmailJS service uses the public key initialized in hoteladmin.html
        // Each key-value pair below will replace {{key}} in the email template
        const resetUrl = window.location.origin + '/hoteladmin.html';
        const templateParams = {
          // Standardized variable names (recommended for all templates)
          email: email,                                        // Maps to {{email}} in template
          link: resetUrl,                                      // Maps to {{link}} in template
          
          // Legacy/additional variables (for backward compatibility)
          to_email: email,                                    // Maps to {{to_email}} in template
          to_name: 'Admin',                                   // Maps to {{to_name}} in template
          admin_email: ADMIN_EMAIL,                           // Maps to {{admin_email}} in template
          admin_password: ADMIN_PASSWORD,                     // Maps to {{admin_password}} in template
          reset_link: resetUrl,                               // Maps to {{reset_link}} in template (legacy)
          message: PASSWORD_REMINDER_MESSAGE                  // Maps to {{message}} in template
        };
        
        console.log('Sending password reset email with params:', {
          serviceId: EMAILJS_SERVICE_ID,
          templateId: EMAILJS_TEMPLATE_ID,
          to_email: email
        });
        
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );
        
        console.log('Password reset email sent successfully', response);
        
        // Validate response to ensure email was actually sent
        if (!response || response.status !== 200) {
          console.error('EmailJS returned non-200 status:', response);
          return { 
            success: false, 
            error: 'send_failed',
            details: 'EmailJS service returned an error status. Check template configuration.'
          };
        }
        
        return { success: true };
      } catch (error) {
        console.error('Error sending password reset email:', error);
        console.error('Error details:', {
          message: error.message,
          text: error.text,
          status: error.status
        });
        
        // Provide more specific error messages based on the error
        // Note: EmailJS doesn't provide specific error codes in public API,
        // so we use string matching on error.text as a best-effort approach
        let errorMessage = 'send_failed';
        if (error.text && error.text.includes('template')) {
          errorMessage = 'template_error';
          console.error('TEMPLATE ERROR: Check that template ID "template_2oxmlh8" exists and is configured correctly in EmailJS dashboard');
          console.error('Required template settings in EmailJS dashboard:');
          console.error('  - To Email field must be set to: {{to_email}} or {{email}}');
          console.error('  - Template must include variables: {{to_name}}, {{message}}, {{link}}, {{email}}, {{admin_password}}');
        } else if (error.text && error.text.includes('service')) {
          errorMessage = 'service_error';
          console.error('SERVICE ERROR: Check that service ID "service_iu8cxtm" exists and is enabled in EmailJS dashboard');
        }
        
        return { success: false, error: errorMessage, details: error };
      }
    },

    /**
     * Initialize Firebase Auth persistence
     * Call this when the page loads to restore Firebase authentication
     * @returns {Promise<void>}
     */
    async initializeFirebaseAuth() {
      try {
        if (typeof firebase !== 'undefined' && firebase.auth) {
          // Set persistence to LOCAL (survives browser restarts)
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
          
          // Wait for auth state to be determined
          const user = await new Promise((resolve) => {
            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
              unsubscribe();
              resolve(user);
            });
          });
          
          // Log the auth state for debugging
          if (user) {
            console.log('✓ Firebase Auth: User already authenticated');
          } else if (this.isAuthenticated()) {
            console.log('⚠ Session exists but Firebase Auth is not authenticated');
            console.log('User will need to log in again to restore Firebase Auth');
          }
        }
      } catch (error) {
        console.warn('Could not initialize Firebase authentication:', error);
      }
    },

    /**
     * Setup auth state listener for debugging
     * @private
     */
    _setupAuthStateListener() {
      if (typeof firebase !== 'undefined' && firebase.auth) {
        // Note: This listener is set up once and persists for the session
        // It's useful for debugging auth state changes
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('✓ Firebase Auth: User authenticated:', user.email || user.uid);
          } else {
            console.log('Firebase Auth: No user authenticated');
          }
        });
      }
    }
  };

  // Setup auth state listener when the module loads
  window.HotelAuth._setupAuthStateListener();
})();
