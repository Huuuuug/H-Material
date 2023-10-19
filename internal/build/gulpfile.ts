import path from 'path'
import { copyFile, mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  hOutput,
  hmPackage,
  projRoot,
} from '@h-material/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'

// 复制所有的样式文件
export const copyFullStyle = async () => {
  await mkdir(path.resolve(hOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(hOutput, 'theme-chalk/index.css'),
    path.resolve(hOutput, 'dist/index.css')
  )
}

export const copyFiles = () =>
  Promise.all([
    copyFile(hmPackage, path.join(hOutput, 'package.json')),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(hOutput, 'README.md')
    ),
    // copyFile(
    //   path.resolve(projRoot, 'global.d.ts'),
    //   path.resolve(hOutput, 'global.d.ts')
    // ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(hOutput, { recursive: true })),
  parallel(
    runTask('buildModules'),
    runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      )
      // copyFullStyle
    )
  ),
  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
