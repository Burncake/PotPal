import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router'

// import * as mdb from 'mdb-ui-kit'
// window.mdb = mdb
// import 'mdb-ui-kit/css/mdb.min.css'
const app = createApp(App)
app.config.globalProperties.$currentSection;

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast)

app.mount('#app')
