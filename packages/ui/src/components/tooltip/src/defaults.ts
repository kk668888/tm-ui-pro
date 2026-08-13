// packages/ui/src/components/tooltip/src/defaults.ts
// TmTooltip 公司默认值：统一公司提示气泡视觉（作为 Popover / Popconfirm 同源底层的锚点）
import type { TooltipProps } from 'ant-design-vue'

/**
 * TmTooltip 公司默认值（业务显式传值优先覆盖）
 * - placement: 'top' —— 默认向上弹出
 * - autoAdjustOverflow: true —— 溢出时自动调整位置
 * - arrow: true —— 默认展示箭头
 */
export const tmTooltipDefaults = {
  placement: 'top',
  autoAdjustOverflow: true,
  arrow: true,
} as const satisfies Partial<TooltipProps>
