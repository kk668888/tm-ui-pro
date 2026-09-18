// packages/ui/src/components/quarter-picker/src/props.ts
// TmQuarterPicker 类型定义：ant 原生 DatePickerProps + 公司扩展（对齐 date-picker/src/props.ts）
import type { Dayjs } from 'dayjs'
import type { DatePickerProps } from 'ant-design-vue'

/** TmQuarterPicker 在 ant QuarterPicker 之上扩展的公司特有属性 */
export interface TmQuarterPickerExtProps {
  /** 业务 v-model 绑定值；默认 Dayjs，配置 valueFormat 后为格式化字符串 */
  modelValue?: Dayjs | string | null
  /** 可选值格式：配置后业务 modelValue 为按该格式的字符串，内部完成 string↔Dayjs 双向转换 */
  valueFormat?: string
  /** 只读语义：为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmQuarterPickerProps = DatePickerProps & TmQuarterPickerExtProps

// 类型透传：业务方可直接 import TmQuarterPickerProps / DatePickerProps
export type { DatePickerProps } from 'ant-design-vue'
