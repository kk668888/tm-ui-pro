// packages/ui/src/components/textarea/src/props.ts
// TmTextarea 类型定义：ant 原生 TextAreaProps + 公司扩展 modelValue（对齐 input/src/props.ts）
import type { TextAreaProps } from 'ant-design-vue'

/** TmTextarea 在 ant TextArea 之上扩展的公司特有属性 */
export interface TmTextareaExtProps {
  /** 业务侧 v-model 绑定值；内部映射到 ant Textarea 的 value */
  modelValue?: string
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmTextareaProps = TextAreaProps & TmTextareaExtProps

// 类型透传：业务方可直接 import TmTextareaProps / TextAreaProps
export type { TextAreaProps } from 'ant-design-vue'
