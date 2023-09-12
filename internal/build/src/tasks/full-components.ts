import path from 'path'
import { parallel } from 'gulp'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve' // 处理文件路径
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import vue from 'rollup-plugin-vue'

import { generateExternal, writeBundles } from '../utils/rollup'
import { hOutput, hRoot } from '../utils/paths'
import { target } from '../build-info'
import type { OutputOptions, Plugin } from 'rollup'

const buildFull = async () => {
  const plugins: Plugin[] = [
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    vue(),
    esbuild({
      exclude: [],
      sourceMap: true,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]

  // rollup 打包的配置信息
  const config = {
    input: path.resolve(hRoot, 'index.ts'), // 打包入口
    plugins,
    external: await generateExternal({ full: false }),
    treeshake: true,
  }
  const bundle = await rollup(config)

  const buildConfig = [
    {
      format: 'umd', // 打包的格式
      file: path.resolve(hOutput, 'index.js'),
      name: 'HMaterial', // 全局变量名字
      exports: 'named', // 导出的名字 用命名的方式导出 libaryTarget:"" name:""
      globals: {
        // 表示使用的vue是全局的
        vue: 'Vue',
      },
      sourcemap: true,
    },
    {
      format: 'esm',
      file: path.resolve(hOutput, 'index.esm.js'),
    },
  ]
  await writeBundles(bundle, buildConfig as OutputOptions[])
}

export const buildFullComponents = parallel(buildFull)
