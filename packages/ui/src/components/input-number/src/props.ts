// packages/ui/src/components/input-number/src/props.ts
// TmInputNumber 类型定义：ant 原生 InputNumberProps + 公司扩展 props
import type { InputNumberProps } from 'ant-design-vue'

/** TmInputNumber 在 ant InputNumber 之上扩展的公司特有属性 */
export interface TmInputNumberExtProps {
  /** 业务 v-model 绑定值；内部 computed 桥接到 ant InputNumber 的 value（number） */
  modelValue?: InputNumberProps['value']
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmInputNumberProps = InputNumberProps & TmInputNumberExtProps

// 类型透传：业务方可直接 import TmInputNumberProps / InputNumberProps
export type { InputNumberProps } from 'ant-design-vue'
