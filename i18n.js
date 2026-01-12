// Internationalization system
let currentLang = 'hu';
let translations = {};

// Translations embedded directly to avoid CORS issues
const translationsData = {
  hu: {
    "meta": {
      "title": "Bea & Gábor — Esküvő",
      "description": "Bea & Gábor esküvője — 2026.08.22. • Ceremónia 17:00 • Ünnepség 20:00 • Magic Harghita Resort"
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
      "lead": "Tartsatok velünk ezen a különleges napon, amikor hivatalosan is összekötjük az életünket!",
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
      "description": "Segíts nekünk a szervezésben egy gyors visszajelzéssel! Kérjük, jelezd felénk résztvételi szándékod, illetve ha van bármilyen ételérzékenységed:",
      "deadline": "Kérünk jelezz vissza az alábbi űrlapon vagy telefonon június 22-ig.",
      "button": "Megnyitom a Google űrlapot"
    },
    "location": {
      "title": "Helyszín",
      "description": "Az esküvő a <strong class=\"highlight\">Magic Harghita Resort</strong>ban lesz megtartva.",
      "detail": "Căpâlnița, jud. Harghita",
      "directions": "Így találtok meg a helyszint: Székelyudvarhely felől érkezve Kápolnásfalunál térjetek le balra a főútról. Innen egy 3 km-es út vezet át a mezőkön, egyenesen a Resort kapujáig.",
      "button": "Útvonaltervezés Google Maps-ben"
    },
    "accommodation": {
      "title": "Szállás",
      "price": "150 RON / fő",
      "description": "Amennyiben a helyszinen aludnátok, kérünk jelezzétek szándékotokat, a Magic Harghita Resort tud szállással szolgálni korlátozott számban. Minden további infót a szállásról itt találtok:",
      "button": "Tovább a szállás oldalára",
      "includes": "Benne van:",
      "breakfast": "reggeli / morzsa",
      "checkout": "Check‑out:",
      "checkoutTime": "másnap 12 óra"
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  en: {
    "meta": {
      "title": "Bea & Gábor — Wedding",
      "description": "Bea & Gábor's wedding — 2026.08.22. • Ceremony 17:00 • Celebration 20:00 • Magic Harghita Resort"
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
      "lead": "Join us on this special day when we officially unite our lives!",
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
      "description": "Help us with planning by sending a quick response! Please let us know your attendance intention and any dietary restrictions:",
      "deadline": "Please respond via the form below or by phone by June 22.",
      "button": "Open Google Form"
    },
    "location": {
      "title": "Location",
      "description": "The wedding will be held at <strong class=\"highlight\">Magic Harghita Resort</strong>.",
      "detail": "Căpâlnița, Harghita County",
      "directions": "How to find the venue: Coming from Odorheiu Secuiesc, turn left at Căpâlnița from the main road. From there, a 3 km road leads through the fields, straight to the Resort gate.",
      "button": "Get directions on Google Maps"
    },
    "accommodation": {
      "title": "Accommodation",
      "price": "150 RON / person",
      "description": "If you plan to stay at the venue, please let us know your intention, as Magic Harghita Resort can provide accommodation in limited numbers. Find all additional accommodation information here:",
      "button": "Go to accommodation page",
      "includes": "Included:",
      "breakfast": "breakfast / snack",
      "checkout": "Check-out:",
      "checkoutTime": "next day at 12"
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  ro: {
    "meta": {
      "title": "Bea & Gábor — Nuntă",
      "description": "Nunta lui Bea & Gábor — 2026.08.22. • Ceremonie 17:00 • Sărbătoare 20:00 • Magic Harghita Resort"
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
      "lead": "Alătură-te nouă în această zi specială când ne unim oficial viețile!",
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
      "description": "Ajută-ne cu planificarea trimitând un răspuns rapid! Te rugăm să ne anunți intenția de participare și orice restricții alimentare:",
      "deadline": "Te rugăm să răspunzi prin formularul de mai jos sau telefonic până pe 22 iunie.",
      "button": "Deschide formularul Google"
    },
    "location": {
      "title": "Locație",
      "description": "Nunta va avea loc la <strong class=\"highlight\">Magic Harghita Resort</strong>.",
      "detail": "Căpâlnița, jud. Harghita",
      "directions": "Cum să ajungi la locație: Venind din Odorheiu Secuiesc, virați la stânga la Căpâlnița de pe drumul principal. De acolo, un drum de 3 km duce prin câmpuri, direct la poarta Resort-ului.",
      "button": "Obține direcții pe Google Maps"
    },
    "accommodation": {
      "title": "Cazare",
      "price": "150 RON / persoană",
      "description": "Dacă intenționați să rămâneți la locație, vă rugăm să ne anunțați intenția, deoarece Magic Harghita Resort poate oferi cazare în număr limitat. Găsiți toate informațiile suplimentare despre cazare aici:",
      "button": "Mergi la pagina de cazare",
      "includes": "Inclus:",
      "breakfast": "mic dejun / gustare",
      "checkout": "Check-out:",
      "checkoutTime": "a doua zi la 12"
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
  
  // Load translation if not already loaded
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
  
  // Load all languages (now synchronous)
  loadTranslations('hu');
  loadTranslations('en');
  loadTranslations('ro');
  
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
  console.log('i18n.js loaded, DOM state:', document.readyState);
  
  async function init() {
    console.log('Initializing i18n...');
    await initI18n();
    initMobileMenu();
    console.log('i18n initialized');
  }

  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready, run immediately
    init();
  }
})();
