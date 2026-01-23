/**
 * Site Content Manager Module for Hotel 3 Paardekens
 * Handles About Us and Sister Hotel content using Firebase Realtime Database
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_site_content';
  const FIREBASE_PATH = 'siteContent';

  const DEFAULT_CONTENT = {
    en: {
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
    },
    nl: {
      about: {
        title: 'Over Ons',
        body: [
          "De 33 kamers van het charmante Hotel 3 Paardekens werden in 2010 grondig gerenoveerd en heringericht. Met andere woorden: een 'historische renovatie'! Alles is aanwezig om u te verwelkomen met het comfort van een 3-sterrenhotel. De toonbank in de receptie straalt de grootsheid van het verleden uit. U kunt gezellig bijpraten aan de bar of ontspannen in een van de knusse fauteuils.",
          "De trots en uniciteit van Hotel 3 Paardekens is echter de sublieme glazen ontbijtzaal op de bovenste verdieping, met een absoluut indrukwekkend uitzicht op de Sint-Romboutskathedraal."
        ].join('\n\n')
      },
      sister: {
        kicker: 'Elegantie - Comfort - Design',
        titleLine1: 'Ontdek Ons',
        titleLine2: 'Zusterhotel',
        body: [
          'Hotel Elisabeth is een voormalig ziekenhuis uit het Interbellum. Het werd respectvol getransformeerd met behoud van de bestaande architectuur tot een modern en gezellig viersterrenhotel.',
          'Het ligt op minder dan 200 meter wandelafstand van het hart van de stad Mechelen en biedt 66 stijlvolle en eigentijds ontworpen kamers.',
          'Deze kamers bieden maximaal comfort voor zakelijke reizigers of voor wie de unieke historische stad wil verkennen.',
          'De ontbijtzaal is prachtig licht en kijkt uit op een mooie binnenplaats met olijfbomen. Parkeren is mogelijk onder het hotel.'
        ].join('\n\n')
      }
    },
    fr: {
      about: {
        title: 'À Propos de Nous',
        body: [
          "Les 33 chambres du charmant Hôtel 3 Paardekens ont été entièrement rénovées et réaménagées en 2010. En d'autres termes : une 'rénovation historique' ! Tout est là pour vous accueillir avec le confort d'un hôtel 3 étoiles. Le comptoir de la réception respire la grandeur du passé. Vous pouvez vous asseoir et discuter au bar ou vous détendre dans l'un des fauteuils confortables.",
          "La fierté et l'unicité de l'Hôtel 3 Paardekens, cependant, c'est la sublime salle de petit-déjeuner vitrée au dernier étage, avec une vue absolument impressionnante sur la cathédrale Saint-Rombaut."
        ].join('\n\n')
      },
      sister: {
        kicker: 'Élégance - Confort - Design',
        titleLine1: 'Découvrez Notre',
        titleLine2: 'Hôtel Partenaire',
        body: [
          "L'Hôtel Elisabeth est un ancien hôpital datant de l'entre-deux-guerres. Il a été transformé respectueusement en conservant l'architecture existante en un hôtel quatre étoiles moderne et confortable.",
          "Il est situé à moins de 200 mètres à pied du cœur de la ville de Malines et propose 66 chambres élégantes et au design contemporain.",
          "Ces chambres offrent un maximum de confort aux voyageurs d'affaires ou à ceux qui souhaitent explorer la ville historique unique.",
          "La salle de petit-déjeuner est magnifiquement lumineuse et donne sur une belle cour avec des oliviers. Le parking est situé sous l'hôtel."
        ].join('\n\n')
      }
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

  function normalizeContent(content, lang = 'en') {
    const safeContent = content && typeof content === 'object' ? content : {};
    
    // Check if content is in new multilingual format or old format
    const isMultilingual = safeContent.en || safeContent.nl || safeContent.fr;
    
    let langContent;
    if (isMultilingual) {
      // New format: content is already structured by language
      langContent = safeContent[lang] || safeContent.en || {};
    } else {
      // Old format: content is directly in the object (backward compatibility)
      langContent = safeContent;
    }
    
    const about = langContent.about && typeof langContent.about === 'object' ? langContent.about : {};
    const sister = langContent.sister && typeof langContent.sister === 'object' ? langContent.sister : {};
    
    const defaultForLang = DEFAULT_CONTENT[lang] || DEFAULT_CONTENT.en;

    return {
      about: {
        title: typeof about.title === 'string' && about.title.trim() ? about.title : defaultForLang.about.title,
        body: typeof about.body === 'string' && about.body.trim() ? about.body : defaultForLang.about.body
      },
      sister: {
        kicker: typeof sister.kicker === 'string' && sister.kicker.trim() ? sister.kicker : defaultForLang.sister.kicker,
        titleLine1: typeof sister.titleLine1 === 'string' && sister.titleLine1.trim() ? sister.titleLine1 : defaultForLang.sister.titleLine1,
        titleLine2: typeof sister.titleLine2 === 'string' && sister.titleLine2.trim() ? sister.titleLine2 : defaultForLang.sister.titleLine2,
        body: typeof sister.body === 'string' && sister.body.trim() ? sister.body : defaultForLang.sister.body
      }
    };
  }

  async function fetchSnapshot(ref) {
    if (typeof ref.get === 'function') {
      return ref.get();
    }
    return ref.once('value');
  }

  async function getContent(lang) {
    // Get current language if not specified
    if (!lang && window.i18n) {
      lang = window.i18n.getCurrentLanguage();
    }
    lang = lang || 'en';
    
    const db = getDatabase();

    if (!db) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return normalizeContent(JSON.parse(stored), lang);
        } catch (error) {
          console.error('Error parsing stored site content:', error);
        }
      }
      return normalizeContent(null, lang);
    }

    try {
      const snapshot = await fetchSnapshot(db.ref(FIREBASE_PATH));
      const data = snapshot.val();
      if (!data) {
        return normalizeContent(null, lang);
      }
      return normalizeContent(data, lang);
    } catch (error) {
      console.error('Error fetching site content from Firebase:', error);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return normalizeContent(JSON.parse(stored), lang);
        } catch (lsError) {
          console.error('Error parsing localStorage data:', lsError);
        }
      }
      return normalizeContent(null, lang);
    }
  }

  async function saveContent(content, lang) {
    // If lang is provided, save in multilingual format
    // If not, save as-is (for admin panel which saves all languages at once)
    const db = getDatabase();
    
    let dataToSave;
    if (lang) {
      // Save specific language content
      const existing = await getAllContent();
      dataToSave = {
        ...existing,
        [lang]: normalizeContent(content, lang)
      };
    } else {
      // Save all content (should be in multilingual format already)
      dataToSave = content;
    }

    if (!db) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        return true;
      } catch (error) {
        console.error('Error saving site content to localStorage:', error);
        return false;
      }
    }

    try {
      await db.ref(FIREBASE_PATH).set(dataToSave);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (lsError) {
        console.warn('Could not save site content to localStorage backup:', lsError);
      }
      return true;
    } catch (error) {
      console.error('Error saving site content to Firebase:', error);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        return true;
      } catch (lsError) {
        console.error('Failed to save site content to localStorage fallback:', lsError);
        return false;
      }
    }
  }

  async function getAllContent() {
    const db = getDatabase();

    if (!db) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored site content:', error);
        }
      }
      return DEFAULT_CONTENT;
    }

    try {
      const snapshot = await fetchSnapshot(db.ref(FIREBASE_PATH));
      const data = snapshot.val();
      if (!data) {
        // Check localStorage as fallback when Firebase has no data
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (lsError) {
            console.error('Error parsing localStorage data:', lsError);
          }
        }
        return DEFAULT_CONTENT;
      }
      return data;
    } catch (error) {
      console.error('Error fetching site content from Firebase:', error);
      // Check localStorage as fallback on Firebase error
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (lsError) {
          console.error('Error parsing localStorage fallback data:', lsError);
        }
      }
      return DEFAULT_CONTENT;
    }
  }

  async function updateContent(section, updates, lang) {
    if (!section) return false;
    lang = lang || (window.i18n ? window.i18n.getCurrentLanguage() : 'en');
    const current = await getContent(lang);
    const next = {
      ...current,
      [section]: {
        ...current[section],
        ...(updates || {})
      }
    };
    return saveContent(next, lang);
  }

  window.SiteContentManager = {
    getContent,
    getAllContent,
    saveContent,
    updateContent,
    defaults: DEFAULT_CONTENT
  };
})();
