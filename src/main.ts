import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/themes/cyberpunk.css'
import './styles/base.css'

createApp(App).use(router).mount('#app')
