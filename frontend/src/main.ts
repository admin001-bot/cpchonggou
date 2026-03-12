import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { useLoadingStore } from './stores/loading'
import { useToastStore } from './stores/toast'

const app = createApp(App)
const pinia = createPinia()

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化 loading store 并绑定到 router
const loadingStore = useLoadingStore(pinia)
;(router as any).__loadingStore = loadingStore

// 初始化 toast store 并绑定到 router
const toastStore = useToastStore(pinia)
;(router as any).__toastStore = toastStore

app.mount('#app')
