// packages/ui/src/components/radio/src/props.ts
// TmRadio 类型定义：ant 原生 RadioProps（无公司扩展键）
import type { RadioProps } from 'ant-design-vue'

/** TmRadio = ant 原生 RadioProps */
export type TmRadioProps = RadioProps

// 类型透传：业务方可直接 import TmRadioProps / RadioProps
export type { RadioProps } from 'ant-design-vue'
