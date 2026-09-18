// packages/ui/src/components/time-range-picker/src/props.ts
// TmTimeRangePicker 类型定义：ant 原生 RangePickerProps + 公司扩展（对齐 date-picker/src/props.ts）
import type { Dayjs } from 'dayjs'
// ant 主入口未导出 RangePickerProps（vue-tsc 确认），从 date-picker 子入口导入
import type { RangePickerProps } from 'ant-design-vue/es/date-picker'

/** TmTimeRangePicker 在 ant RangePicker 之上扩展的公司特有属性 */
export interface TmTimeRangePickerExtProps {
  /** 业务 v-model 绑定值（起止时间对）；默认 [Dayjs,Dayjs]，配置 valueFormat 后为 [string,string] */
  modelValue?: [Dayjs, Dayjs] | [string, string] | null
  /** 可选值格式：配置后业务 modelValue 为 [string,string]，内部成对转换 */
  valueFormat?: string
  /** 只读语义：为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmTimeRangePickerProps = RangePickerProps & TmTimeRangePickerExtProps

// 类型透传：业务方可直接 import TmTimeRangePickerProps / RangePickerProps
export type { RangePickerProps } from 'ant-design-vue/es/date-picker'
