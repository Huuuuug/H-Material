import { resolve } from 'path'

/** 项目根路径 */
export const projRoot = resolve(__dirname, '../../../../')
/** packages根路径 */
export const pkgRoot = resolve(projRoot, 'packages')
/** components根路径 */
export const compRoot = resolve(pkgRoot, 'components')
/** 样式文件根路径 */
export const themeRoot = resolve(pkgRoot, 'theme-chalk')
/** 工具函数根路径 */
export const utilRoot = resolve(pkgRoot, 'utils')
/** 打包项目根路径 */
export const buildRoot = resolve(projRoot, 'internal', 'build')
export const hRoot = resolve(pkgRoot, 'h-material')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
/** `/dist/h-material` */
export const hOutput = resolve(buildOutput, 'h-material')
/** 包路径 */
export const hPackage = resolve(hRoot, 'package.json')
