// packages/ui/src/index.ts
// 组件库总出口：在此聚合所有 Tm 组件的注册与类型导出
import type { App } from 'vue'
import { TmButton } from './components/button'
import { TmInput } from './components/input'
import { TmSelect } from './components/select'
import { TmForm, TmFormItem } from './components/form'
import { TmTable } from './components/table'

/**
 * Vue 插件 install：app.use(@tm/ui) 全量注册
 * 后续 task 每新增一个组件，在此追加 app.use(组件)
 *
 * 注（plan-bug #5）：form 模块含 TmForm + TmFormItem 两个组件，必须分别 app.use 注册，
 * 否则业务侧 <TmFormItem> 会因未注册而报错。
 */
export const install = (app: App): void => {
  app.use(TmButton as unknown as { install: (app: App) => void })
  app.use(TmInput as unknown as { install: (app: App) => void })
  app.use(TmSelect as unknown as { install: (app: App) => void })
  app.use(TmForm as unknown as { install: (app: App) => void })
  app.use(TmFormItem as unknown as { install: (app: App) => void })
  app.use(TmTable as unknown as { install: (app: App) => void })
}

// 组件 export：业务方可按需 import { TmButton, TmInput, TmSelect, TmForm, TmFormItem, TmTable } from '@tm/ui'
export { TmButton } from './components/button'
export { TmInput } from './components/input'
export { TmSelect } from './components/select'
export { TmForm, TmFormItem } from './components/form'
export { TmTable } from './components/table'
// 类型 export：业务方可直接 import type { TmButtonProps, InputProps, SelectProps, FormProps, TmTableProps, ... } from '@tm/ui'
export type { TmButtonProps, TmButtonExtProps } from './components/button'
export type { TmInputProps, TmInputExtProps, InputProps } from './components/input'
export type { TmSelectProps, TmSelectExtProps, SelectProps } from './components/select'
export type { FormProps, FormInstance, FormItemProps, FormItemInstance } from './components/form'
export type {
  TmTableProps,
  TmTableExtProps,
  TmTablePageParam,
  TmTableResult,
  VxeGridProps,
  VxeGridInstance,
  VxeColumnProps,
  VxeGridListeners,
} from './components/table'

export default { install }
