// packages/ui/src/components/card/src/defaults.ts
// TmCard 公司默认值：统一业务卡片视觉规范锚点
import type { CardProps } from 'ant-design-vue'

/**
 * TmCard 公司默认值（业务显式传值优先覆盖）
 * - bordered: true —— 卡片默认显示边框（业务卡片骨架统一）
 * - size: 'default' —— 卡片默认尺寸
 */
export const tmCardDefaults = {
  bordered: true,
  size: 'default',
} as const satisfies Partial<CardProps>
