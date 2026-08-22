import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'sr' | 'en';

export const translations = {
  sr: {
    nav: {
      explore: 'Istraži',
      saved: 'Sačuvano',
      host: 'Objavi ponudu',
      signIn: 'Prijava',
      signUp: 'Registracija',
    },
    home: {
      hero: {
        badge: 'Srbija · teren',
        title: 'Ture, bicikli i kvadovi. Direktno sa terena.',
        subtitle: 'Vodiči, izdavači mountain bike-ova i kvadova, rafting i kamp — bez posrednika.',
        placeholder: 'Tara, Zlatibor, kvad, rafting…',
        search: 'Traži',
      },
      categories: {
        label: 'Šta tražiš',
        title: 'Kategorije',
      },
      featured: {
        label: 'Izbor',
        title: 'Istaknute ture',
        viewAll: 'Sve ponude',
      },
      howIt: {
        label: 'Kako radi',
        title: 'Nema posrednika. Dogovor je sa čovekom na terenu.',
        steps: [
          {
            title: 'Pronađi',
            body: 'Filtriraj ture, bicikle, kvadove i kamp po regionu i težini.',
          },
          {
            title: 'Javi se',
            body: 'Pozovi ili pošalji SMS vodiču. Termin i cena idu direktno.',
          },
          {
            title: 'Izađi',
            body: 'Sastanak na dogovorenoj tački. Oprema i staza su njihov posao.',
          },
        ],
      },
      regions: {
        title: 'Regioni',
        subtitle: 'Od Tare i Zlatibora do Đerdapa. Lokalni vodiči, ne buses sa zastavicama.',
      },
      forHosts: {
        badge: 'Za vodiče',
        title: 'Imaš ture, kvadove ili bicikle?',
        subtitle: 'Objavi ponudu. Ljudi te nađu po regionu i kategoriji, pa ti se jave direktno.',
        cta: 'Objavi ponudu',
      },
    },
    explore: {
      title: 'Istraži',
      noResults: 'Nema rezultata',
      filters: {
        category: 'Kategorija',
        region: 'Region',
        difficulty: 'Težina',
      },
    },
    listing: {
      contact: 'Kontaktiraj',
      save: 'Sačuvaj',
      saved: 'Sačuvano',
      unsave: 'Uklonji',
      price: 'Cena',
      duration: 'Trajanje',
      groupSize: 'Broj ljudi',
      difficulty: 'Težina',
      equipment: 'Oprema',
      guide: 'Vodič',
      description: 'Opis',
    },
    footer: {
      about: 'O nama',
      contact: 'Kontakt',
      privacy: 'Privatnost',
      terms: 'Uslovi',
      copyright: '© 2024 Staza. Sva prava zadržana.',
    },
  },
  en: {
    nav: {
      explore: 'Explore',
      saved: 'Saved',
      host: 'Post an offer',
      signIn: 'Sign in',
      signUp: 'Sign up',
    },
    home: {
      hero: {
        badge: 'Serbia · outdoors',
        title: 'Tours, bikes and quads. Direct from the ground.',
        subtitle: 'Guides, mountain bike and ATV rentals, rafting and camping — no middleman.',
        placeholder: 'Tara, Zlatibor, ATV, rafting…',
        search: 'Search',
      },
      categories: {
        label: 'What are you looking for',
        title: 'Categories',
      },
      featured: {
        label: 'Featured',
        title: 'Featured tours',
        viewAll: 'View all',
      },
      howIt: {
        label: 'How it works',
        title: 'No middleman. The deal is with the person on the ground.',
        steps: [
          {
            title: 'Find',
            body: 'Filter tours, bikes, quads and camps by region and difficulty.',
          },
          {
            title: 'Reach out',
            body: 'Call or text the guide. The date and price are negotiated directly.',
          },
          {
            title: 'Go out',
            body: 'Meet at an agreed point. Equipment and trail knowledge are their job.',
          },
        ],
      },
      regions: {
        title: 'Regions',
        subtitle: 'From Tara and Zlatibor to Đerdap. Local guides, not tour buses.',
      },
      forHosts: {
        badge: 'For guides',
        title: 'Have tours, quads or bikes?',
        subtitle: 'Post an offer. People find you by region and category, and contact you directly.',
        cta: 'Post an offer',
      },
    },
    explore: {
      title: 'Explore',
      noResults: 'No results',
      filters: {
        category: 'Category',
        region: 'Region',
        difficulty: 'Difficulty',
      },
    },
    listing: {
      contact: 'Contact',
      save: 'Save',
      saved: 'Saved',
      unsave: 'Remove',
      price: 'Price',
      duration: 'Duration',
      groupSize: 'Group size',
      difficulty: 'Difficulty',
      equipment: 'Equipment',
      guide: 'Guide',
      description: 'Description',
    },
    footer: {
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      copyright: '© 2024 Staza. All rights reserved.',
    },
  },
} as const;

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'sr',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string) => {
        const { language } = get();
        const keys = key.split('.');
        let value: any = translations[language];
        
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k as keyof typeof value];
          } else {
            return key;
          }
        }
        
        return typeof value === 'string' ? value : key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
