import { mkdir } from 'fs/promises'
import { parallel, series } from 'gulp'
import { run, runTask, withTaskName } from './src'
import { hOutput } from './src/utils/paths'

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
    )
  )
)

export * from './src'
