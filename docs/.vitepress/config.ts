import { defineConfig } from 'vitepress'
import { sidebars } from './config/sidebars'
import type { DefaultTheme } from 'vitepress'

const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    link: '/guide/installation',
  },
  {
    text: '组件',
    link: '/components/button',
  },
]

export default defineConfig({
  title: `H Material`,
  description: 'a Vue 3 based component library for designers and developers',
  lang: 'cn-ZH',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'H Material',
    outline: 10,
    nav,
    sidebar: sidebars,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Huuuuug/H-Material' },
    ],
  },
})
