import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/themes/cyberpunk.css'
import './styles/themes/cyberpunk2077.css'
import './styles/base.css'
import './styles/character-print.css'

createApp(App).use(createPinia()).use(router).mount('#app')
