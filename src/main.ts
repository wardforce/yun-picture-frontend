import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { DatePicker } from 'ant-design-vue'
import '@/accesss.ts'
import 'vue-cropper/dist/index.css'

const app = createApp(App)
app.use(DatePicker)
app.use(createPinia())
app.use(router)
app.mount('#app')
