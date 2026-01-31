// Internationalization system
let currentLang = 'hu';
let translations = {};

// Translations embedded directly to avoid CORS issues
const translationsData = {
  hu: {
    "meta": {
      "title": "Bea & Gábor — Esküvő",
      "description": "Bea & Gábor esküvője — 2026.08.22. • Ceremónia 17:00 • Ünnepség 19:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Ugrás a tartalomra",
      "brand": "Bea & Gábor",
      "location": "Helyszín",
      "accommodation": "Szállás",
      "rsvp": "Visszajelzés"
    },
    "hero": {
      "date": "2026. augusztus 22.",
      "names": "Bea és Gábor",
      "subtitle": "Esküvője",
      "lead": "Tartsatok velünk ezen a különleges napon, amikor a közös életünk egy új fejezetébe lépünk. Legyen ez a nap tele olyan megható, boldog, vidám és szeretettel teli emlékekkel, amelyek egy életen át elkísérnek minket az utunkon.",
      "ctaRsvp": "Visszajelzés",
      "ctaLocation": "Helyszín"
    },
    "quickfacts": {
      "ceremony": "Ceremónia",
      "celebration": "Ünnepség",
      "location": "Helyszín",
      "date": "2026 augusztus 22"
    },
    "countdown": {
      "days": "Nap",
      "hours": "Óra",
      "minutes": "Perc",
      "seconds": "Másodperc"
    },
    "rsvp": {
      "title": "Visszajelzés",
      "description": "A jókedv kötelező, a tánc ajánlott, mint ahogy a részvételi szándék visszajelzése is.",
      "deadline": "Július 22-ig kérünk jelezz vissza az alábbi űrlapon.",
      "button": "Megnyitom a Google űrlapot"
    },
    "location": {
      "title": "Helyszín",
      "detail": "Căpâlnița, jud. Harghita",
      "directions": "A ceremóniára, a koktélpercekre és az ünnepségre is a varázslatos Magic Harghita Resortban kerül majd sor, amely az erdő mélyén, ahol a nap sugarai áttörnek a zöld koronák között, egy csendes tisztáson vár ránk.  Székelyudvarhely felől érkezve majd Kápolnásfalunál kell letérni balra a főútról. Onnan egy 3 km-es út vezet át a tisztáson, egyenesen a Resort kapujáig ahol parkolási lehetőség is van.",
      "button": "Útvonaltervezés Google Maps-ben",
      "travelButton": "Megnyitom a Google űrlapot"
    },
    "route": {
      "stop1": "Magyarvalkó",
      "stop2": "Kolozsvár",
      "stop3": "Székelyudvarhely",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Szállás",
      "price": "150 RON / fő",
      "description": "A helyszínen szállást is lehet foglalni, amennyiben valaki a késői vezetés vagy a lehetséges busz helyett a kényelmesebb ott alvást választaná. A helyek száma korlátozott és a közelebbi családtagoknak előnyük van a foglalásban. További részletet a szallásról a következő oldalon lehet találni:",
      "button": "Tovább a szállás oldalára",
      "includes": "Amit tartalmaz:",
      "breakfast": "reggeli/morzsa",
      "checkout": "Check-out:",
      "checkoutTime": "másnap déli 12:00 óra"
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  en: {
    "meta": {
      "title": "Bea & Gábor — Wedding",
      "description": "Bea & Gábor's wedding — 2026.08.22. • Ceremony 17:00 • Celebration 19:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Skip to content",
      "brand": "Bea & Gábor",
      "location": "Location",
      "accommodation": "Accommodation",
      "rsvp": "RSVP"
    },
    "hero": {
      "date": "August 22, 2026",
      "names": "Bea and Gábor",
      "subtitle": "Wedding",
      "lead": "Join us on this special day as we step into a new chapter of our life together. May this day be filled with touching, joyful, happy, and love-filled memories that will accompany us throughout our journey.",
      "ctaRsvp": "RSVP",
      "ctaLocation": "Location"
    },
    "quickfacts": {
      "ceremony": "Ceremony",
      "celebration": "Celebration",
      "location": "Location",
      "date": "August 22, 2026"
    },
    "countdown": {
      "days": "Days",
      "hours": "Hours",
      "minutes": "Minutes",
      "seconds": "Seconds"
    },
    "rsvp": {
      "title": "RSVP",
      "description": "Good mood is mandatory, dancing is recommended, as is letting us know your attendance intention.",
      "deadline": "Please respond via the form below by July 22.",
      "button": "Open Google Form"
    },
    "location": {
      "title": "Location",
      "detail": "Căpâlnița, Harghita County",
      "directions": "The ceremony, cocktail hour, and celebration will all take place at the magical Magic Harghita Resort, which awaits us deep in the forest, where the sun's rays break through the green canopies, on a quiet clearing. Coming from Odorheiu Secuiesc, turn left at Căpâlnița from the main road. From there, a 3 km road leads through the clearing, straight to the Resort gate where parking is also available.",
      "button": "Get directions on Google Maps",
      "travelButton": "Open Google Form"
    },
    "route": {
      "stop1": "Văleni (Călățele)",
      "stop2": "Cluj-Napoca",
      "stop3": "Odorheiu Secuiesc",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Accommodation",
      "price": "150 RON / person",
      "description": "Accommodation can be booked at the venue for those who prefer the comfort of staying overnight rather than late-night driving or the possible bus option. The number of places is limited and close family members have priority in booking. Further details about accommodation can be found on the following page:",
      "button": "Go to accommodation page",
      "includes": "What's included:",
      "breakfast": "breakfast / snack",
      "checkout": "Check-out:",
      "checkoutTime": "next day at 12:00 PM"
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  ro: {
    "meta": {
      "title": "Bea & Gábor — Nuntă",
      "description": "Nunta lui Bea & Gábor — 2026.08.22. • Ceremonie 17:00 • Sărbătoare 19:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Sari la conținut",
      "brand": "Bea & Gábor",
      "location": "Locație",
      "accommodation": "Cazare",
      "rsvp": "Confirmare"
    },
    "hero": {
      "date": "22 august 2026",
      "names": "Bea și Gábor",
      "subtitle": "Nunta",
      "lead": "Alătură-te nouă în această zi specială când intrăm într-un nou capitol al vieții noastre comune. Fie ca această zi să fie plină de amintiri emoționante, fericite, vesele și pline de dragoste care ne vor însoți pe tot parcursul călătoriei noastre.",
      "ctaRsvp": "Confirmare",
      "ctaLocation": "Locație"
    },
    "quickfacts": {
      "ceremony": "Ceremonie",
      "celebration": "Sărbătoare",
      "location": "Locație",
      "date": "22 august 2026"
    },
    "countdown": {
      "days": "Zile",
      "hours": "Ore",
      "minutes": "Minute",
      "seconds": "Secunde"
    },
    "rsvp": {
      "title": "Confirmare",
      "description": "Buna dispoziție este obligatorie, dansul este recomandat, la fel ca și anunțarea intenției de participare.",
      "deadline": "Te rugăm să răspunzi prin formularul de mai jos până pe 22 iulie.",
      "button": "Deschide formularul Google"
    },
    "location": {
      "title": "Locație",
      "detail": "Căpâlnița, jud. Harghita",
      "directions": "Ceremonia, ora cocktailurilor și celebrarea vor avea loc la minunatul Magic Harghita Resort, care ne așteaptă adânc în pădure, unde razele soarelui străpung coroanele verzi, pe o poiană liniștită. Venind din Odorheiu Secuiesc, virați la stânga la Căpâlnița de pe drumul principal. De acolo, un drum de 3 km duce prin poiană, direct la poarta Resort-ului unde este disponibil și parcare.",
      "button": "Obține direcții pe Google Maps",
      "travelButton": "Deschid formularul Google"
    },
    "route": {
      "stop1": "Văleni (Călățele)",
      "stop2": "Cluj-Napoca",
      "stop3": "Odorheiu Secuiesc",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Cazare",
      "price": "150 RON / persoană",
      "description": "Se poate rezerva și cazare la locație, dacă cineva ar prefera confortul de a rămâne peste noapte în loc de condus târziu sau de autobuzul posibil. Numărul de locuri este limitat și membrii familiei mai apropiați au prioritate la rezervare. Detalii suplimentare despre cazare pot fi găsite pe următoarea pagină:",
      "button": "Mergi la pagina de cazare",
      "includes": "Ce include:",
      "breakfast": "mic dejun / gustare",
      "checkout": "Check-out:",
      "checkoutTime": "a doua zi la 12:00"
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  }
};

// Load translations (now just assign from embedded data)
function loadTranslations(lang) {
  if (translationsData[lang]) {
    translations[lang] = translationsData[lang];
    return translations[lang];
  }
  return null;
}

// Get translation by key
function t(key, lang = currentLang) {
  // If translations not loaded for this language, return null to keep original text
  if (!translations[lang]) {
    return null;
  }
  
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return null; // Return null if translation not found (keep original text)
    }
  }
  
  return typeof value === 'string' ? value : null;
}

// Update all elements with data-i18n attributes
window.updateTranslations = async function updateTranslations(lang) {
  currentLang = lang;
  
  // Load translation if not already loaded (lazy loading)
  if (!translations[lang]) {
    loadTranslations(lang);
  }
  
  // Update document language
  document.documentElement.lang = lang;
  
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && translations[lang]) {
    const desc = t('meta.description', lang);
    if (desc) metaDesc.content = desc;
  }
  
  // Update title
  if (translations[lang]) {
    const title = t('meta.title', lang);
    if (title) document.title = title;
  }
  
  // Update all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key, lang);
    
    // Only update if translation exists and is not the key itself
    if (translation && translation !== key && translations[lang]) {
      // Handle HTML content - sanitize to only allow safe tags
      if (typeof translation === 'string' && translation.includes('<strong')) {
        // Only allow <strong> tags for security
        const sanitized = translation
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*(?<!strong|class|highlight)[^>]*>/gi, '')
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        element.innerHTML = sanitized;
      } else if (typeof translation === 'string') {
        element.textContent = translation;
      }
    }
    // If translation failed, keep original text (which is already in HTML)
    
    // Mark as loaded (even if translation failed, to show the element)
    element.setAttribute('data-i18n-loaded', 'true');
  });
  
  // Update countdown labels
  document.querySelectorAll('.countdown__label').forEach((el, index) => {
    const labels = ['countdown.days', 'countdown.hours', 'countdown.minutes', 'countdown.seconds'];
    if (labels[index]) {
      el.textContent = t(labels[index], lang);
    }
  });
  
  // Update quickfacts
  const quickfactsK = document.querySelectorAll('.quickfacts__k');
  if (quickfactsK.length >= 3) {
    quickfactsK[0].textContent = t('quickfacts.ceremony', lang);
    quickfactsK[1].textContent = t('quickfacts.celebration', lang);
    quickfactsK[2].textContent = t('quickfacts.location', lang);
  }
  
  const quickfactsDate = document.querySelectorAll('.quickfacts__date');
  quickfactsDate.forEach(el => {
    el.textContent = t('quickfacts.date', lang);
  });
  
  // Save language preference
  localStorage.setItem('preferredLang', lang);
  
  // Update language button display
  const langFlag = document.getElementById('langFlag');
  if (langFlag) {
    const option = document.querySelector(`.lang-switcher__option[data-lang="${lang}"]`);
    if (option) {
      // Try PNG first, fallback to SVG
      const flagPng = option.getAttribute('data-flag-png');
      const flagSvg = option.getAttribute('data-flag-svg');
      if (flagPng) {
        langFlag.src = flagPng;
        langFlag.onerror = function() {
          if (flagSvg) this.src = flagSvg;
        };
      } else if (flagSvg) {
        langFlag.src = flagSvg;
      }
    }
  }
  
  // Update Google Form link based on language
  const rsvpFormLink = document.getElementById('rsvpFormLink');
  if (rsvpFormLink) {
    // Hungarian uses one form, English and Romanian use another
    if (lang === 'hu') {
      rsvpFormLink.href = 'https://forms.gle/hxEey31YVZisD2sk6';
    } else {
      rsvpFormLink.href = 'https://forms.gle/uVE2jtpvvESLX4g57';
    }
  }
}

// Initialize
async function initI18n() {
  // Get saved language or default to Hungarian
  const savedLang = localStorage.getItem('preferredLang') || 'hu';
  
  // Load only the initial language first (lazy load others when needed)
  loadTranslations(savedLang);
  
  // Set initial language
  await updateTranslations(savedLang);
    
    // Set initial form link
    const rsvpFormLink = document.getElementById('rsvpFormLink');
    if (rsvpFormLink) {
      if (savedLang === 'hu') {
        rsvpFormLink.href = 'https://forms.gle/hxEey31YVZisD2sk6';
      } else {
        rsvpFormLink.href = 'https://forms.gle/uVE2jtpvvESLX4g57';
      }
    }
    
    // Set initial travel form link
    const travelFormLink = document.getElementById('travelFormLink');
    if (travelFormLink) {
      if (savedLang === 'hu') {
        travelFormLink.href = 'https://forms.gle/hxEey31YVZisD2sk6';
      } else {
        travelFormLink.href = 'https://forms.gle/uVE2jtpvvESLX4g57';
      }
    }
  
  // Update language button display if it exists
  const langFlag = document.getElementById('langFlag');
  if (langFlag) {
    const option = document.querySelector(`.lang-switcher__option[data-lang="${savedLang}"]`);
    if (option) {
      // Try PNG first, fallback to SVG
      const flagPng = option.getAttribute('data-flag-png');
      const flagSvg = option.getAttribute('data-flag-svg');
      if (flagPng) {
        langFlag.src = flagPng;
        langFlag.onerror = function() {
          if (flagSvg) this.src = flagSvg;
        };
      } else if (flagSvg) {
        langFlag.src = flagSvg;
      }
    }
  }
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const nav = document.getElementById('topbarNav');
  
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('mobile-menu__toggle--active');
      nav.classList.toggle('topbar__nav--open');
    });
    
    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('mobile-menu__toggle--active');
        nav.classList.remove('topbar__nav--open');
      });
    });
  }
}

// Initialize when DOM is ready
(function() {
  async function init() {
    await initI18n();
    initMobileMenu();
  }

  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready, run immediately
    init();
  }
})();
