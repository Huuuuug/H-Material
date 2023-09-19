import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
// import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { excludeFiles } from '@h-material/build-utils'
import { hRoot, pkgRoot } from '../utils/paths'
import { buildConfigEntries } from '../build-info'
import { generateExternal, writeBundles } from '../utils/rollup'
import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }), // 排除第三方的包，不要将第三方的代码打进包里
    treeshake: false,
  })
  await writeBundles(
    bundle,
    // 打成esm模块和cjs模块
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        // amd, cjs, es, iife, umd, system
        format: config.format,
        // 打包到指定目录
        dir: config.output.path,
        // 导出方式，仅针对cjs
        exports: module === 'cjs' ? 'named' : undefined,
        // 保持原有目录结构
        preserveModules: true,
        // 将原有结构这个目录下的文件放到根目录dir下
        preserveModulesRoot: hRoot,
        // 是否生成sourceMap
        sourcemap: true,
        // 文件名
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
