import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import Esbuild from 'rollup-plugin-esbuild'
import { compRoot, hRoot } from '../utils/paths'
import { buildConfigEntries } from '../buildConfig'
import { generateExternal, writeBundles } from '../utils/rollup'
import type { OutputOptions } from 'rollup'

export const buildComponents = async () => {
  const bundle = await rollup({
    input: compRoot,
    plugins: [
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      vue(),
      Esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: hRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
