// import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { type App } from 'vue'

export function useElementPlus(app: App<Element>) {
  // 注册 ElementPlusIcons 组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 注册 ElementPlus
  // app.use(ElementPlus)
}
