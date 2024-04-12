import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import da_common from './locales/da/common.json' assert { type: 'json' }
import en_common from './locales/en/common.json' assert { type: 'json' }


export const defaultNS = 'ns1'
export const resources = {
  da: {
    common: da_common,
  },
  en: {
    common: en_common
  }
} as const

i18next.use(initReactI18next).init({
  lng: 'da',
  fallbackLng: 'da',
  ns: ['common'],
  defaultNS,
  resources,
  debug: import.meta.env.DEV,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  saveMissing: true,
})

export default i18next