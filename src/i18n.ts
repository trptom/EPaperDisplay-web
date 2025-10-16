import { createI18n } from 'vue-i18n'
import enUs from './locales/en-us'
import csCz from './locales/cs-cz'

// Canonical locale codes we support in the app
const SUPPORTED_LOCALES = ['en', 'cs'] as const

const messages = {
  en: enUs,
  cs: csCz,
}

function detectInitialLocale(): string {
  try {
    // 1) saved preference
    const saved = localStorage.getItem('locale')
    if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
      return saved
    }

    // 2) browser preference
    const nav = (navigator.languages && navigator.languages[0]) || navigator.language || ''
    const code = nav.toLowerCase()
    if (code.startsWith('cs')) {
      return 'cs'
    }
    if (code.startsWith('en')) {
      return 'en'
    }
  } catch {
    // ignore (e.g., during SSR or locked down env)
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n
