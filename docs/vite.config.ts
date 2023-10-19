// vite.config.ts
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { MarkdownTransform } from './.vitepress/plugins/markdown-transform'
export default defineConfig({
  plugins: [vueJsx(), MarkdownTransform()],
})
