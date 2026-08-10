// packages/ui/src/components/radio-group/src/props.ts
// TmRadioGroup 类型定义：ant 原生 RadioGroupProps + 公司扩展 props
import type { RadioGroupProps } from 'ant-design-vue'

/** TmRadioGroup 在 ant RadioGroup 之上扩展的公司特有属性 */
export interface TmRadioGroupExtProps {
  /** 业务 v-model 绑定值；内部 computed 桥接到 ant RadioGroup 的 value */
  modelValue?: RadioGroupProps['value']
  /**
   * 只读语义：ant RadioGroup 无原生 readonly，readonly 为真时映射为禁用态
   * （业务显式传优先于 TmForm context；`disabled` 未传时置 undefined 保证 `??` 级联落空）
   */
  readonly?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmRadioGroupProps = RadioGroupProps & TmRadioGroupExtProps

// 类型透传：业务方可直接 import TmRadioGroupProps / RadioGroupProps
export type { RadioGroupProps } from 'ant-design-vue'
