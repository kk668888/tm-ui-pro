// packages/ui/src/components/date-picker/src/props.ts
// TmDatePicker / TmRangePicker 类型定义：ant 原生 + 公司扩展
import type { Dayjs } from 'dayjs'
import type { DatePickerProps } from 'ant-design-vue'
// ant 主入口未导出 RangePickerProps（vue-tsc 确认），从 date-picker 子入口导入
import type { RangePickerProps } from 'ant-design-vue/es/date-picker'

/** TmDatePicker 在 ant DatePicker 之上扩展的公司特有属性 */
export interface TmDatePickerExtProps {
  /** 业务 v-model 绑定值；默认 Dayjs（ant 原生零摩擦），配置 valueFormat 后为格式化字符串 */
  modelValue?: Dayjs | string | null
  /**
   * 可选值格式：配置后业务 modelValue 为按该格式的字符串（如 'YYYY-MM-DD'），
   * 组件内部完成 string↔Dayjs 双向转换，业务零 Dayjs 依赖；未配置时 modelValue 为 Dayjs 直通。
   */
  valueFormat?: string
  /** 只读语义：ant DatePicker 无原生 readonly，为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmDatePickerProps = DatePickerProps & TmDatePickerExtProps

/** TmRangePicker 在 ant RangePicker 之上扩展的公司特有属性 */
export interface TmRangePickerExtProps {
  /** 业务 v-model 绑定值（起止日期对）；默认 [Dayjs,Dayjs]，配置 valueFormat 后为 [string,string] */
  modelValue?: [Dayjs, Dayjs] | [string, string] | null
  /** 可选值格式：配置后业务 modelValue 为 [string,string]，组件内部成对转换 */
  valueFormat?: string
  /** 只读语义：ant RangePicker 无原生 readonly，为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmRangePickerProps = RangePickerProps & TmRangePickerExtProps

// 类型透传：业务方可直接 import TmDatePickerProps / DatePickerProps 等
export type { DatePickerProps } from 'ant-design-vue'
export type { RangePickerProps } from 'ant-design-vue/es/date-picker'
