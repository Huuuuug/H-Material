import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import { compRoot, hRoot } from '../utils/paths'
import { buildConfigEntries } from '../build-info'
import { generateExternal, writeBundles } from '../utils/rollup'
import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const bundle = await rollup({
    input: compRoot,
    plugins: [
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      vue(),
      esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    treeshake: true,
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
