// packages/ui/src/components/popover/src/props.ts
// TmPopover 类型定义：ant 原生 PopoverProps（当前无公司扩展键）
import type { PopoverProps } from 'ant-design-vue'

/** TmPopover = ant 原生 PopoverProps（公司默认 autoAdjustOverflow 在 defaults.ts 提供） */
export type TmPopoverProps = PopoverProps

// 类型透传：业务方可直接 import TmPopoverProps / PopoverProps
export type { PopoverProps } from 'ant-design-vue'
