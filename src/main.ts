import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/themes/cyberpunk.css'
import { neverMidnightEnabled } from './generator/settingRegistry'

import './styles/base.css'
import './styles/character-print.css'

if (neverMidnightEnabled) void import('./styles/themes/never-midnight.css')

createApp(App).use(createPinia()).use(router).mount('#app')
