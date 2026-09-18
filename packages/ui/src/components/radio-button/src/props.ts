// packages/ui/src/components/radio-button/src/props.ts
// TmRadioButton 类型定义：ant 原生 RadioProps（value/disabled 等）
// 注：无 v-model（值单元由 TmRadioGroup 管理），无公司默认值
import type { RadioProps } from 'ant-design-vue'

/** ant 原生透传（IDE 同时提示） */
export type TmRadioButtonProps = RadioProps

// 类型透传：业务方可直接 import TmRadioButtonProps / RadioProps
export type { RadioProps } from 'ant-design-vue'
