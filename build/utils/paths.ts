import path from "path";

// 项目根目录
export const projectRoot = path.resolve(__dirname, "../../");
// 打包输出目录
export const outDir = path.resolve(__dirname, "../../dist");
// h-material 入口 index.ts
export const hmRoot = path.resolve(__dirname, "../../packages/h-material");
// 组件目录
export const compRoot = path.resolve(projectRoot, ".packages/components");
