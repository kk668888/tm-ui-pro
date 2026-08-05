// packages/ui/src/index.ts
// 组件库总出口：在此聚合所有 Tm 组件的注册与类型导出
import type { App } from 'vue'
import { TmButton } from './components/button'
import { TmInput } from './components/input'

/**
 * Vue 插件 install：app.use(@tm/ui) 全量注册
 * 后续 task 每新增一个组件，在此追加 app.use(组件)
 */
export const install = (app: App): void => {
  app.use(TmButton as unknown as { install: (app: App) => void })
  app.use(TmInput as unknown as { install: (app: App) => void })
}

// 组件 export：业务方可按需 import { TmButton, TmInput } from '@tm/ui'
export { TmButton } from './components/button'
export { TmInput } from './components/input'
// 类型 export：业务方可直接 import type { TmButtonProps, InputProps } from '@tm/ui'
export type { TmButtonProps, TmButtonExtProps } from './components/button'
export type { TmInputProps, TmInputExtProps, InputProps } from './components/input'

export default { install }
