import { createApp } from 'vue'
import WIcon from '@h-material/components/icon'
import App from './app.example.vue'
import '@h-material/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(WIcon)
app.mount('#app')
