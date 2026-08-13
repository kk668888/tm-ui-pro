// packages/ui/src/components/card/src/props.ts
// TmCard 类型定义：ant 原生 CardProps（bordered / size 公司默认兜底，见 defaults.ts）
import type { CardProps } from 'ant-design-vue'

/** TmCard = ant 原生 CardProps */
export type TmCardProps = CardProps

// 类型透传：业务方可直接 import TmCardProps / CardProps
export type { CardProps } from 'ant-design-vue'
