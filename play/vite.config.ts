import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import defineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig({
  plugins: [vue(), defineOptions()],
})
