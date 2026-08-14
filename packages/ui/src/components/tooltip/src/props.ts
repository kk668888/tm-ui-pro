// packages/ui/src/components/tooltip/src/props.ts
// TmTooltip 类型定义：ant 原生 TooltipProps（placement / autoAdjustOverflow / arrow 公司默认兜底，见 defaults.ts）
import type { TooltipProps } from 'ant-design-vue'

/** TmTooltip = ant 原生 TooltipProps */
export type TmTooltipProps = TooltipProps

// 类型透传：业务方可直接 import TmTooltipProps / TooltipProps / TooltipPlacement
export type { TooltipProps } from 'ant-design-vue'
export type { TooltipPlacement } from 'ant-design-vue/es/tooltip'
