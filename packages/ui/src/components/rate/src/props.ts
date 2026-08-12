// packages/ui/src/components/rate/src/props.ts
// TmRate 类型定义：ant 原生 RateProps（无公司扩展键）
import type { RateProps } from 'ant-design-vue'

/** TmRate = ant 原生 RateProps */
export type TmRateProps = RateProps

// 类型透传：业务方可直接 import TmRateProps / RateProps
export type { RateProps } from 'ant-design-vue'
