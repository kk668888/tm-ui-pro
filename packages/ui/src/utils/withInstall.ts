// packages/ui/src/utils/withInstall.ts
// withInstall：为组件附加 Vue 插件 install 方法
// 所有组件的 index.ts 都将通过该工具产出可被 app.use 整体注册的组件
import type { App, Component } from 'vue'

/**
 * 为组件附加 Vue 插件 install 方法
 *
 * @param comp 原始组件（SFC 对象或 defineComponent 结果）
 * @param name 全局注册名（如 'TmButton'）
 * @returns 带 install 的组件，既可 app.use 整体注册，也可直接当组件用
 */
export function withInstall<T extends Component>(
  comp: T,
  name: string,
): T & { install: (app: App) => void } {
  // 通过 as 断言扩展 install 字段，避免对入参 comp 进行破坏性修改语义
  const compWithInstall = comp as T & { install: (app: App) => void }
  // install 实现：将组件以指定 name 注册到 app 上
  compWithInstall.install = (app: App) => {
    app.component(name, compWithInstall)
  }
  return compWithInstall
}
