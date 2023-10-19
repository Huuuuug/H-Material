// For this project development
import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    HButton: typeof import('../packages/h-material')['HButton']
    HIcon: typeof import('../packages/h-material')['HIcon']
    HDivider: typeof import('../packages/h-material')['HDivider']
  }
}
