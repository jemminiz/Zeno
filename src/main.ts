import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './tailwind.css'

const app = createApp(App)

// Setup Pinia for global stores
const pinia = createPinia()
app.use(pinia)

// Setup Vue Router
app.use(router)

// Mount the app
app.mount('#app')