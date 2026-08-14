// Internationalization system
let currentLang = 'hu';
let translations = {};

// Translations embedded directly to avoid CORS issues
const translationsData = {
  hu: {
    "meta": {
      "title": "Bea & Gábor — Esküvő",
      "description": "Bea & Gábor... ahol a történetünk új fejezete kezdődik. — 2026.08.22. • Ceremónia 16:00 • Ünnepség 18:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Ugrás a tartalomra",
      "brand": "Bea & Gábor",
      "location": "Helyszínek",
      "accommodation": "Szállás",
      "seating": "Ültetés",
      "rsvp": "Visszajelzés",
      "calendar": "Mentés naptárba",
      "calendarShort": "Naptár"
    },
    "hero": {
      "date": "2026. augusztus 22.",
      "names": "Bea és Gábor",
      "subtitle": "... ahol a történetünk új fejezete kezdődik.",
      "lead": "Tartsatok velünk ezen a különleges napon, amikor a közös életünk egy új fejezetébe lépünk. Legyen ez a nap tele olyan megható, boldog, vidám és szeretettel teli emlékekkel, amelyek egy életen át elkísérnek minket az utunkon.",
      "ctaRsvp": "Visszajelzés",
      "ctaLocation": "Helyszínek"
    },
    "quickfacts": {
      "ceremony": "Ceremónia",
      "celebration": "Ünnepség",
      "location": "Helyszínek",
      "locationValue": "Belvárosi Református Templom",
      "locationDetail": "Székelyudvarhely • Magic Harghita Resort",
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
      "deadline": "Augusztus 1-ig kérünk jelezz vissza az alábbi űrlapon.",
      "button": "Megnyitom az űrlapot"
    },
    "location": {
      "title": "Helyszínek",
      "ceremonyTitle": "Ceremónia — 16:00",
      "ceremonyPlace": "Belvárosi Református Templom",
      "ceremonyDetail": "Székelyudvarhely",
      "ceremonyDirections": "A szertartásra a székelyudvarhelyi Belvárosi Református Templomban kerül sor, 16:00 órakor.",
      "ceremonyButton": "Útvonaltervezés a templomhoz",
      "loadMap": "Térkép betöltése",
      "celebrationTitle": "Ünnepség — 18:00",
      "celebrationPlace": "Magic Harghita Resort",
      "celebrationDetail": "Căpâlnița, jud. Harghita",
      "celebrationDirections": "Az ünnepségre a varázslatos Magic Harghita Resortban kerül sor, amely az erdő mélyén, egy csendes tisztáson vár ránk. Székelyudvarhely felől érkezve Kápolnásfalunál kell letérni balra a főútról. Onnan egy 3 km-es út vezet át a tisztáson, egyenesen a Resort kapujáig, ahol parkolási lehetőség is van.",
      "celebrationButton": "Útvonal a Resorthoz",
      "travelButton": "Megnyitom az űrlapot"
    },
    "route": {
      "stop1": "Magyarvalkó",
      "stop2": "Kolozsvár",
      "stop3": "Székelyudvarhely",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Szállás",
      "limited": "A Resortban a helyek száma korlátozott, amit elsősorban a családtagjaink számára tartjuk fenn.",
      "costs": "Ha augusztus 1-ig visszajelzel, tudunk szálláshelyet ajánlani saját költségre a közeli Kápolnásfaluban.",
      "moreDetails": "Ha szükséged van szállás elérhetőségre, kérjük, ezt az alábbi űrlapon jelezd felénk",
      "button": "Megnyitom az űrlapot"
    },
    "poll": {
      "title": "Tippjáték",
      "answered": "megtippelve",
      "yourPick": "a te tipped",
      "leading": "vezet",
      "allDone": "Minden tipp leadva. Augusztus 22-én kiderül.",
      "intro": "Nyolc kérdés a nagy napról. Válaszd ki a neved, tippelj, aztán nézd meg, mit gondolnak a többiek. Tippenként egy válasz, és nincs visszaút.",
      "namePrompt": "Kezdd el beírni a neved",
      "namePlaceholder": "Név…",
      "noMatch": "Nincs ilyen név a vendéglistán.",
      "notYou": "Nem te vagy?",
      "greeting": "Szia",
      "locked": "A tipped rögzítve.",
      "votes": "tipp",
      "error": "Nem sikerült elküldeni. Próbáld újra.",
      "retry": "Újra",
      "loading": "Töltés…",
      "questions": [
        {
          "id": "q1",
          "text": "Ki sír először a ceremónián?",
          "options": [
            {
              "id": "a",
              "text": "A vőlegény"
            },
            {
              "id": "b",
              "text": "A menyasszony"
            },
            {
              "id": "c",
              "text": "Az anyukák"
            },
            {
              "id": "d",
              "text": "Senki"
            }
          ]
        },
        {
          "id": "q2",
          "text": "Mikor megy haza az utolsó vendég?",
          "options": [
            {
              "id": "a",
              "text": "Éjfél előtt"
            },
            {
              "id": "b",
              "text": "01:00 és 03:00 között"
            },
            {
              "id": "c",
              "text": "03:00 és 05:00 között"
            },
            {
              "id": "d",
              "text": "Napfelkelte után"
            }
          ]
        },
        {
          "id": "q3",
          "text": "Mennyit késik a ceremónia kezdete?",
          "options": [
            {
              "id": "a",
              "text": "Pontosan kezdődik"
            },
            {
              "id": "b",
              "text": "1–10 percet"
            },
            {
              "id": "c",
              "text": "11–30 percet"
            },
            {
              "id": "d",
              "text": "Több mint fél órát"
            }
          ]
        },
        {
          "id": "q4",
          "text": "Ki mondja a leghosszabb pohárköszöntőt?",
          "options": [
            {
              "id": "a",
              "text": "A násznagy"
            },
            {
              "id": "b",
              "text": "Az egyik apuka"
            },
            {
              "id": "c",
              "text": "Egy tanú"
            },
            {
              "id": "d",
              "text": "A vőlegény"
            }
          ]
        },
        {
          "id": "q5",
          "text": "Ki marad utoljára a táncparketten?",
          "options": [
            {
              "id": "a",
              "text": "A vőlegény"
            },
            {
              "id": "b",
              "text": "A menyasszony"
            },
            {
              "id": "c",
              "text": "A tanúk"
            },
            {
              "id": "d",
              "text": "Egy nagyszülő"
            }
          ]
        },
        {
          "id": "q6",
          "text": "Melyik zenére táncol a legtöbb ember?",
          "options": [
            {
              "id": "a",
              "text": "Mulatós"
            },
            {
              "id": "b",
              "text": "A 2000-es évek slágerei"
            },
            {
              "id": "c",
              "text": "Lassú, romantikus"
            },
            {
              "id": "d",
              "text": "Modern pop"
            }
          ]
        },
        {
          "id": "q7",
          "text": "Hány tányér tortát esznek meg a vendégek?",
          "options": [
            {
              "id": "a",
              "text": "Kevesebbet, mint amennyi van"
            },
            {
              "id": "b",
              "text": "Pont annyit"
            },
            {
              "id": "c",
              "text": "Mindet, és kérnek még"
            },
            {
              "id": "d",
              "text": "Marad reggelire is"
            }
          ]
        },
        {
          "id": "q8",
          "text": "Ki kapja el a menyasszonyi csokrot?",
          "options": [
            {
              "id": "a",
              "text": "Egy egyedülálló barátnő"
            },
            {
              "id": "b",
              "text": "Egy rokon"
            },
            {
              "id": "c",
              "text": "Valaki, aki már foglalt"
            },
            {
              "id": "d",
              "text": "Senki nem kapja el"
            }
          ]
        }
      ]
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  en: {
    "meta": {
      "title": "Bea & Gábor — Wedding",
      "description": "Bea & Gábor's wedding — 2026.08.22. • Ceremony 16:00 • Celebration 18:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Skip to content",
      "brand": "Bea & Gábor",
      "location": "Locations",
      "accommodation": "Accommodation",
      "seating": "Seating",
      "rsvp": "RSVP",
      "calendar": "Save the date",
      "calendarShort": "Calendar"
    },
    "hero": {
      "date": "August 22, 2026",
      "names": "Bea and Gábor",
      "subtitle": "... where a new chapter of our story begins.",
      "lead": "Join us on this special day as we step into a new chapter of our life together. May this day be filled with touching, joyful, happy, and love-filled memories that will accompany us throughout our journey.",
      "ctaRsvp": "RSVP",
      "ctaLocation": "Locations"
    },
    "quickfacts": {
      "ceremony": "Ceremony",
      "celebration": "Celebration",
      "location": "Locations",
      "locationValue": "Reformed Church",
      "locationDetail": "Odorheiu Secuiesc • Magic Harghita Resort",
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
      "deadline": "Please respond via the form below by August 1.",
      "button": "Open form"
    },
    "location": {
      "title": "Locations",
      "ceremonyTitle": "Ceremony — 16:00",
      "ceremonyPlace": "Reformed Church (Downtown)",
      "ceremonyDetail": "Odorheiu Secuiesc",
      "ceremonyDirections": "The ceremony will take place at the Reformed Church in downtown Odorheiu Secuiesc at 16:00.",
      "ceremonyButton": "Directions to the church",
      "loadMap": "Load map",
      "celebrationTitle": "Celebration — 18:00",
      "celebrationPlace": "Magic Harghita Resort",
      "celebrationDetail": "Căpâlnița, Harghita County",
      "celebrationDirections": "The celebration will take place at the magical Magic Harghita Resort, which awaits us deep in the forest, on a quiet clearing. Coming from Odorheiu Secuiesc, turn left at Căpâlnița from the main road. From there, a 3 km road leads through the clearing, straight to the Resort gate where parking is also available.",
      "celebrationButton": "Directions to the Resort",
      "travelButton": "Open form"
    },
    "route": {
      "stop1": "Văleni (Călățele)",
      "stop2": "Cluj-Napoca",
      "stop3": "Odorheiu Secuiesc",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Accommodation",
      "limited": "The number of places at the Resort is limited, and we reserve them primarily for our family members.",
      "costs": "If you send us your feedback by August 1, we can recommend accommodation at your own expense in the nearby village of Căpâlnița.",
      "moreDetails": "If you need accommodation contact details, please let us know via the form below",
      "button": "Open form"
    },
    "poll": {
      "title": "Predictions",
      "answered": "answered",
      "yourPick": "your pick",
      "leading": "leading",
      "allDone": "All guesses are in. We find out on 22 August.",
      "intro": "Eight questions about the big day. Pick your name, place your guesses, then see what everyone else thinks. One answer per question, and no going back.",
      "namePrompt": "Start typing your name",
      "namePlaceholder": "Name…",
      "noMatch": "No such name on the guest list.",
      "notYou": "Not you?",
      "greeting": "Hi",
      "locked": "Your guess is locked in.",
      "votes": "votes",
      "error": "Could not send that. Please try again.",
      "retry": "Retry",
      "loading": "Loading…",
      "questions": [
        {
          "id": "q1",
          "text": "Who cries first at the ceremony?",
          "options": [
            {
              "id": "a",
              "text": "The groom"
            },
            {
              "id": "b",
              "text": "The bride"
            },
            {
              "id": "c",
              "text": "The mothers"
            },
            {
              "id": "d",
              "text": "Nobody"
            }
          ]
        },
        {
          "id": "q2",
          "text": "When does the last guest go home?",
          "options": [
            {
              "id": "a",
              "text": "Before midnight"
            },
            {
              "id": "b",
              "text": "Between 1am and 3am"
            },
            {
              "id": "c",
              "text": "Between 3am and 5am"
            },
            {
              "id": "d",
              "text": "After sunrise"
            }
          ]
        },
        {
          "id": "q3",
          "text": "How late does the ceremony start?",
          "options": [
            {
              "id": "a",
              "text": "Right on time"
            },
            {
              "id": "b",
              "text": "1–10 minutes"
            },
            {
              "id": "c",
              "text": "11–30 minutes"
            },
            {
              "id": "d",
              "text": "More than half an hour"
            }
          ]
        },
        {
          "id": "q4",
          "text": "Who gives the longest toast?",
          "options": [
            {
              "id": "a",
              "text": "The master of ceremonies"
            },
            {
              "id": "b",
              "text": "One of the fathers"
            },
            {
              "id": "c",
              "text": "A witness"
            },
            {
              "id": "d",
              "text": "The groom"
            }
          ]
        },
        {
          "id": "q5",
          "text": "Who is last to leave the dance floor?",
          "options": [
            {
              "id": "a",
              "text": "The groom"
            },
            {
              "id": "b",
              "text": "The bride"
            },
            {
              "id": "c",
              "text": "The witnesses"
            },
            {
              "id": "d",
              "text": "A grandparent"
            }
          ]
        },
        {
          "id": "q6",
          "text": "Which music fills the dance floor?",
          "options": [
            {
              "id": "a",
              "text": "Hungarian party classics"
            },
            {
              "id": "b",
              "text": "2000s hits"
            },
            {
              "id": "c",
              "text": "Slow and romantic"
            },
            {
              "id": "d",
              "text": "Modern pop"
            }
          ]
        },
        {
          "id": "q7",
          "text": "How much of the cake gets eaten?",
          "options": [
            {
              "id": "a",
              "text": "Less than there is"
            },
            {
              "id": "b",
              "text": "Exactly all of it"
            },
            {
              "id": "c",
              "text": "All of it, and they ask for more"
            },
            {
              "id": "d",
              "text": "There is some left for breakfast"
            }
          ]
        },
        {
          "id": "q8",
          "text": "Who catches the bouquet?",
          "options": [
            {
              "id": "a",
              "text": "A single friend"
            },
            {
              "id": "b",
              "text": "A relative"
            },
            {
              "id": "c",
              "text": "Someone already taken"
            },
            {
              "id": "d",
              "text": "Nobody catches it"
            }
          ]
        }
      ]
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  },
  ro: {
    "meta": {
      "title": "Bea & Gábor — Nuntă",
      "description": "Nunta lui Bea & Gábor — 2026.08.22. • Ceremonie 16:00 • Sărbătoare 18:00 • Magic Harghita Resort"
    },
    "nav": {
      "skipLink": "Sari la conținut",
      "brand": "Bea & Gábor",
      "location": "Locații",
      "accommodation": "Cazare",
      "seating": "Așezare",
      "rsvp": "Confirmare",
      "calendar": "Salvează data",
      "calendarShort": "Calendar"
    },
    "hero": {
      "date": "22 august 2026",
      "names": "Bea și Gábor",
      "subtitle": "... unde începe un nou capitol al poveștii noastre.",
      "lead": "Alătură-te nouă în această zi specială când intrăm într-un nou capitol al vieții noastre comune. Fie ca această zi să fie plină de amintiri emoționante, fericite, vesele și pline de dragoste care ne vor însoți pe tot parcursul călătoriei noastre.",
      "ctaRsvp": "Confirmare",
      "ctaLocation": "Locații"
    },
    "quickfacts": {
      "ceremony": "Ceremonie",
      "celebration": "Sărbătoare",
      "location": "Locații",
      "locationValue": "Biserica Reformată",
      "locationDetail": "Odorheiu Secuiesc • Magic Harghita Resort",
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
      "deadline": "Te rugăm să răspunzi prin formularul de mai jos până pe 1 august.",
      "button": "Deschide formularul"
    },
    "location": {
      "title": "Locații",
      "ceremonyTitle": "Ceremonie — 16:00",
      "ceremonyPlace": "Biserica Reformată (Centru)",
      "ceremonyDetail": "Odorheiu Secuiesc",
      "ceremonyDirections": "Ceremonia va avea loc la Biserica Reformată din centrul orașului Odorheiu Secuiesc, la ora 16:00.",
      "ceremonyButton": "Direcții către biserică",
      "loadMap": "Încarcă harta",
      "celebrationTitle": "Sărbătoare — 18:00",
      "celebrationPlace": "Magic Harghita Resort",
      "celebrationDetail": "Căpâlnița, jud. Harghita",
      "celebrationDirections": "Sărbătoarea va avea loc la minunatul Magic Harghita Resort, care ne așteaptă adânc în pădure, pe o poiană liniștită. Venind din Odorheiu Secuiesc, virați la stânga la Căpâlnița de pe drumul principal. De acolo, un drum de 3 km duce prin poiană, direct la poarta Resort-ului unde este disponibil și parcare.",
      "celebrationButton": "Direcții către Resort",
      "travelButton": "Deschide formularul"
    },
    "route": {
      "stop1": "Văleni (Călățele)",
      "stop2": "Cluj-Napoca",
      "stop3": "Odorheiu Secuiesc",
      "stop4": "Magic Harghita Resort"
    },
    "accommodation": {
      "title": "Cazare",
      "limited": "Numărul de locuri la Resort este limitat, iar acestea sunt rezervate în principal membrilor familiei noastre.",
      "costs": "Dacă ne trimiți răspunsul până la 1 august, îți putem recomanda cazare pe cheltuială proprie în apropiere, în satul Căpâlnița.",
      "moreDetails": "Dacă ai nevoie de datele de contact pentru cazare, te rugăm să ne anunți prin formularul de mai jos",
      "button": "Deschide formularul"
    },
    "poll": {
      "title": "Joc de predicții",
      "answered": "răspunse",
      "yourPick": "alegerea ta",
      "leading": "conduce",
      "allDone": "Toate răspunsurile au fost trimise. Aflăm pe 22 august.",
      "intro": "Opt întrebări despre ziua cea mare. Alege-ți numele, ghicește, apoi vezi ce cred ceilalți. Un răspuns per întrebare și fără cale de întoarcere.",
      "namePrompt": "Începe să îți scrii numele",
      "namePlaceholder": "Nume…",
      "noMatch": "Nu există acest nume pe lista invitaților.",
      "notYou": "Nu ești tu?",
      "greeting": "Salut",
      "locked": "Răspunsul tău a fost înregistrat.",
      "votes": "voturi",
      "error": "Nu am putut trimite. Încearcă din nou.",
      "retry": "Din nou",
      "loading": "Se încarcă…",
      "questions": [
        {
          "id": "q1",
          "text": "Cine plânge primul la ceremonie?",
          "options": [
            {
              "id": "a",
              "text": "Mirele"
            },
            {
              "id": "b",
              "text": "Mireasa"
            },
            {
              "id": "c",
              "text": "Mamele"
            },
            {
              "id": "d",
              "text": "Nimeni"
            }
          ]
        },
        {
          "id": "q2",
          "text": "Când pleacă acasă ultimul invitat?",
          "options": [
            {
              "id": "a",
              "text": "Înainte de miezul nopții"
            },
            {
              "id": "b",
              "text": "Între 01:00 și 03:00"
            },
            {
              "id": "c",
              "text": "Între 03:00 și 05:00"
            },
            {
              "id": "d",
              "text": "După răsărit"
            }
          ]
        },
        {
          "id": "q3",
          "text": "Cu cât întârzie începutul ceremoniei?",
          "options": [
            {
              "id": "a",
              "text": "Începe la fix"
            },
            {
              "id": "b",
              "text": "1–10 minute"
            },
            {
              "id": "c",
              "text": "11–30 de minute"
            },
            {
              "id": "d",
              "text": "Peste o jumătate de oră"
            }
          ]
        },
        {
          "id": "q4",
          "text": "Cine ține cel mai lung toast?",
          "options": [
            {
              "id": "a",
              "text": "Nașul"
            },
            {
              "id": "b",
              "text": "Unul dintre tați"
            },
            {
              "id": "c",
              "text": "Un martor"
            },
            {
              "id": "d",
              "text": "Mirele"
            }
          ]
        },
        {
          "id": "q5",
          "text": "Cine rămâne ultimul pe ringul de dans?",
          "options": [
            {
              "id": "a",
              "text": "Mirele"
            },
            {
              "id": "b",
              "text": "Mireasa"
            },
            {
              "id": "c",
              "text": "Martorii"
            },
            {
              "id": "d",
              "text": "Un bunic"
            }
          ]
        },
        {
          "id": "q6",
          "text": "Pe ce muzică dansează cei mai mulți?",
          "options": [
            {
              "id": "a",
              "text": "Muzică populară maghiară"
            },
            {
              "id": "b",
              "text": "Hituri din anii 2000"
            },
            {
              "id": "c",
              "text": "Lent și romantic"
            },
            {
              "id": "d",
              "text": "Pop modern"
            }
          ]
        },
        {
          "id": "q7",
          "text": "Cât din tort se mănâncă?",
          "options": [
            {
              "id": "a",
              "text": "Mai puțin decât este"
            },
            {
              "id": "b",
              "text": "Exact tot"
            },
            {
              "id": "c",
              "text": "Tot, și mai cer"
            },
            {
              "id": "d",
              "text": "Rămâne și pentru micul dejun"
            }
          ]
        },
        {
          "id": "q8",
          "text": "Cine prinde buchetul miresei?",
          "options": [
            {
              "id": "a",
              "text": "O prietenă necăsătorită"
            },
            {
              "id": "b",
              "text": "O rudă"
            },
            {
              "id": "c",
              "text": "Cineva deja într-o relație"
            },
            {
              "id": "d",
              "text": "Nimeni nu îl prinde"
            }
          ]
        }
      ]
    },
    "footer": {
      "text": "Bea & Gábor • 2026.08.22."
    }
  }
};

const HUNGARIAN_FORM_URL = 'https://forms.gle/hxEey31YVZisD2sk6';
const ENGLISH_FORM_URL = 'https://forms.gle/MoJnAV8i195JRtkN8';

function getFormUrl(lang) {
  return lang === 'hu' ? HUNGARIAN_FORM_URL : ENGLISH_FORM_URL;
}

function updateFormLinks(lang) {
  const formUrl = getFormUrl(lang);

  ['rsvpFormLink', 'accommodationFormLink'].forEach(id => {
    const link = document.getElementById(id);
    if (link) {
      link.href = formUrl;
    }
  });
}

// Load translations (now just assign from embedded data)
function loadTranslations(lang) {
  if (translationsData[lang]) {
    translations[lang] = translationsData[lang];
    return translations[lang];
  }
  return null;
}

// The poll page needs whole objects, not strings, so t() cannot serve it.
window.getPoll = function getPoll(lang) {
  return (translationsData[lang] || translationsData.hu).poll;
};

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
  
  // Update form links based on language
  updateFormLinks(lang);
}

// Initialize
async function initI18n() {
  // Get saved language or default to Hungarian
  const savedLang = localStorage.getItem('preferredLang') || 'hu';
  
  // Load only the initial language first (lazy load others when needed)
  loadTranslations(savedLang);
  
  // Set initial language
  await updateTranslations(savedLang);
    
    updateFormLinks(savedLang);
  
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
