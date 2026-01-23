# Multilingual Implementation Guide

## Overview

The Hotel 3 Paardekens website now supports three languages:
- **Dutch (Nederlands)** 🇧🇪 - Belgian flag
- **English** 🇬🇧 - UK flag  
- **French (Français)** 🇫🇷 - French flag

## What Has Been Implemented

### ✅ Complete Features

1. **Language Selector in Navigation**
   - Dropdown menu with flag icons in the top navigation bar
   - Persists language choice in localStorage
   - Available on all public pages (index.html, rooms.html, info.html)

2. **Static UI Translation**
   - All navigation menu items (About Us, Contact, Rooms, Info)
   - Booking section (Check-in, Check-out, Book a Room)
   - Contact section labels and buttons
   - Page titles and subtitles

3. **Dynamic Content Translation**
   - **About Us Section**: Title and body text in all three languages
   - **Sister Hotel Section**: Kicker, title lines, and body text in all three languages
   - Content automatically updates when language is changed
   - Default translations provided in `site-content-manager.js`

4. **Translation Infrastructure**
   - `translations.js`: Complete i18n library with 100+ translation strings
   - Event-based language switching (languageChanged event)
   - Backward compatibility with existing single-language data

### 🔄 Partially Implemented

1. **Admin Panel Preparation**
   - translations.js loaded in hoteladmin.html
   - Ready for admin UI translation
   - Needs: Language tabs in content editors

2. **Room Content**
   - Static page headers translated
   - Needs: Multilingual room names, descriptions, and amenities from Firebase

3. **Info Blocks**
   - Static page headers translated
   - Needs: Multilingual info block content from Firebase

## How to Use (For Users)

### Changing Language

1. Click the flag button in the top right corner of the navigation bar
2. Select your preferred language from the dropdown:
   - 🇧🇪 Nederlands (Dutch)
   - 🇬🇧 English  
   - 🇫🇷 Français (French)
3. The page will automatically update with the selected language
4. Your choice is saved and will persist across page refreshes

## How to Manage Content (For Administrators)

### Current Approach

The multilingual content is currently stored with default translations in `site-content-manager.js`. The structure is:

```javascript
DEFAULT_CONTENT = {
  en: { about: {...}, sister: {...} },
  nl: { about: {...}, sister: {...} },
  fr: { about: {...}, sister: {...} }
}
```

### Firebase Data Structure

For multilingual support, the Firebase database should use this structure:

```
siteContent/
  en/
    about/
      title: "About Us"
      body: "..."
    sister/
      kicker: "..."
      titleLine1: "..."
      titleLine2: "..."
      body: "..."
  nl/
    about/
      title: "Over Ons"
      body: "..."
    sister/
      kicker: "..."
      titleLine1: "..."
      titleLine2: "..."
      body: "..."
  fr/
    about/
      title: "À Propos de Nous"
      body: "..."
    sister/
      kicker: "..."
      titleLine1: "..."
      titleLine2: "..."
      body: "..."
```

### Editing Content

**Via Admin Panel** (Current):
1. Log in to hoteladmin.html
2. Navigate to "About Us" or "Sister Hotel" section
3. Edit the content (currently saves to single language)

**Note**: To make the admin panel fully multilingual, you would need to add:
- Language tabs in the editor (EN | NL | FR)
- Save content for each language separately
- Load content based on selected language tab

## Technical Details

### Files Modified

1. **translations.js** (NEW)
   - Complete i18n library
   - 100+ translation strings covering all UI elements
   - Support for Dutch, English, and French

2. **assets/nav.html**
   - Added language selector dropdown with flags
   - Added data-i18n attributes to menu items

3. **assets/nav.js**
   - Added initLanguageSelector() function
   - Language change handling and flag updates

4. **assets/nav.css**
   - Styles for language selector button and dropdown
   - Responsive design for mobile

5. **index.html**
   - Added translations.js script
   - Added data-i18n attributes to static content
   - Added languageChanged event listener

6. **rooms.html**
   - Added translations.js script
   - Added data-i18n attributes to page headers

7. **info.html**
   - Added translations.js script
   - Added data-i18n attributes to page headers

8. **site-content-manager.js**
   - Extended DEFAULT_CONTENT with Dutch and French
   - Updated normalizeContent() to handle multilingual structure
   - Updated getContent() to accept language parameter
   - Added getAllContent() for retrieving all languages
   - Updated saveContent() to support multilingual saves
   - Backward compatible with existing single-language data

9. **hoteladmin.html**
   - Added translations.js script
   - Ready for admin UI translation

### Translation Keys

All translation keys follow the pattern: `section.element`

Examples:
- `nav.aboutus` → "About Us" / "Over Ons" / "À Propos"
- `index.booking.checkin` → "Check-in" / "Inchecken" / "Arrivée"
- `rooms.amenities` → "Amenities include:" / "Voorzieningen:" / "Les équipements comprennent :"

### API Reference

**i18n Object**

```javascript
// Initialize i18n
window.i18n.init();

// Get translation
window.i18n.t('nav.aboutus'); // Returns translated string

// Change language
window.i18n.changeLanguage('nl'); // Switch to Dutch

// Get current language
window.i18n.getCurrentLanguage(); // Returns 'en', 'nl', or 'fr'

// Get all available languages
window.i18n.getLanguages(); // Returns language object with flags
```

**SiteContentManager**

```javascript
// Get content for specific language
const content = await SiteContentManager.getContent('nl');

// Get all content (all languages)
const allContent = await SiteContentManager.getAllContent();

// Save content for specific language
await SiteContentManager.saveContent(content, 'nl');

// Update specific section
await SiteContentManager.updateContent('about', { title: 'New Title' }, 'nl');
```

## Next Steps for Full Implementation

### Priority 1: Room Content Multilingual Support

1. **Update Firebase Schema**
   ```
   rooms/
     {roomId}/
       en/
         name: "Single Room"
         description: "..."
         amenities: [...]
       nl/
         name: "Eenpersoonskamer"
         description: "..."
         amenities: [...]
       fr/
         name: "Chambre Simple"
         description: "..."
         amenities: [...]
       photos: [...]  // Photos are language-independent
       bookingUrl: "..."  // Booking URL is language-independent
   ```

2. **Update admin-room-manager.js**
   - Add language tabs (EN | NL | FR) to room editor modal
   - Save/load room data per language
   - Keep photos and bookingUrl shared across languages

3. **Update rooms.html**
   - Load room content based on current language
   - Re-render rooms when language changes

### Priority 2: Info Blocks Multilingual Support

1. **Update Firebase Schema**
   ```
   infoBlocks/
     {blockId}/
       en/
         title: "..."
         content: "..."
       nl/
         title: "..."
         content: "..."
       fr/
         title: "..."
         content: "..."
       order: 0  // Order is language-independent
   ```

2. **Update admin-info-manager.js**
   - Add language tabs to info block editor
   - Save/load per language

3. **Update info.html**
   - Load info blocks based on current language
   - Re-render when language changes

### Priority 3: Admin Panel UI Translation

1. **Add data-i18n attributes** to all admin UI elements:
   - Login screen
   - Navigation buttons
   - Form labels
   - Buttons (Save, Cancel, Delete, Add, etc.)
   - Modal titles
   - Empty states

2. **Add language selector** to admin panel header

3. **Update translations.js** with any missing admin strings

### Priority 4: Amenity Translation

Create a mapping system for amenity names:

```javascript
const AMENITY_TRANSLATIONS = {
  'single-bed': { en: 'Single bed', nl: 'Eenpersoonsbed', fr: 'Lit simple' },
  'double-bed': { en: 'Double bed', nl: 'Tweepersoonsbed', fr: 'Lit double' },
  // ... etc
};
```

## Testing

### Tested Scenarios ✅

1. Language switching on homepage
2. Static UI translation (navigation, buttons, labels)
3. Dynamic content translation (About Us, Sister Hotel)
4. Language persistence across page refreshes
5. Fallback to English when translation missing
6. Backward compatibility with old data format

### Screenshots

- English homepage: ✅
- Dutch homepage: ✅
- French homepage: ✅
- Language selector UI: ✅

## Browser Compatibility

The implementation uses modern JavaScript features but maintains broad compatibility:
- localStorage for language persistence
- Custom events for language change notification
- Standard DOM manipulation
- No external dependencies (other than existing Firebase)

## Performance Considerations

- All translations loaded once on page load (~12KB)
- Language switching is instant (no network requests)
- Content updates use efficient DOM manipulation
- LocalStorage caching reduces Firebase reads

## Support

For questions or issues with the multilingual implementation:
1. Check this documentation
2. Review the code comments in translations.js
3. Test in browser console using window.i18n
4. Check browser localStorage for 'hotel3p_language' key

## Version History

- **v1.0** (2026-01-23): Initial multilingual implementation
  - Language selector in navigation
  - Static UI translation
  - Dynamic content translation (About Us, Sister Hotel)
  - Dutch, English, and French support
