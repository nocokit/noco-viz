import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/theme-variables.css'
import '@/assets/styles/main.css'
import '@/styles/dialog.css'
import '@/styles/page-layout.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import directives from './directives'
import { initTheme } from '@/config/themes'

// 初始化主题系统
initTheme()

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(Antd)
app.use(pinia)
app.use(router)
app.use(directives)
app.mount('#app')
