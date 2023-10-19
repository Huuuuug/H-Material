import { buildRoot } from '@h-material/build-utils'
import { run } from './process'
import type { TaskFunction } from 'gulp'

/** 给每个gulp任务命名 */
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

/** 执行打包任务 */
export const runTask = (name: string) =>
  withTaskName(`shellTask: ${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )
