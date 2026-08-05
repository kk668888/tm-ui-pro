// packages/ui/src/index.ts
// 组件库总出口：后续 task 在此聚合各组件导出
import type { App } from 'vue'

/** Vue 插件 install：app.use(@tm/ui) 全量注册 */
export const install = (app: App): void => {
  // 占位，Task 4+ 起逐个注册组件
}

export default { install }
