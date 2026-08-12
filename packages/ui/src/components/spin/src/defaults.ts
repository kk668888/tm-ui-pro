// packages/ui/src/components/spin/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：不用 `Partial<SpinProps>` 标注，与其余组件 defaults 保持一致（as const 精确字面量）。
export const tmSpinDefaults = {
  /**
   * spinning 默认 true（Boolean 陷阱兜底）：
   * ant Spin 的 initDefaultProps 默认 spinning:true（默认加载态），
   * 类型化 defineProps 会把 Boolean prop 未传时覆盖为 false，
   * 导致业务不传时加载动画不显示。显式兜底 true 还原 ant 语义。
   */
  spinning: true,
} as const
