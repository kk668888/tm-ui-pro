// packages/ui/src/components/popover/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：不用 `Partial<PopoverProps>` 标注（autoAdjustOverflow 复合类型会展开成
// boolean | AdjustOverflow，withDefaults 的 InferDefault 不接受），改用 as const 精确字面量。
export const tmPopoverDefaults = {
  /**
   * autoAdjustOverflow 默认 true（Boolean 陷阱兜底）：
   * ant Tooltip 基类（abstractTooltipProps）默认 autoAdjustOverflow:true，
   * 类型化 defineProps 会把 Boolean prop 未传时覆盖为 false，
   * 导致气泡不随视口自动调整位置（可能溢出）。显式兜底 true 还原 ant 语义。
   */
  autoAdjustOverflow: true,
} as const
