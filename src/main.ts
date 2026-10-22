import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/themes/cyberpunk.css'
import { neverMidnightEnabled } from './generator/settingRegistry'

import './styles/base.css'
import './styles/character-print.css'

const app = createApp(App).use(createPinia()).use(router)

Promise.all([
  router.isReady(),
  neverMidnightEnabled ? import('./styles/themes/never-midnight.css') : undefined,
]).then(() => app.mount('#app'))
