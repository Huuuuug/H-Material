import installer from './defaults'
export * from '@h-material/components'
export * from '@h-material/constants'
export * from './make-installer'

// export const install = (app: App) => {
//   // 每个组件在写的时候都提供了install方法

//   // 有的是组件，有的可能是指令 xxx.install = () => { app.directive() }
//   // components.forEach((component) => app.use(component));

//   Object.entries(components).forEach(([name, component]) => {
//     app.component(name, component)
//   })
// }
export const install = installer.install
export const version = installer.version

export default installer
