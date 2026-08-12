// packages/ui/src/components/time-picker/src/props.ts
// TmTimePicker 类型定义：ant 原生 TimePickerProps + 公司扩展
import type { Dayjs } from 'dayjs'
import type { TimePickerProps } from 'ant-design-vue'

/** TmTimePicker 在 ant TimePicker 之上扩展的公司特有属性 */
export interface TmTimePickerExtProps {
  /** 业务 v-model 绑定值；默认 Dayjs（ant 原生零摩擦），配置 valueFormat 后为格式化字符串 */
  modelValue?: Dayjs | string | null
  /**
   * 可选值格式：配置后业务 modelValue 为按该格式的字符串（如 'HH:mm:ss'），
   * 组件内部完成 string↔Dayjs 双向转换，业务零 Dayjs 依赖；未配置时 modelValue 为 Dayjs 直通。
   */
  valueFormat?: string
  /** 只读语义：ant TimePicker 无原生 readonly，为真时经 useReadonlyLock 锁死弹层 */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmTimePickerProps = TimePickerProps & TmTimePickerExtProps

// 类型透传：业务方可直接 import TmTimePickerProps / TimePickerProps
export type { TimePickerProps } from 'ant-design-vue'
