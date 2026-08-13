// packages/ui/src/components/tooltip/src/props.ts
// TmTooltip 类型定义：ant 原生 TooltipProps（placement / autoAdjustOverflow / arrow 公司默认兜底，见 defaults.ts）
import type { TooltipProps } from 'ant-design-vue'
// TooltipPlacement 未从 ant 顶层导出，从模块级深层导入（ant 无 exports map，路径稳定）
import type { TooltipPlacement } from 'ant-design-vue/es/tooltip'

/** TmTooltip = ant 原生 TooltipProps */
export type TmTooltipProps = TooltipProps

// 类型透传：业务方可直接 import TmTooltipProps / TooltipProps / TooltipPlacement
export type { TooltipProps } from 'ant-design-vue'
export type { TooltipPlacement } from 'ant-design-vue/es/tooltip'
