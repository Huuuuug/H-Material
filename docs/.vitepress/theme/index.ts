import HMaterial from 'h-material'
import ElementPlus from 'element-plus'
import DefaultTheme from 'vitepress/theme'
import 'element-plus/dist/index.css'
import 'h-material/theme-chalk/css/index.css'
import { VPDemo } from '../vitepress'
import type { Theme } from 'vitepress'

export const define = <T>(value: T): T => value

export default define<Theme>({
  ...DefaultTheme,
  enhanceApp: ({ app }) => {
    app.use(HMaterial)
    // 注册ElementPlus
    app.use(ElementPlus)
    app.component('Demo', VPDemo)
  },
})
