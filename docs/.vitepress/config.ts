import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    link: '/guide/',
  },
  {
    text: '组件',
    link: '/components/',
  },
]

const sidebar: DefaultTheme.Sidebar = {
  '/guide': [
    {
      text: '基础',
      items: [
        { text: '设计', link: '/guide/' },
        { text: '导航', link: '/guide/' },
        { text: '安装', link: '/guide/' },
        { text: '快速开始', link: '/guide/' },
      ],
    },
  ],
  '/components': [
    {
      text: 'Basic基础组件',
      items: [
        { text: '组件1', link: '/components/' },
        { text: '组件2', link: '/components/' },
      ],
    },
  ],
}

export default defineConfig({
  title: `H Material`,
  description: 'a Vue 3 based component library for designers and developers',
  lang: 'cn-ZH',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'H Material',
    outline: 10,
    nav,
    sidebar,
  },
})
