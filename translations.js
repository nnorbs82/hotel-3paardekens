/**
 * Internationalization (i18n) Module for Hotel 3 Paardekens
 * Supports Dutch (nl), English (en), and French (fr)
 */

(function() {
  'use strict';

  // Language codes and their display names
  const LANGUAGES = {
    nl: { name: 'Nederlands', flag: '🇧🇪' },
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' }
  };

  const DEFAULT_LANGUAGE = 'en';
  const STORAGE_KEY = 'hotel3p_language';

  // Translation strings
  const translations = {
    // Navigation
    'nav.aboutus': {
      nl: 'Over Ons',
      en: 'About Us',
      fr: 'À Propos'
    },
    'nav.contact': {
      nl: 'Contact',
      en: 'Contact',
      fr: 'Contact'
    },
    'nav.rooms': {
      nl: 'Kamers',
      en: 'Rooms',
      fr: 'Chambres'
    },
    'nav.info': {
      nl: 'Info',
      en: 'Info',
      fr: 'Info'
    },

    // Index page
    'index.hero.title': {
      nl: 'Welkom bij Hotel 3 Paardekens',
      en: 'Welcome to Hotel 3 Paardekens',
      fr: 'Bienvenue à l\'Hôtel 3 Paardekens'
    },
    'index.hero.subtitle': {
      nl: 'Uw historisch hotel in het hart van Mechelen',
      en: 'Your historic hotel in the heart of Mechelen',
      fr: 'Votre hôtel historique au cœur de Malines'
    },
    'index.aboutus.title': {
      nl: 'Over Ons',
      en: 'About Us',
      fr: 'À Propos de Nous'
    },
    'index.contact.title': {
      nl: 'Contact & Reserveren',
      en: 'Contact & Booking',
      fr: 'Contact & Réservation'
    },
    'index.contact.phone': {
      nl: 'Telefoon',
      en: 'Phone',
      fr: 'Téléphone'
    },
    'index.contact.email': {
      nl: 'E-mail',
      en: 'Email',
      fr: 'E-mail'
    },
    'index.contact.address': {
      nl: 'Adres',
      en: 'Address',
      fr: 'Adresse'
    },
    'index.contact.book': {
      nl: 'Boek Nu',
      en: 'Book Now',
      fr: 'Réserver Maintenant'
    },
    'index.sister.kicker': {
      nl: 'Elegantie - Comfort - Design',
      en: 'Elegance - Comfort - Design',
      fr: 'Élégance - Confort - Design'
    },
    'index.sister.title1': {
      nl: 'Ontdek Ons',
      en: 'Discover Our',
      fr: 'Découvrez Notre'
    },
    'index.sister.title2': {
      nl: 'Zusterhotel',
      en: 'Sister Property',
      fr: 'Hôtel Partenaire'
    },

    // Rooms page
    'rooms.title': {
      nl: 'Kamers',
      en: 'Rooms',
      fr: 'Chambres'
    },
    'rooms.subtitle': {
      nl: 'Ontdek onze kamertypes en controleer beschikbaarheid',
      en: 'Explore our room types and check availability',
      fr: 'Découvrez nos types de chambres et vérifiez les disponibilités'
    },
    'rooms.amenities': {
      nl: 'Voorzieningen:',
      en: 'Amenities include:',
      fr: 'Les équipements comprennent :'
    },
    'rooms.viewroom': {
      nl: 'Bekijk Kamer',
      en: 'View Room',
      fr: 'Voir la Chambre'
    },
    'rooms.norooms': {
      nl: 'Geen kamers beschikbaar op dit moment.',
      en: 'No rooms available at the moment.',
      fr: 'Aucune chambre disponible pour le moment.'
    },
    'rooms.prev': {
      nl: 'Vorige foto',
      en: 'Previous photo',
      fr: 'Photo précédente'
    },
    'rooms.next': {
      nl: 'Volgende foto',
      en: 'Next photo',
      fr: 'Photo suivante'
    },
    'rooms.goto': {
      nl: 'Ga naar foto',
      en: 'Go to photo',
      fr: 'Aller à la photo'
    },
    'rooms.close': {
      nl: 'Sluiten',
      en: 'Close',
      fr: 'Fermer'
    },

    // Info page
    'info.title': {
      nl: 'Informatie',
      en: 'Information',
      fr: 'Informations'
    },
    'info.noinfo': {
      nl: 'Geen informatie beschikbaar op dit moment.',
      en: 'No information available at the moment.',
      fr: 'Aucune information disponible pour le moment.'
    },

    // Admin login
    'admin.login.title': {
      nl: 'Admin Login',
      en: 'Admin Login',
      fr: 'Connexion Admin'
    },
    'admin.login.subtitle': {
      nl: 'Meld u aan om Hotel 3 Paardekens te beheren',
      en: 'Sign in to manage Hotel 3 Paardekens',
      fr: 'Connectez-vous pour gérer l\'Hôtel 3 Paardekens'
    },
    'admin.login.email': {
      nl: 'E-mailadres',
      en: 'Email Address',
      fr: 'Adresse E-mail'
    },
    'admin.login.password': {
      nl: 'Wachtwoord',
      en: 'Password',
      fr: 'Mot de Passe'
    },
    'admin.login.forgot': {
      nl: 'Wachtwoord vergeten?',
      en: 'Forgot your password?',
      fr: 'Mot de passe oublié ?'
    },
    'admin.login.signin': {
      nl: 'Aanmelden',
      en: 'Sign In',
      fr: 'Se Connecter'
    },
    'admin.login.invalid': {
      nl: 'Ongeldige inloggegevens',
      en: 'Invalid credentials',
      fr: 'Identifiants invalides'
    },

    // Admin navigation
    'admin.nav.menu': {
      nl: '☰ Menu',
      en: '☰ Menu',
      fr: '☰ Menu'
    },
    'admin.nav.rooms': {
      nl: '🏨 Kamers',
      en: '🏨 Rooms',
      fr: '🏨 Chambres'
    },
    'admin.nav.info': {
      nl: 'ℹ️ Info',
      en: 'ℹ️ Info',
      fr: 'ℹ️ Info'
    },
    'admin.nav.aboutus': {
      nl: '✨ Over Ons',
      en: '✨ About Us',
      fr: '✨ À Propos'
    },
    'admin.nav.sister': {
      nl: '🏛️ Zusterhotel',
      en: '🏛️ Sister Hotel',
      fr: '🏛️ Hôtel Partenaire'
    },
    'admin.nav.logout': {
      nl: '👋 Uitloggen',
      en: '👋 Logout',
      fr: '👋 Déconnexion'
    },

    // Admin buttons
    'admin.btn.save': {
      nl: 'Opslaan',
      en: 'Save',
      fr: 'Enregistrer'
    },
    'admin.btn.cancel': {
      nl: 'Annuleren',
      en: 'Cancel',
      fr: 'Annuler'
    },
    'admin.btn.delete': {
      nl: 'Verwijderen',
      en: 'Delete',
      fr: 'Supprimer'
    },
    'admin.btn.add': {
      nl: 'Toevoegen',
      en: 'Add',
      fr: 'Ajouter'
    },
    'admin.btn.edit': {
      nl: 'Bewerken',
      en: 'Edit',
      fr: 'Modifier'
    },

    // Admin rooms
    'admin.rooms.title': {
      nl: 'Kamerbeheer',
      en: 'Room Management',
      fr: 'Gestion des Chambres'
    },
    'admin.rooms.addroom': {
      nl: '➕ Kamer Toevoegen',
      en: '➕ Add Room',
      fr: '➕ Ajouter une Chambre'
    },
    'admin.rooms.norooms': {
      nl: 'Nog geen kamers',
      en: 'No Rooms Yet',
      fr: 'Aucune Chambre Pour le Moment'
    },
    'admin.rooms.name': {
      nl: 'Kamernaam',
      en: 'Room Name',
      fr: 'Nom de la Chambre'
    },
    'admin.rooms.description': {
      nl: 'Beschrijving',
      en: 'Description',
      fr: 'Description'
    },
    'admin.rooms.bookingurl': {
      nl: 'Boekings-URL',
      en: 'Booking URL',
      fr: 'URL de Réservation'
    },
    'admin.rooms.amenities': {
      nl: 'Voorzieningen',
      en: 'Amenities',
      fr: 'Équipements'
    },
    'admin.rooms.photos': {
      nl: 'Foto\'s',
      en: 'Photos',
      fr: 'Photos'
    },
    'admin.rooms.addamenity': {
      nl: 'Voorziening Toevoegen',
      en: 'Add Amenity',
      fr: 'Ajouter un Équipement'
    },

    // Admin info blocks
    'admin.info.title': {
      nl: 'Infoblokken Beheer',
      en: 'Info Blocks Management',
      fr: 'Gestion des Blocs d\'Information'
    },
    'admin.info.addblock': {
      nl: '➕ Infoblok Toevoegen',
      en: '➕ Add Info Block',
      fr: '➕ Ajouter un Bloc d\'Information'
    },
    'admin.info.noinfo': {
      nl: 'Nog geen infoblokken',
      en: 'No Info Blocks Yet',
      fr: 'Aucun Bloc d\'Information Pour le Moment'
    },
    'admin.info.blocktitle': {
      nl: 'Bloktitel',
      en: 'Block Title',
      fr: 'Titre du Bloc'
    },
    'admin.info.content': {
      nl: 'Inhoud',
      en: 'Content',
      fr: 'Contenu'
    },

    // Admin about us
    'admin.about.title': {
      nl: 'Over Ons Beheer',
      en: 'About Us Management',
      fr: 'Gestion de À Propos'
    },
    'admin.about.sectiontitle': {
      nl: 'Sectietitel',
      en: 'Section Title',
      fr: 'Titre de la Section'
    },
    'admin.about.body': {
      nl: 'Inhoud',
      en: 'Body',
      fr: 'Contenu'
    },

    // Admin sister hotel
    'admin.sister.title': {
      nl: 'Zusterhotel Beheer',
      en: 'Sister Hotel Management',
      fr: 'Gestion de l\'Hôtel Partenaire'
    },
    'admin.sister.kicker': {
      nl: 'Kicker',
      en: 'Kicker',
      fr: 'Sous-titre'
    },
    'admin.sister.titleline1': {
      nl: 'Titel Regel 1',
      en: 'Title Line 1',
      fr: 'Ligne de Titre 1'
    },
    'admin.sister.titleline2': {
      nl: 'Titel Regel 2',
      en: 'Title Line 2',
      fr: 'Ligne de Titre 2'
    },

    // Common amenities
    'amenity.single-bed': {
      nl: 'Eenpersoonsbed',
      en: 'Single bed',
      fr: 'Lit simple'
    },
    'amenity.double-bed': {
      nl: 'Tweepersoonsbed',
      en: 'Double bed',
      fr: 'Lit double'
    },
    'amenity.twin-beds': {
      nl: 'Twee eenpersoonsbedden',
      en: 'Twin beds',
      fr: 'Lits jumeaux'
    },
    'amenity.tv': {
      nl: 'TV',
      en: 'TV',
      fr: 'TV'
    },
    'amenity.private-bathroom': {
      nl: 'Privé badkamer',
      en: 'Private bathroom',
      fr: 'Salle de bain privée'
    },
    'amenity.city-view': {
      nl: 'Uitzicht op de stad',
      en: 'City view',
      fr: 'Vue sur la ville'
    },
    'amenity.coffee-tea': {
      nl: 'Koffie-/theefaciliteiten',
      en: 'Coffee/tea maker',
      fr: 'Cafetière/théière'
    },
    'amenity.heating': {
      nl: 'Verwarming',
      en: 'Heating',
      fr: 'Chauffage'
    },
    'amenity.wardrobe': {
      nl: 'Kledingkast',
      en: 'Wardrobe',
      fr: 'Armoire'
    },
    'amenity.wifi': {
      nl: 'WiFi',
      en: 'WiFi',
      fr: 'WiFi'
    },
    'amenity.air-conditioning': {
      nl: 'Airconditioning',
      en: 'Air conditioning',
      fr: 'Climatisation'
    },
    'amenity.desk': {
      nl: 'Bureau',
      en: 'Desk',
      fr: 'Bureau'
    },
    'amenity.safe': {
      nl: 'Kluis',
      en: 'Safe',
      fr: 'Coffre-fort'
    },
    'amenity.minibar': {
      nl: 'Minibar',
      en: 'Minibar',
      fr: 'Minibar'
    },

    // Language selector
    'language.select': {
      nl: 'Selecteer taal',
      en: 'Select language',
      fr: 'Sélectionner la langue'
    }
  };

  // Current language
  let currentLanguage = DEFAULT_LANGUAGE;

  // Initialize i18n
  function init() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      currentLanguage = savedLanguage;
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;

    // Translate all elements with data-i18n attribute
    translatePage();

    return currentLanguage;
  }

  // Get translation for a key
  function t(key, lang) {
    const language = lang || currentLanguage;
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    return translation[language] || translation[DEFAULT_LANGUAGE] || key;
  }

  // Translate all elements on the page
  function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const text = t(key);
      
      // Update text content or placeholder based on element type
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.placeholder !== undefined) {
          element.placeholder = text;
        }
      } else {
        element.textContent = text;
      }
    });
  }

  // Change language
  function changeLanguage(lang) {
    if (!LANGUAGES[lang]) {
      console.warn(`Invalid language code: ${lang}`);
      return;
    }

    currentLanguage = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    
    // Translate the page
    translatePage();

    // Trigger custom event for other modules to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  // Get current language
  function getCurrentLanguage() {
    return currentLanguage;
  }

  // Get all available languages
  function getLanguages() {
    return LANGUAGES;
  }

  // Export i18n object to global scope
  window.i18n = {
    init,
    t,
    translatePage,
    changeLanguage,
    getCurrentLanguage,
    getLanguages,
    LANGUAGES,
    DEFAULT_LANGUAGE
  };

})();
