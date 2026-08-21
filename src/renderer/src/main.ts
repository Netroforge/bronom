import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles.css'
import { createBronomI18n } from './i18n.js'
import { useSettingsStore } from './stores/settings.js'

const initialSettingsState = await window.bronomSettings.getRendererState()
const pinia = createPinia()
const settingsStore = useSettingsStore(pinia)
settingsStore.hydrate(initialSettingsState)
const i18n = createBronomI18n(initialSettingsState.resolvedLocale)

function applyDocumentLocale(locale: import('../../shared/locale.js').SupportedLocale): void {
  document.documentElement.lang = locale
  document.documentElement.dir = 'ltr'
  i18n.global.locale.value = locale
}

applyDocumentLocale(initialSettingsState.resolvedLocale)
watch(() => settingsStore.resolvedLocale, applyDocumentLocale)

const app = createApp(App)
app.use(pinia)
app.use(i18n)
await settingsStore.initialize()
app.mount('#app')
