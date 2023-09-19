import HMaterial from 'h-material'
import DefaultTheme from 'vitepress/theme'
import 'h-material/theme-chalk/css/index.css'
import type { Theme } from 'vitepress'

export const define = <T>(value: T): T => value

export default define<Theme>({
  ...DefaultTheme,
  enhanceApp: ({ app }) => {
    app.use(HMaterial)

    // globals.forEach(([name, Comp]) => {
    //   app.component(name, Comp)
    // })
  },
})
