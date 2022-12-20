import { hPackage } from './paths'
import type { OutputOptions, RollupBuild } from 'rollup'
import type { ProjectManifest } from '@pnpm/types'

/** 配置rollup打包配置 */
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}
/** 根据路径获取项目依赖清单 */
export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest
}
/** 获取打包文件的依赖清单 */
export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const mainfest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = mainfest
  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}
/** rollup */
export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(hPackage)
  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push(...dependencies)
    }
    return [...new Set(packages)].some(
      (pkg: string) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}
