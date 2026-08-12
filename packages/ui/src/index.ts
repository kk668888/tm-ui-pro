// packages/ui/src/index.ts
// 组件库总出口：在此聚合所有 Tm 组件的注册与类型导出
import type { App } from 'vue'
// 按需 Resolver 工厂（unplugin-vue-components）：业务方零配置自动导入 <TmXxx>
// 子入口决策（brief Bug 2 方案 A）：TmResolver 走主入口导出，不声明独立 ./resolver 子入口——
// 它是 Tree Shaking 友好的配置函数（非大模块），与 index 一起打包，es/index.js 自然含其导出，
// 避免 T12 vite entry 回填新增 resolver 入口。Task 14 exports 据此不声明 ./resolver。
export { TmResolver } from './resolver'
import { TmButton } from './components/button'
import { TmInput } from './components/input'
import { TmSelect } from './components/select'
import { TmForm, TmFormItem } from './components/form'
import { TmTable } from './components/table'
import { TmConfigProvider } from './config-provider'
import { TmRadioGroup } from './components/radio-group'
import { TmCheckboxGroup } from './components/checkbox-group'
import { TmSwitch } from './components/switch'
import { TmInputNumber } from './components/input-number'
import { TmDatePicker, TmRangePicker } from './components/date-picker'
import { TmCascader } from './components/cascader'
import { TmTreeSelect } from './components/tree-select'
import { TmTag } from './components/tag'
import { TmEmpty } from './components/empty'
import { TmBadge } from './components/badge'
import { TmApp } from './components/app'
import { TmModal } from './components/modal'
import { TmDrawer } from './components/drawer'
import { TmMessage } from './components/message'
import { TmNotification } from './components/notification'
import { TmAlert } from './components/alert'
import { TmPopconfirm } from './components/popconfirm'
import { TmSpin } from './components/spin'
import { TmPopover } from './components/popover'
import { TmResult } from './components/result'
import { TmTimePicker } from './components/time-picker'
import { TmUpload } from './components/upload'

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
  app.use(TmConfigProvider as unknown as { install: (app: App) => void })
  app.use(TmRadioGroup as unknown as { install: (app: App) => void })
  app.use(TmCheckboxGroup as unknown as { install: (app: App) => void })
  app.use(TmSwitch as unknown as { install: (app: App) => void })
  app.use(TmInputNumber as unknown as { install: (app: App) => void })
  app.use(TmDatePicker as unknown as { install: (app: App) => void })
  app.use(TmRangePicker as unknown as { install: (app: App) => void })
  app.use(TmCascader as unknown as { install: (app: App) => void })
  app.use(TmTreeSelect as unknown as { install: (app: App) => void })
  app.use(TmTag as unknown as { install: (app: App) => void })
  app.use(TmEmpty as unknown as { install: (app: App) => void })
  app.use(TmBadge as unknown as { install: (app: App) => void })
  app.use(TmApp as unknown as { install: (app: App) => void })
  app.use(TmModal as unknown as { install: (app: App) => void })
  app.use(TmDrawer as unknown as { install: (app: App) => void })
  app.use(TmAlert as unknown as { install: (app: App) => void })
  app.use(TmPopconfirm as unknown as { install: (app: App) => void })
  app.use(TmSpin as unknown as { install: (app: App) => void })
  app.use(TmPopover as unknown as { install: (app: App) => void })
  app.use(TmResult as unknown as { install: (app: App) => void })
  app.use(TmTimePicker as unknown as { install: (app: App) => void })
  app.use(TmUpload as unknown as { install: (app: App) => void })
  // TmMessage / TmNotification 是函数式 API（非组件），不 app.use 注册，仅 named export
}

// 组件 export：业务方可按需 import { TmButton, TmInput, TmSelect, TmForm, TmFormItem, TmTable } from '@tm/ui'
export { TmButton } from './components/button'
export { TmInput } from './components/input'
export { TmSelect } from './components/select'
export { TmForm, TmFormItem } from './components/form'
export { TmTable } from './components/table'
export { TmConfigProvider } from './config-provider'
export { TmRadioGroup } from './components/radio-group'
export { TmCheckboxGroup } from './components/checkbox-group'
export { TmSwitch } from './components/switch'
export { TmInputNumber } from './components/input-number'
export { TmDatePicker, TmRangePicker } from './components/date-picker'
export { TmCascader } from './components/cascader'
export { TmTreeSelect } from './components/tree-select'
export { TmTag } from './components/tag'
export { TmEmpty } from './components/empty'
export { TmBadge } from './components/badge'
export { TmApp } from './components/app'
export { TmModal } from './components/modal'
export { TmDrawer } from './components/drawer'
export { TmAlert } from './components/alert'
export { TmPopconfirm } from './components/popconfirm'
export { TmSpin } from './components/spin'
export { TmPopover } from './components/popover'
export { TmResult } from './components/result'
export { TmTimePicker } from './components/time-picker'
export { TmUpload } from './components/upload'
// 函数式 API（非组件）：全局消息/通知命令式调用
export { TmMessage } from './components/message'
export { TmNotification } from './components/notification'
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
export type { TmRadioGroupProps, TmRadioGroupExtProps, RadioGroupProps } from './components/radio-group'
export type {
  TmCheckboxGroupProps,
  TmCheckboxGroupExtProps,
  CheckboxGroupProps,
} from './components/checkbox-group'
export type { TmSwitchProps, TmSwitchExtProps, SwitchProps } from './components/switch'
export type { TmInputNumberProps, TmInputNumberExtProps, InputNumberProps } from './components/input-number'
export type {
  TmDatePickerProps,
  TmDatePickerExtProps,
  DatePickerProps,
  TmRangePickerProps,
  TmRangePickerExtProps,
  RangePickerProps,
} from './components/date-picker'
export type { TmCascaderProps, TmCascaderExtProps, CascaderProps } from './components/cascader'
export type { TmTreeSelectProps, TmTreeSelectExtProps, TreeSelectProps } from './components/tree-select'
export type { TmTagProps, TmTagExtProps, TagProps } from './components/tag'
export type { TmEmptyProps, EmptyProps } from './components/empty'
export type { TmBadgeProps, BadgeProps } from './components/badge'
export type { TmModalProps, TmModalExtProps, ModalProps } from './components/modal'
export type { TmDrawerProps, TmDrawerExtProps, DrawerProps } from './components/drawer'
export type { TmAlertProps, TmAlertExtProps, AlertProps } from './components/alert'
export type { TmPopconfirmProps, TmPopconfirmExtProps, PopconfirmProps } from './components/popconfirm'
export type { TmSpinProps, SpinProps } from './components/spin'
export type { TmPopoverProps, PopoverProps } from './components/popover'
export type { TmResultProps, ResultProps } from './components/result'
export type { TmTimePickerProps, TmTimePickerExtProps, TimePickerProps } from './components/time-picker'
export type { TmUploadProps, UploadProps, UploadFile, UploadChangeParam } from './components/upload'

export default { install }
