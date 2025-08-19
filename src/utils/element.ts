import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Function to install Element Plus and register icons
export function setupElementPlus(app: App<Element>) {
  // Install Element Plus UI components
  app.use(ElementPlus)

  // Register all Element Plus icons globally
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // Setup dark mode CSS variable watcher
  const html = document.documentElement
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = html.classList.contains('dark')
        html.style.setProperty('--el-color-primary', isDark ? '#ff4d6d' : '#ff2e4d')
      }
    })
  })
  observer.observe(html, {
    attributes: true,
    attributeFilter: ['class']
  })
}
