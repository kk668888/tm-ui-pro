// packages/ui/src/components/badge/src/props.ts
// TmBadge 类型定义：ant 原生 BadgeProps（当前无公司扩展键）
import type { BadgeProps } from 'ant-design-vue'

/** TmBadge = ant 原生 BadgeProps（公司视觉默认在 defaults.ts 提供） */
export type TmBadgeProps = BadgeProps

// 类型透传：业务方可直接 import TmBadgeProps / BadgeProps
export type { BadgeProps } from 'ant-design-vue'
