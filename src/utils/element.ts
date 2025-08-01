import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { type App } from 'vue'

export function useElementPlus(app: App<Element>) {
  // 注册 ElementPlusIcons 组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

// 设置 Element Plus 命名空间以支持 CSS 变量
export function setElementPlusNamespace() {
  // Element Plus 会自动检测 html.dark 类来应用暗色主题
  const html = document.documentElement
  
  // 监听 dark 类的变化，确保 Element Plus 组件正确应用主题
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = html.classList.contains('dark')
        // 触发 Element Plus 主题更新
        html.style.setProperty('--el-color-primary', isDark ? '#ff4d6d' : '#ff2e4d')
      }
    })
  })
  
  observer.observe(html, {
    attributes: true,
    attributeFilter: ['class']
  })
}
