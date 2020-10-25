import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cache from 'i18next-localstorage-cache'
import Backend from 'i18next-xhr-backend';


i18n
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  .use(Cache)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    lng: 'en',
    fallbackLng: 'en',
    whitelist: ['en', 'de'],
    Cache: {
      enabled: true,
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;