import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-xhr-backend'

let lng
if (localStorage.getItem('cr_lang') !== null) {
  lng = localStorage.getItem('cr_lang')
} else {
  lng = 'en'
}

i18n
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    lng,
    nsSeparator: false,
    keySeparator: false,
    fallbackLng: false,
    whitelist: ['en', 'de'],
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
