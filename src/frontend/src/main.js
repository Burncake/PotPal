import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import router from './router'
// import * as mdb from 'mdb-ui-kit'
// window.mdb = mdb
// import 'mdb-ui-kit/css/mdb.min.css'
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
