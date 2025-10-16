import { createI18n } from 'vue-i18n'
import enUs from './locales/en-us'
import csCz from './locales/cs-cz'

const messages = {
  enUs,
  csCz,
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
