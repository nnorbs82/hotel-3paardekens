/**
 * Site Content Manager Module for Hotel 3 Paardekens
 * Handles About Us and Sister Hotel content using Firebase Realtime Database
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_site_content';
  const FIREBASE_PATH = 'siteContent';

  const DEFAULT_CONTENT = {
    about: {
      title: 'About Us',
      body: [
        "The 33 rooms of the charming Hotel 3 Paardekens were thoroughly renovated and refurbished in 2010. In other words: a 'historical renovation'! Everything is there to welcome you with the comfort of a 3-star hotel. The counter in the reception area exudes the grandeur of the past. You can sit and chat at the bar or relax in one of the cozy armchairs.",
        "The pride and uniqueness of Hotel 3 Paardekens, however, is the sublime glass-enclosed breakfast room on the top floor, with an absolutely impressive view on St Rumbold's Cathedral."
      ].join('\n\n')
    },
    sister: {
      kicker: 'Elegance - Comfort - Design',
      titleLine1: 'Discover Our',
      titleLine2: 'Sister Property',
      body: [
        'Hotel Elisabeth is a former Hospital dating from the Inter-war Period. It has been respectively transformed in keeping with the existing architecture to a modern and cosy four-star Hotel.',
        'It is situated less than 200m walking distance from the heart of Mechelen city and offers 66 stylish and contemporary designed rooms.',
        'These rooms provide maximum comfort for guests traveling on business or those wishing to explore the unique Historical City.',
        'The Breakfast Room is beautifully light and overlooks a lovely courtyard with olive trees. Parking is located beneath the Hotel.'
      ].join('\n\n')
    }
  };

  function getDatabase() {
    if (typeof firebase === 'undefined' || !firebase.database) {
      console.warn('Firebase not available, using localStorage fallback');
      return null;
    }

    if (!firebase.apps || firebase.apps.length === 0) {
      console.warn('Firebase app not initialized, using localStorage fallback');
      return null;
    }

    try {
      const db = firebase.database();
      if (!db) {
        console.warn('Firebase database not accessible, using localStorage fallback');
        return null;
      }
      return db;
    } catch (error) {
      console.error('Error accessing Firebase database:', error);
      return null;
    }
  }

  function normalizeContent(content) {
    const safeContent = content && typeof content === 'object' ? content : {};
    const about = safeContent.about && typeof safeContent.about === 'object' ? safeContent.about : {};
    const sister = safeContent.sister && typeof safeContent.sister === 'object' ? safeContent.sister : {};

    return {
      about: {
        title: typeof about.title === 'string' && about.title.trim() ? about.title : DEFAULT_CONTENT.about.title,
        body: typeof about.body === 'string' && about.body.trim() ? about.body : DEFAULT_CONTENT.about.body
      },
      sister: {
        kicker: typeof sister.kicker === 'string' && sister.kicker.trim() ? sister.kicker : DEFAULT_CONTENT.sister.kicker,
        titleLine1: typeof sister.titleLine1 === 'string' && sister.titleLine1.trim() ? sister.titleLine1 : DEFAULT_CONTENT.sister.titleLine1,
        titleLine2: typeof sister.titleLine2 === 'string' && sister.titleLine2.trim() ? sister.titleLine2 : DEFAULT_CONTENT.sister.titleLine2,
        body: typeof sister.body === 'string' && sister.body.trim() ? sister.body : DEFAULT_CONTENT.sister.body
      }
    };
  }

  async function fetchSnapshot(ref) {
    if (typeof ref.get === 'function') {
      return ref.get();
    }
    return ref.once('value');
  }

  async function getContent() {
    const db = getDatabase();

    if (!db) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return normalizeContent(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing stored site content:', error);
        }
      }
      return normalizeContent(null);
    }

    try {
      const snapshot = await fetchSnapshot(db.ref(FIREBASE_PATH));
      const data = snapshot.val();
      if (!data) {
        return normalizeContent(null);
      }
      return normalizeContent(data);
    } catch (error) {
      console.error('Error fetching site content from Firebase:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return normalizeContent(JSON.parse(stored));
        } catch (lsError) {
          console.error('Error parsing localStorage data:', lsError);
        }
      }
      return normalizeContent(null);
    }
  }

  async function saveContent(content) {
    const normalized = normalizeContent(content);
    const db = getDatabase();

    if (!db) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return true;
      } catch (error) {
        console.error('Error saving site content to localStorage:', error);
        return false;
      }
    }

    try {
      await db.ref(FIREBASE_PATH).set(normalized);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (lsError) {
        console.warn('Could not save site content to localStorage backup:', lsError);
      }
      return true;
    } catch (error) {
      console.error('Error saving site content to Firebase:', error);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return true;
      } catch (lsError) {
        console.error('Failed to save site content to localStorage fallback:', lsError);
        return false;
      }
    }
  }

  async function updateContent(section, updates) {
    if (!section) return false;
    const current = await getContent();
    const next = {
      ...current,
      [section]: {
        ...current[section],
        ...(updates || {})
      }
    };
    return saveContent(next);
  }

  window.SiteContentManager = {
    getContent,
    saveContent,
    updateContent,
    defaults: DEFAULT_CONTENT
  };
})();
