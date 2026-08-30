(() => {
  'use strict';

  const LANG_KEY = 'hotel3p_language_v2';
  const COOKIE_KEY = 'hotel3p_cookie_consent_v2';
  const SUPPORTED = ['nl','en','fr','es','de'];
  const GA_ID = 'G-MX66JGB1Z9';

  const t = {
    nl:{
      'nav.home':'Home','nav.rooms':'Kamers','nav.breakfast':'Ontbijt','nav.about':'Over ons','nav.location':'Locatie','nav.faq':'FAQ','nav.contact':'Contact','nav.book':'Boek nu',
      'hero.title':'Verblijf in het hart van Mechelen.','hero.copy':'Een karaktervol historisch hotel op enkele stappen van de belangrijkste pleinen van Mechelen, met boven een bijzonder uitzicht op de Sint-Romboutskathedraal.','hero.book':'Boek uw verblijf','hero.rooms':'Ontdek onze kamers',
      'booking.checkin':'Aankomst','booking.checkout':'Vertrek','booking.check':'Bekijk beschikbaarheid',
      'about.eyebrow':'Historisch Mechelen · Hedendaags comfort','about.title':'Een klein hotel met een bijzonder perspectief.','about.body':'De 33 kamers van Hotel 3 Paardekens combineren het karakter van een historisch pand met het comfort van een aangenaam stadsverblijf. De absolute blikvanger bevindt zich bovenaan: een glazen ontbijtzaal met uitzicht op de Sint-Romboutskathedraal.','about.button':'Ontdek de kamers',
      'homeRooms.eyebrow':'Verblijf op uw manier','homeRooms.title':'Vier kamertypes. Eén historisch adres.','homeRooms.body':'Alle kamers delen dezelfde centrale ligging en het karakter van het hotel. Kies de categorie die het best past bij uw verblijf in Mechelen.','homeRooms.button':'Ontdek kamers & foto’s',
      'breakfast.eyebrow':'De bovenste verdieping','breakfast.title':'Ontbijt met zicht op de kathedraal.','breakfast.body':'De glazen ontbijtzaal is de signatuurruimte van het hotel - hoog boven het historische centrum, met zicht op de Sint-Romboutskathedraal.',
      'location.title':'Stap buiten en u bent er al.','location.body':'Hotel 3 Paardekens ligt in het historische centrum, met de straten, restaurants, pleinen en bezienswaardigheden van Mechelen op wandelafstand.','location.centre':'Historisch centrum','location.doorstep':'Voor de deur','location.cathedral':'Sint-Romboutskathedraal','location.central':'Centraal Mechelen','location.address':'Adres',
      'sister.eyebrow':'Ons zusterhotel','sister.title':'Op zoek naar een ander verblijf in Mechelen?','sister.body':'Hotel Elisabeth biedt een hedendaags viersterrenalternatief op korte wandelafstand van het historische centrum, met 66 kamers, een binnenkoer en ondergrondse parking.','sister.button':'Ontdek Hotel Elisabeth',
      'cta.eyebrow':'Uw verblijf in Mechelen','cta.title':'Maak de stad van u.','cta.button':'Bekijk beschikbaarheid',
      'footer.short':'Een historisch 3-sterrenhotel in het centrum van Mechelen, België.','footer.explore':'Ontdek','footer.help':'Hulp','footer.booking':'Boeken','footer.direct':'Rechtstreeks boeken','footer.generalFaq':'Veelgestelde vragen','footer.walletFaq':'Apple Wallet FAQ','footer.privacy':'Privacy','footer.cookies':'Cookiebeleid','footer.terms':'Voorwaarden',
      'rooms.hero':'Kamers voor uw verblijf in de stad.','rooms.heroBody':'Single, Twin, Double en Double Deluxe kamers in het historische centrum van Mechelen.','rooms.choose':'Kies uw kamer','rooms.intro':'Elke categorie wordt getoond met echte foto’s van Hotel 3 Paardekens. Klik op een foto om de volledige galerij op groot formaat te bekijken.','rooms.features':'Kamerkenmerken','rooms.gallery':'Bekijk galerij','rooms.check':'Bekijk beschikbaarheid','rooms.ctaEyebrow':'Klaar voor Mechelen?','rooms.ctaTitle':'Kies uw data. Wij zorgen voor de kamer.','rooms.ctaButton':'Boek uw verblijf','rooms.viewAll':'Bekijk alle {count} foto’s',
      'faq.generalTitle':'Veelgestelde vragen','faq.generalLead':'Praktische antwoorden over uw verblijf bij Hotel 3 Paardekens.','faq.walletTitle':'Apple Wallet FAQs','faq.walletLead':'Hulp en antwoorden over het gebruik van uw Hotel 3 Paardekens-pas in Apple Wallet.','faq.crossWallet':'Vragen over Apple Wallet?','faq.crossWalletBody':'Bekijk onze aparte Apple Wallet FAQ-pagina.','faq.crossGeneral':'Algemene vragen over het hotel?','faq.crossGeneralBody':'Ga terug naar onze algemene veelgestelde vragen.','faq.open':'Bekijk pagina','faq.empty':'Er zijn momenteel geen veelgestelde vragen beschikbaar.',
      'cookie.title':'Uw privacy','cookie.body':'Wij gebruiken noodzakelijke opslag voor taal- en cookievoorkeuren. Analytische cookies worden alleen gebruikt als u hiervoor toestemming geeft.','cookie.learn':'Cookiebeleid','cookie.necessary':'Alleen noodzakelijk','cookie.accept':'Analytics toestaan',
      'policy.title':'Cookiebeleid','policy.lead':'Hoe Hotel 3 Paardekens cookies en vergelijkbare technologieën gebruikt.','policy.whatTitle':'Wat zijn cookies?','policy.whatBody':'Cookies en lokale opslag zijn kleine gegevensbestanden die uw browser kan bewaren. Ze kunnen nodig zijn om voorkeuren te onthouden of, met uw toestemming, om anonieme gebruiksstatistieken te meten.','policy.necessaryTitle':'Noodzakelijke opslag','policy.necessaryBody':'De website kan lokale opslag gebruiken om uw taalkeuze en cookievoorkeur te onthouden. Deze gegevens zijn nodig om uw keuzes tussen pagina’s te bewaren en worden niet gebruikt voor reclame.','policy.analyticsTitle':'Analytics','policy.analyticsBody':'Op de productiewebsite kan Google Analytics worden gebruikt om geaggregeerde bezoekersstatistieken te begrijpen. Analytics wordt pas geladen nadat u toestemming hebt gegeven. Op de previewwebsite wordt Analytics niet geladen.','policy.manageTitle':'Uw keuze wijzigen','policy.manageBody':'U kunt uw cookievoorkeur wissen via de instellingen van uw browser. Bij uw volgende bezoek vraagt de website opnieuw om uw keuze.','policy.contactTitle':'Contact','policy.contactBody':'Voor vragen over privacy of cookies kunt u contact opnemen via info@3paardekens.be.'
    },
    en:{
      'nav.home':'Home','nav.rooms':'Rooms','nav.breakfast':'Breakfast','nav.about':'About','nav.location':'Location','nav.faq':'FAQ','nav.contact':'Contact','nav.book':'Book now',
      'hero.title':'Stay in the heart of Mechelen.','hero.copy':'A characterful historic hotel steps from Mechelen’s main squares, with a remarkable rooftop view of St Rumbold’s Cathedral.','hero.book':'Book your stay','hero.rooms':'Discover our rooms',
      'booking.checkin':'Check-in','booking.checkout':'Check-out','booking.check':'Check availability',
      'about.eyebrow':'Historic Mechelen · Contemporary comfort','about.title':'A small hotel with a very special point of view.','about.body':'The 33 rooms of Hotel 3 Paardekens combine the character of a historic property with the essentials of a comfortable city stay. Its defining feature is upstairs: a glass-enclosed breakfast room with a striking view of St Rumbold’s Cathedral.','about.button':'Explore the rooms',
      'homeRooms.eyebrow':'Stay your way','homeRooms.title':'Four room types. One historic address.','homeRooms.body':'All rooms share the same central location and hotel character. Choose the category that best fits the way you want to experience Mechelen.','homeRooms.button':'Explore rooms & galleries',
      'breakfast.eyebrow':'The top floor','breakfast.title':'Breakfast with the cathedral in view.','breakfast.body':'The glass-enclosed breakfast room is the hotel’s signature space - high above the historic centre, looking toward St Rumbold’s Cathedral.',
      'location.title':'Step outside and you’re already there.','location.body':'Hotel 3 Paardekens sits in the historic centre, putting Mechelen’s streets, restaurants, squares and landmarks within easy walking distance.','location.centre':'Historic centre','location.doorstep':'On your doorstep','location.cathedral':'St Rumbold’s Cathedral','location.central':'Central Mechelen','location.address':'Address',
      'sister.eyebrow':'Our sister property','sister.title':'Looking for a different stay in Mechelen?','sister.body':'Hotel Elisabeth offers a contemporary four-star alternative just a short walk from the historic centre, with 66 rooms, an interior courtyard and underground parking.','sister.button':'Discover Hotel Elisabeth',
      'cta.eyebrow':'Your stay in Mechelen','cta.title':'Make the city yours.','cta.button':'Check availability',
      'footer.short':'A historic 3-star hotel in the centre of Mechelen, Belgium.','footer.explore':'Explore','footer.help':'Help','footer.booking':'Booking','footer.direct':'Book direct','footer.generalFaq':'General FAQs','footer.walletFaq':'Apple Wallet FAQs','footer.privacy':'Privacy','footer.cookies':'Cookie policy','footer.terms':'Terms',
      'rooms.hero':'Rooms made for city stays.','rooms.heroBody':'Single, Twin, Double and Double Deluxe rooms in the historic centre of Mechelen.','rooms.choose':'Choose your room','rooms.intro':'Each category is presented with real Hotel 3 Paardekens photography. Click any image to open the full gallery and browse the room at full size.','rooms.features':'Room features','rooms.gallery':'View gallery','rooms.check':'Check availability','rooms.ctaEyebrow':'Ready for Mechelen?','rooms.ctaTitle':'Choose your dates. We’ll take care of the room.','rooms.ctaButton':'Book your stay','rooms.viewAll':'View all {count} photos',
      'faq.generalTitle':'Frequently asked questions','faq.generalLead':'Practical answers about your stay at Hotel 3 Paardekens.','faq.walletTitle':'Apple Wallet FAQs','faq.walletLead':'Help and answers about using your Hotel 3 Paardekens pass in Apple Wallet.','faq.crossWallet':'Questions about Apple Wallet?','faq.crossWalletBody':'Visit our separate Apple Wallet FAQ page.','faq.crossGeneral':'General questions about the hotel?','faq.crossGeneralBody':'Return to our general frequently asked questions.','faq.open':'Open page','faq.empty':'No frequently asked questions are available yet.',
      'cookie.title':'Your privacy','cookie.body':'We use necessary storage for language and cookie preferences. Analytics cookies are used only if you choose to allow them.','cookie.learn':'Cookie policy','cookie.necessary':'Necessary only','cookie.accept':'Allow analytics',
      'policy.title':'Cookie policy','policy.lead':'How Hotel 3 Paardekens uses cookies and similar technologies.','policy.whatTitle':'What are cookies?','policy.whatBody':'Cookies and local storage are small pieces of data your browser can retain. They can be necessary to remember preferences or, with your consent, to measure anonymous usage statistics.','policy.necessaryTitle':'Necessary storage','policy.necessaryBody':'The website may use local storage to remember your language selection and cookie choice. This is required to preserve your choices between pages and is not used for advertising.','policy.analyticsTitle':'Analytics','policy.analyticsBody':'On the production website, Google Analytics may be used to understand aggregated visitor statistics. Analytics loads only after you consent. Analytics is not loaded on the preview website.','policy.manageTitle':'Changing your choice','policy.manageBody':'You can clear your cookie preference through your browser storage settings. On your next visit, the website will ask you to choose again.','policy.contactTitle':'Contact','policy.contactBody':'For privacy or cookie questions, contact us at info@3paardekens.be.'
    },
    fr:{
      'nav.home':'Accueil','nav.rooms':'Chambres','nav.breakfast':'Petit-déjeuner','nav.about':'À propos','nav.location':'Emplacement','nav.faq':'FAQ','nav.contact':'Contact','nav.book':'Réserver',
      'hero.title':'Séjournez au cœur de Malines.','hero.copy':'Un hôtel historique de caractère à quelques pas des principales places de Malines, avec une vue remarquable sur la cathédrale Saint-Rombaut depuis le dernier étage.','hero.book':'Réserver votre séjour','hero.rooms':'Découvrir nos chambres',
      'booking.checkin':'Arrivée','booking.checkout':'Départ','booking.check':'Vérifier les disponibilités',
      'about.eyebrow':'Malines historique · Confort contemporain','about.title':'Un petit hôtel avec un point de vue très particulier.','about.body':'Les 33 chambres de l’Hôtel 3 Paardekens associent le caractère d’un bâtiment historique au confort essentiel d’un séjour en ville. Sa particularité se trouve à l’étage supérieur : une salle de petit-déjeuner vitrée avec une vue saisissante sur la cathédrale Saint-Rombaut.','about.button':'Découvrir les chambres',
      'homeRooms.eyebrow':'Séjournez à votre façon','homeRooms.title':'Quatre types de chambres. Une adresse historique.','homeRooms.body':'Toutes les chambres partagent le même emplacement central et le caractère de l’hôtel. Choisissez la catégorie qui correspond le mieux à votre séjour à Malines.','homeRooms.button':'Chambres & galeries',
      'breakfast.eyebrow':'Le dernier étage','breakfast.title':'Petit-déjeuner avec vue sur la cathédrale.','breakfast.body':'La salle de petit-déjeuner vitrée est l’espace emblématique de l’hôtel - au-dessus du centre historique, face à la cathédrale Saint-Rombaut.',
      'location.title':'Sortez et vous y êtes déjà.','location.body':'L’Hôtel 3 Paardekens se trouve dans le centre historique, à quelques minutes à pied des rues, restaurants, places et monuments de Malines.','location.centre':'Centre historique','location.doorstep':'À votre porte','location.cathedral':'Cathédrale Saint-Rombaut','location.central':'Centre de Malines','location.address':'Adresse',
      'sister.eyebrow':'Notre hôtel partenaire','sister.title':'Envie d’un autre séjour à Malines ?','sister.body':'L’Hôtel Elisabeth propose une alternative contemporaine quatre étoiles à quelques minutes à pied du centre historique, avec 66 chambres, une cour intérieure et un parking souterrain.','sister.button':'Découvrir Hotel Elisabeth',
      'cta.eyebrow':'Votre séjour à Malines','cta.title':'Faites de la ville la vôtre.','cta.button':'Vérifier les disponibilités',
      'footer.short':'Un hôtel 3 étoiles historique au centre de Malines, Belgique.','footer.explore':'Découvrir','footer.help':'Aide','footer.booking':'Réservation','footer.direct':'Réserver en direct','footer.generalFaq':'FAQ générales','footer.walletFaq':'FAQ Apple Wallet','footer.privacy':'Confidentialité','footer.cookies':'Politique de cookies','footer.terms':'Conditions',
      'rooms.hero':'Des chambres pensées pour les séjours en ville.','rooms.heroBody':'Chambres Single, Twin, Double et Double Deluxe dans le centre historique de Malines.','rooms.choose':'Choisissez votre chambre','rooms.intro':'Chaque catégorie est présentée avec de vraies photos de l’Hôtel 3 Paardekens. Cliquez sur une image pour ouvrir la galerie complète en grand format.','rooms.features':'Équipements','rooms.gallery':'Voir la galerie','rooms.check':'Vérifier les disponibilités','rooms.ctaEyebrow':'Prêt pour Malines ?','rooms.ctaTitle':'Choisissez vos dates. Nous nous occupons de la chambre.','rooms.ctaButton':'Réserver votre séjour','rooms.viewAll':'Voir les {count} photos',
      'faq.generalTitle':'Questions fréquentes','faq.generalLead':'Réponses pratiques concernant votre séjour à l’Hôtel 3 Paardekens.','faq.walletTitle':'FAQ Apple Wallet','faq.walletLead':'Aide et réponses concernant l’utilisation de votre pass Hotel 3 Paardekens dans Apple Wallet.','faq.crossWallet':'Des questions sur Apple Wallet ?','faq.crossWalletBody':'Consultez notre page FAQ Apple Wallet séparée.','faq.crossGeneral':'Des questions générales sur l’hôtel ?','faq.crossGeneralBody':'Retournez à nos questions fréquentes générales.','faq.open':'Ouvrir la page','faq.empty':'Aucune question fréquente n’est disponible pour le moment.',
      'cookie.title':'Votre vie privée','cookie.body':'Nous utilisons un stockage nécessaire pour les préférences de langue et de cookies. Les cookies analytiques ne sont utilisés qu’avec votre consentement.','cookie.learn':'Politique de cookies','cookie.necessary':'Nécessaires uniquement','cookie.accept':'Autoriser Analytics',
      'policy.title':'Politique de cookies','policy.lead':'Comment l’Hôtel 3 Paardekens utilise les cookies et technologies similaires.','policy.whatTitle':'Que sont les cookies ?','policy.whatBody':'Les cookies et le stockage local sont de petites données que votre navigateur peut conserver. Ils peuvent être nécessaires pour mémoriser vos préférences ou, avec votre consentement, mesurer des statistiques d’utilisation anonymes.','policy.necessaryTitle':'Stockage nécessaire','policy.necessaryBody':'Le site peut utiliser le stockage local pour mémoriser votre langue et votre choix de cookies. Cela sert uniquement à conserver vos préférences entre les pages et non à des fins publicitaires.','policy.analyticsTitle':'Analytics','policy.analyticsBody':'Sur le site de production, Google Analytics peut être utilisé pour comprendre les statistiques agrégées de visite. Analytics n’est chargé qu’après votre consentement et n’est pas chargé sur le site de prévisualisation.','policy.manageTitle':'Modifier votre choix','policy.manageBody':'Vous pouvez supprimer votre préférence de cookies dans les paramètres de stockage de votre navigateur. Lors de votre prochaine visite, le site vous demandera à nouveau votre choix.','policy.contactTitle':'Contact','policy.contactBody':'Pour toute question relative à la confidentialité ou aux cookies, contactez-nous à info@3paardekens.be.'
    },
    es:{
      'nav.home':'Inicio','nav.rooms':'Habitaciones','nav.breakfast':'Desayuno','nav.about':'Sobre nosotros','nav.location':'Ubicación','nav.faq':'FAQ','nav.contact':'Contacto','nav.book':'Reservar',
      'hero.title':'Alójate en el corazón de Malinas.','hero.copy':'Un hotel histórico con carácter a pocos pasos de las principales plazas de Malinas, con una extraordinaria vista de la catedral de San Rumoldo desde la planta superior.','hero.book':'Reserva tu estancia','hero.rooms':'Descubre nuestras habitaciones',
      'booking.checkin':'Llegada','booking.checkout':'Salida','booking.check':'Consultar disponibilidad',
      'about.eyebrow':'Malinas histórica · Confort contemporáneo','about.title':'Un hotel pequeño con un punto de vista muy especial.','about.body':'Las 33 habitaciones del Hotel 3 Paardekens combinan el carácter de un edificio histórico con lo esencial para una estancia cómoda en la ciudad. Su elemento más especial está arriba: una sala de desayunos acristalada con una impresionante vista de la catedral de San Rumoldo.','about.button':'Explorar habitaciones',
      'homeRooms.eyebrow':'Alójate a tu manera','homeRooms.title':'Cuatro tipos de habitación. Una dirección histórica.','homeRooms.body':'Todas las habitaciones comparten la misma ubicación céntrica y el carácter del hotel. Elige la categoría que mejor se adapte a tu estancia en Malinas.','homeRooms.button':'Habitaciones y galerías',
      'breakfast.eyebrow':'La planta superior','breakfast.title':'Desayuno con vistas a la catedral.','breakfast.body':'La sala de desayunos acristalada es el espacio emblemático del hotel - sobre el centro histórico y mirando hacia la catedral de San Rumoldo.',
      'location.title':'Sal y ya estarás en el centro.','location.body':'Hotel 3 Paardekens está en pleno centro histórico, con las calles, restaurantes, plazas y monumentos de Malinas a poca distancia a pie.','location.centre':'Centro histórico','location.doorstep':'A la puerta','location.cathedral':'Catedral de San Rumoldo','location.central':'Centro de Malinas','location.address':'Dirección',
      'sister.eyebrow':'Nuestro hotel asociado','sister.title':'¿Buscas otro tipo de estancia en Malinas?','sister.body':'Hotel Elisabeth ofrece una alternativa contemporánea de cuatro estrellas a pocos minutos a pie del centro histórico, con 66 habitaciones, patio interior y aparcamiento subterráneo.','sister.button':'Descubre Hotel Elisabeth',
      'cta.eyebrow':'Tu estancia en Malinas','cta.title':'Haz tuya la ciudad.','cta.button':'Consultar disponibilidad',
      'footer.short':'Un hotel histórico de 3 estrellas en el centro de Malinas, Bélgica.','footer.explore':'Descubrir','footer.help':'Ayuda','footer.booking':'Reservas','footer.direct':'Reservar directamente','footer.generalFaq':'Preguntas frecuentes','footer.walletFaq':'FAQ Apple Wallet','footer.privacy':'Privacidad','footer.cookies':'Política de cookies','footer.terms':'Condiciones',
      'rooms.hero':'Habitaciones para disfrutar de la ciudad.','rooms.heroBody':'Habitaciones Single, Twin, Double y Double Deluxe en el centro histórico de Malinas.','rooms.choose':'Elige tu habitación','rooms.intro':'Cada categoría se presenta con fotografías reales del Hotel 3 Paardekens. Haz clic en cualquier imagen para abrir la galería completa a gran tamaño.','rooms.features':'Características','rooms.gallery':'Ver galería','rooms.check':'Consultar disponibilidad','rooms.ctaEyebrow':'¿Listo para Malinas?','rooms.ctaTitle':'Elige tus fechas. Nosotros nos ocupamos de la habitación.','rooms.ctaButton':'Reserva tu estancia','rooms.viewAll':'Ver las {count} fotos',
      'faq.generalTitle':'Preguntas frecuentes','faq.generalLead':'Respuestas prácticas sobre tu estancia en Hotel 3 Paardekens.','faq.walletTitle':'FAQ de Apple Wallet','faq.walletLead':'Ayuda y respuestas sobre el uso de tu pase de Hotel 3 Paardekens en Apple Wallet.','faq.crossWallet':'¿Preguntas sobre Apple Wallet?','faq.crossWalletBody':'Visita nuestra página independiente de FAQ de Apple Wallet.','faq.crossGeneral':'¿Preguntas generales sobre el hotel?','faq.crossGeneralBody':'Vuelve a nuestras preguntas frecuentes generales.','faq.open':'Abrir página','faq.empty':'Todavía no hay preguntas frecuentes disponibles.',
      'cookie.title':'Tu privacidad','cookie.body':'Usamos almacenamiento necesario para recordar el idioma y las preferencias de cookies. Las cookies analíticas solo se utilizan si das tu consentimiento.','cookie.learn':'Política de cookies','cookie.necessary':'Solo necesarias','cookie.accept':'Permitir Analytics',
      'policy.title':'Política de cookies','policy.lead':'Cómo utiliza Hotel 3 Paardekens las cookies y tecnologías similares.','policy.whatTitle':'¿Qué son las cookies?','policy.whatBody':'Las cookies y el almacenamiento local son pequeños datos que el navegador puede conservar. Pueden ser necesarios para recordar preferencias o, con tu consentimiento, medir estadísticas de uso anónimas.','policy.necessaryTitle':'Almacenamiento necesario','policy.necessaryBody':'El sitio puede usar almacenamiento local para recordar el idioma y tu elección de cookies. Se utiliza para conservar tus preferencias entre páginas y no para publicidad.','policy.analyticsTitle':'Analytics','policy.analyticsBody':'En el sitio de producción, Google Analytics puede utilizarse para comprender estadísticas agregadas de visitantes. Solo se carga después de tu consentimiento y no se carga en el sitio de previsualización.','policy.manageTitle':'Cambiar tu elección','policy.manageBody':'Puedes borrar tu preferencia de cookies desde la configuración de almacenamiento del navegador. En tu próxima visita, el sitio volverá a pedirte que elijas.','policy.contactTitle':'Contacto','policy.contactBody':'Para preguntas sobre privacidad o cookies, escríbenos a info@3paardekens.be.'
    },
    de:{
      'nav.home':'Start','nav.rooms':'Zimmer','nav.breakfast':'Frühstück','nav.about':'Über uns','nav.location':'Lage','nav.faq':'FAQ','nav.contact':'Kontakt','nav.book':'Buchen',
      'hero.title':'Übernachten Sie im Herzen von Mechelen.','hero.copy':'Ein charaktervolles historisches Hotel nur wenige Schritte von den wichtigsten Plätzen Mechelens entfernt, mit einem besonderen Blick auf die St.-Rombouts-Kathedrale von oben.','hero.book':'Aufenthalt buchen','hero.rooms':'Unsere Zimmer entdecken',
      'booking.checkin':'Anreise','booking.checkout':'Abreise','booking.check':'Verfügbarkeit prüfen',
      'about.eyebrow':'Historisches Mechelen · Moderner Komfort','about.title':'Ein kleines Hotel mit einer ganz besonderen Perspektive.','about.body':'Die 33 Zimmer des Hotel 3 Paardekens verbinden den Charakter eines historischen Gebäudes mit dem Komfort eines angenehmen Stadtaufenthalts. Das besondere Highlight befindet sich ganz oben: ein verglaster Frühstücksraum mit beeindruckendem Blick auf die St.-Rombouts-Kathedrale.','about.button':'Zimmer entdecken',
      'homeRooms.eyebrow':'Auf Ihre Art übernachten','homeRooms.title':'Vier Zimmertypen. Eine historische Adresse.','homeRooms.body':'Alle Zimmer teilen die zentrale Lage und den Charakter des Hotels. Wählen Sie die Kategorie, die am besten zu Ihrem Aufenthalt in Mechelen passt.','homeRooms.button':'Zimmer & Galerien',
      'breakfast.eyebrow':'Die oberste Etage','breakfast.title':'Frühstück mit Blick auf die Kathedrale.','breakfast.body':'Der verglaste Frühstücksraum ist der besondere Ort des Hotels - hoch über dem historischen Zentrum mit Blick auf die St.-Rombouts-Kathedrale.',
      'location.title':'Vor die Tür treten und schon mittendrin sein.','location.body':'Das Hotel 3 Paardekens liegt im historischen Zentrum. Straßen, Restaurants, Plätze und Sehenswürdigkeiten von Mechelen sind bequem zu Fuß erreichbar.','location.centre':'Historisches Zentrum','location.doorstep':'Direkt vor der Tür','location.cathedral':'St.-Rombouts-Kathedrale','location.central':'Zentrum von Mechelen','location.address':'Adresse',
      'sister.eyebrow':'Unser Schwesterhotel','sister.title':'Sie suchen einen anderen Aufenthalt in Mechelen?','sister.body':'Das Hotel Elisabeth ist eine moderne Vier-Sterne-Alternative nur wenige Gehminuten vom historischen Zentrum entfernt, mit 66 Zimmern, Innenhof und Tiefgarage.','sister.button':'Hotel Elisabeth entdecken',
      'cta.eyebrow':'Ihr Aufenthalt in Mechelen','cta.title':'Machen Sie die Stadt zu Ihrer.','cta.button':'Verfügbarkeit prüfen',
      'footer.short':'Ein historisches 3-Sterne-Hotel im Zentrum von Mechelen, Belgien.','footer.explore':'Entdecken','footer.help':'Hilfe','footer.booking':'Buchung','footer.direct':'Direkt buchen','footer.generalFaq':'Allgemeine FAQs','footer.walletFaq':'Apple Wallet FAQs','footer.privacy':'Datenschutz','footer.cookies':'Cookie-Richtlinie','footer.terms':'Bedingungen',
      'rooms.hero':'Zimmer für Ihren Stadtaufenthalt.','rooms.heroBody':'Single-, Twin-, Double- und Double-Deluxe-Zimmer im historischen Zentrum von Mechelen.','rooms.choose':'Wählen Sie Ihr Zimmer','rooms.intro':'Jede Kategorie wird mit echten Fotos des Hotel 3 Paardekens präsentiert. Klicken Sie auf ein Bild, um die vollständige Galerie in Großansicht zu öffnen.','rooms.features':'Zimmerausstattung','rooms.gallery':'Galerie ansehen','rooms.check':'Verfügbarkeit prüfen','rooms.ctaEyebrow':'Bereit für Mechelen?','rooms.ctaTitle':'Wählen Sie Ihre Daten. Wir kümmern uns um das Zimmer.','rooms.ctaButton':'Aufenthalt buchen','rooms.viewAll':'Alle {count} Fotos ansehen',
      'faq.generalTitle':'Häufig gestellte Fragen','faq.generalLead':'Praktische Antworten zu Ihrem Aufenthalt im Hotel 3 Paardekens.','faq.walletTitle':'Apple Wallet FAQs','faq.walletLead':'Hilfe und Antworten zur Nutzung Ihres Hotel-3-Paardekens-Passes in Apple Wallet.','faq.crossWallet':'Fragen zu Apple Wallet?','faq.crossWalletBody':'Besuchen Sie unsere separate Apple-Wallet-FAQ-Seite.','faq.crossGeneral':'Allgemeine Fragen zum Hotel?','faq.crossGeneralBody':'Zurück zu unseren allgemeinen häufig gestellten Fragen.','faq.open':'Seite öffnen','faq.empty':'Derzeit sind keine häufig gestellten Fragen verfügbar.',
      'cookie.title':'Ihre Privatsphäre','cookie.body':'Wir verwenden notwendigen Speicher für Sprach- und Cookie-Einstellungen. Analyse-Cookies werden nur verwendet, wenn Sie zustimmen.','cookie.learn':'Cookie-Richtlinie','cookie.necessary':'Nur notwendig','cookie.accept':'Analytics erlauben',
      'policy.title':'Cookie-Richtlinie','policy.lead':'Wie das Hotel 3 Paardekens Cookies und ähnliche Technologien verwendet.','policy.whatTitle':'Was sind Cookies?','policy.whatBody':'Cookies und lokaler Speicher sind kleine Datenmengen, die Ihr Browser speichern kann. Sie können notwendig sein, um Einstellungen zu merken oder - mit Ihrer Zustimmung - anonyme Nutzungsstatistiken zu messen.','policy.necessaryTitle':'Notwendiger Speicher','policy.necessaryBody':'Die Website kann lokalen Speicher verwenden, um Ihre Sprache und Cookie-Auswahl zu speichern. Dies dient nur dazu, Ihre Auswahl zwischen Seiten beizubehalten und wird nicht für Werbung verwendet.','policy.analyticsTitle':'Analytics','policy.analyticsBody':'Auf der Produktionswebsite kann Google Analytics verwendet werden, um aggregierte Besucherstatistiken zu verstehen. Analytics wird erst nach Ihrer Zustimmung geladen und auf der Vorschauwebsite nicht geladen.','policy.manageTitle':'Auswahl ändern','policy.manageBody':'Sie können Ihre Cookie-Einstellung über die Speichereinstellungen Ihres Browsers löschen. Beim nächsten Besuch fragt die Website erneut nach Ihrer Auswahl.','policy.contactTitle':'Kontakt','policy.contactBody':'Bei Fragen zu Datenschutz oder Cookies kontaktieren Sie uns unter info@3paardekens.be.'
    }
  };

  const getInitialLanguage = () => {
    const query = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.includes(query)) return query;
    const stored = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.includes(stored)) return stored;
    const browser = (navigator.language || '').slice(0,2).toLowerCase();
    return SUPPORTED.includes(browser) ? browser : 'en';
  };

  let currentLang = getInitialLanguage();
  window.Hotel3P = window.Hotel3P || {};
  window.Hotel3P.getLanguage = () => currentLang;
  window.Hotel3P.translate = (key) => (t[currentLang] && t[currentLang][key]) || t.en[key] || key;

  const localize = (obj, field, lang=currentLang) => obj?.[`${field}_${lang}`] ?? obj?.[`${field}_en`] ?? obj?.[field] ?? '';

  const applyTranslations = () => {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = (t[currentLang] && t[currentLang][key]) || t.en[key];
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const value = (t[currentLang] && t[currentLang][key]) || t.en[key];
      if (value != null) el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('.lang-current').forEach(el => el.textContent = currentLang.toUpperCase());
    document.querySelectorAll('[data-lang-option]').forEach(btn => btn.classList.toggle('active', btn.dataset.langOption === currentLang));
    document.dispatchEvent(new CustomEvent('hotelLanguageChanged',{detail:{language:currentLang}}));
  };

  const setLanguage = (lang) => {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY,lang);
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    history.replaceState({},'',url);
    document.querySelectorAll('.language-switcher').forEach(el => el.classList.remove('is-open'));
    applyTranslations();
    loadSiteContent();
    loadRoomContent();
  };

  document.querySelectorAll('.language-switcher').forEach(sw => {
    const toggle = sw.querySelector('.lang-toggle');
    toggle?.addEventListener('click',e=>{e.stopPropagation();sw.classList.toggle('is-open')});
    sw.querySelectorAll('[data-lang-option]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.langOption)));
  });
  document.addEventListener('click',()=>document.querySelectorAll('.language-switcher').forEach(el=>el.classList.remove('is-open')));

  /* Header */
  const header=document.querySelector('.site-header');
  const menuToggle=document.querySelector('.menu-toggle');
  const updateHeader=()=>{
    if(!header||header.classList.contains('header-solid')||header.classList.contains('menu-open'))return;
    header.classList.toggle('scrolled',window.scrollY>48);
  };
  updateHeader(); window.addEventListener('scroll',updateHeader,{passive:true});
  if(menuToggle&&header){
    menuToggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');menuToggle.setAttribute('aria-expanded',String(open));if(!open)updateHeader()});
    header.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',()=>{header.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');updateHeader()}));
  }

  /* Booking */
  const today=new Date();const tomorrow=new Date(today);tomorrow.setDate(today.getDate()+1);
  const toYMD=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const checkin=document.querySelector('#preview-checkin');const checkout=document.querySelector('#preview-checkout');const bookButton=document.querySelector('#preview-book');
  const mewsBase='https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6';
  if(checkin&&checkout){checkin.min=toYMD(today);checkin.value=toYMD(today);checkout.min=toYMD(tomorrow);checkout.value=toYMD(tomorrow);checkin.addEventListener('change',()=>{if(!checkin.value)return;const inDate=new Date(`${checkin.value}T00:00:00`);const minOut=new Date(inDate);minOut.setDate(inDate.getDate()+1);const minOutValue=toYMD(minOut);checkout.min=minOutValue;if(!checkout.value||checkout.value<=checkin.value)checkout.value=minOutValue})}
  const openBooking=(withDates=false)=>{let url=`${mewsBase}?mewsRoute=rooms`;if(withDates&&checkin&&checkout)url=`${mewsBase}?mewsStart=${encodeURIComponent(checkin.value)}&mewsEnd=${encodeURIComponent(checkout.value)}&mewsRoute=rooms`;window.open(url,'_blank','noopener,noreferrer')};
  bookButton?.addEventListener('click',e=>{e.preventDefault();openBooking(true)});
  document.querySelectorAll('[data-book]').forEach(link=>link.addEventListener('click',e=>{if(link.id==='preview-book')return;e.preventDefault();openBooking(false)}));

  /* CMS-backed content */
  async function loadSiteContent(){
    const nodes=document.querySelectorAll('[data-site-field]');if(!nodes.length)return;
    try{const res=await fetch('v2/content/site.json',{cache:'no-store'});if(!res.ok)return;const data=await res.json();nodes.forEach(el=>{const val=localize(data,el.dataset.siteField);if(val)el.textContent=val})}catch(_){ }
  }
  async function loadRoomContent(){
    const roomNodes=[...document.querySelectorAll('[data-room-id]')];if(!roomNodes.length)return;
    const ids=[...new Set(roomNodes.map(el=>el.dataset.roomId))];
    await Promise.all(ids.map(async id=>{try{const res=await fetch(`v2/content/rooms/${id}.json`,{cache:'no-store'});if(!res.ok)return;const data=await res.json();document.querySelectorAll(`[data-room-id="${id}"]`).forEach(root=>{
      const name=localize(data,'name');const strap=localize(data,'strapline');const desc=localize(data,'description');const amenities=data[`amenities_${currentLang}`]||data.amenities_en||data.amenities||[];
      root.querySelectorAll('[data-room-role="name"]').forEach(el=>{if(name)el.textContent=name});
      root.querySelectorAll('[data-room-role="strapline"]').forEach(el=>{if(strap)el.textContent=strap});
      root.querySelectorAll('[data-room-role="description"]').forEach(el=>{if(desc)el.textContent=desc});
      root.querySelectorAll('[data-room-role="amenities"]').forEach(el=>{if(Array.isArray(amenities)){el.innerHTML='';amenities.forEach(item=>{const li=document.createElement('li');li.textContent=item;el.appendChild(li)})}});
      if(root.classList.contains('room-showcase')&&name)root.dataset.roomName=name;
    })}catch(_){ }}));
  }

  /* Galleries */
  const galleryArticles=document.querySelectorAll('.room-showcase[data-gallery]');
  if(galleryArticles.length){
    const lightbox=document.createElement('div');lightbox.className='lightbox';lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');
    lightbox.innerHTML='<div class="lightbox-top"><div class="lightbox-title"></div><div class="lightbox-counter"></div><button class="lightbox-close" type="button" aria-label="Close gallery">×</button></div><div class="lightbox-stage"><button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">‹</button><img class="lightbox-image" alt=""><button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">›</button></div><div class="lightbox-caption"></div>';
    document.body.appendChild(lightbox);
    const image=lightbox.querySelector('.lightbox-image'),title=lightbox.querySelector('.lightbox-title'),counter=lightbox.querySelector('.lightbox-counter'),caption=lightbox.querySelector('.lightbox-caption'),closeButton=lightbox.querySelector('.lightbox-close'),previousButton=lightbox.querySelector('.lightbox-prev'),nextButton=lightbox.querySelector('.lightbox-next');
    let gallery=[],galleryName='',galleryIndex=0;
    const render=()=>{if(!gallery.length)return;galleryIndex=(galleryIndex+gallery.length)%gallery.length;image.src=gallery[galleryIndex];image.alt=`${galleryName} - photo ${galleryIndex+1}`;title.textContent=galleryName;counter.textContent=`${galleryIndex+1} / ${gallery.length}`;caption.textContent=`Hotel 3 Paardekens · ${galleryName}`};
    const open=(article,index=0)=>{try{gallery=JSON.parse(article.dataset.gallery||'[]')}catch{gallery=[]}if(!gallery.length)return;galleryName=article.dataset.roomName||'Room';galleryIndex=Number(index)||0;render();lightbox.classList.add('is-open');document.body.classList.add('lightbox-open');closeButton.focus()};
    const close=()=>{lightbox.classList.remove('is-open');document.body.classList.remove('lightbox-open');image.removeAttribute('src')};
    galleryArticles.forEach(article=>article.querySelectorAll('.gallery-trigger').forEach(trigger=>trigger.addEventListener('click',()=>open(article,trigger.dataset.galleryOpen||0))));
    closeButton.addEventListener('click',close);previousButton.addEventListener('click',()=>{galleryIndex--;render()});nextButton.addEventListener('click',()=>{galleryIndex++;render()});lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});
    document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft'){galleryIndex--;render()}if(e.key==='ArrowRight'){galleryIndex++;render()}});
  }

  /* Cookie consent - analytics is deliberately disabled on preview hosts */
  const createCookieBanner=()=>{
    if(localStorage.getItem(COOKIE_KEY))return;
    const banner=document.createElement('div');banner.className='cookie-banner is-visible';banner.innerHTML=`<div class="cookie-copy"><strong data-i18n="cookie.title"></strong><span data-i18n="cookie.body"></span> <a href="cookie-policy.html" data-i18n="cookie.learn"></a></div><div class="cookie-actions"><button type="button" data-cookie="necessary" data-i18n="cookie.necessary"></button><button class="accept" type="button" data-cookie="analytics" data-i18n="cookie.accept"></button></div>`;document.body.appendChild(banner);applyTranslations();banner.querySelectorAll('[data-cookie]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem(COOKIE_KEY,btn.dataset.cookie);banner.remove();if(btn.dataset.cookie==='analytics')loadAnalytics()}));
  };
  const loadAnalytics=()=>{
    if(location.hostname.endsWith('.pages.dev'))return;
    if(!/3paardekens\.com$/i.test(location.hostname))return;
    if(window.__hotelGA)return;window.__hotelGA=true;
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA_ID,{anonymize_ip:true});
    const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;document.head.appendChild(s);
  };
  if(localStorage.getItem(COOKIE_KEY)==='analytics')loadAnalytics();

  applyTranslations();loadSiteContent();loadRoomContent();createCookieBanner();
})();
