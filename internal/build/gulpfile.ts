import { mkdir } from 'fs/promises'
import { series } from 'gulp'
import { withTaskName } from './src/utils/gulp'
import { run } from './src/utils/process'
import { hOutput } from './src/utils/paths'
import { buildComponents } from './src/task/buildComponents'

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(hOutput, { recursive: true })),
  buildComponents
)
