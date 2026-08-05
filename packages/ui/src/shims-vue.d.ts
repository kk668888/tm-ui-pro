// packages/ui/src/shims-vue.d.ts
// Vue SFC 模块声明：让 TypeScript（tsc / IDE）能识别 .vue 文件的 import
//
// 必要性：TS 默认只识别 .ts/.tsx/.d.ts；import 一个 .vue 文件需通过 ambient 声明补全。
// 注意：构建期由 @vitejs/plugin-vue 编译 .vue，运行时无问题；
//       此 shim 仅服务于 tsc 类型检查与 IDE 智能提示。
declare module '*.vue' {
  // 复用 vue 提供的 DefineComponent 类型，所有 SFC 都符合该形态
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
