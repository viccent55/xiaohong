import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import { useElementPlus } from '@/utils/element'
import Heart from './components/global/Heart.vue'

// mock
import '@/mock'

const app = createApp(App)

useElementPlus(app)

app.component('Heart', Heart)

app.use(createPinia())
app.use(router)
app.mount('#app')
