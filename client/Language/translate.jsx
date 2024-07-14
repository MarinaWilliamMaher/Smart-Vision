import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations1 from './en.json';
import arTranslations1 from './ar.json';
import enTranslations2 from './en1.json';
import arTranslations2 from './ar1.json';
import arTranslationsD from './arD.json';
import enTranslationsD from './enD.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: { 
          ...enTranslations1,
          ...enTranslations2,
          ...enTranslationsD
        }
      },
      ar: { 
        translation: { 
          ...arTranslations1,
          ...arTranslations2,
          ...arTranslationsD
        }
      },
    },
    debugger:true,
    lng: 'en',
    fallbackLng: 'en', // Default language if translation not available
    interpolation: {
        escapeValue: false, // React already escapes values
      },
      react: {
        useSuspense: false, // Set to true if you're using Suspense
      },
  });

export default i18n;
