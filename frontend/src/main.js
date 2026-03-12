import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import directives from './directives'
import i18n from './i18n'

const app = createApp(App)

app.use(Antd)
app.use(pinia)
app.use(router)
app.use(directives)
app.use(i18n)
app.mount('#app')
