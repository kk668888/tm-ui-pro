// packages/ui/src/components/spin/src/props.ts
// TmSpin 类型定义：ant 原生 SpinProps（当前无公司扩展键）
import type { SpinProps } from 'ant-design-vue'

/** TmSpin = ant 原生 SpinProps（公司默认 spinning 在 defaults.ts 提供） */
export type TmSpinProps = SpinProps

// 类型透传：业务方可直接 import TmSpinProps / SpinProps
export type { SpinProps } from 'ant-design-vue'
