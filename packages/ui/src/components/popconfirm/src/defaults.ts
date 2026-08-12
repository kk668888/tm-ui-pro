// packages/ui/src/components/popconfirm/src/defaults.ts
// 公司默认配置：确认/取消按钮文案 + Boolean 陷阱兜底
// 注：不用 `Partial<PopconfirmProps>` 标注（autoAdjustOverflow 等复合类型会展开成
// boolean | AdjustOverflow，withDefaults 的 InferDefault 不接受），改用 as const 精确字面量。
export const tmPopconfirmDefaults = {
  /** 确认按钮文案（业务显式传 okText 覆盖） */
  okText: '确定',
  /** 取消按钮文案（业务显式传 cancelText 覆盖） */
  cancelText: '取消',
  /**
   * Boolean 陷阱兜底（ant 默认 true，类型化 defineProps 会覆盖为 false）：
   * - autoAdjustOverflow：气泡随视口自动调整位置（false 时可能溢出视口）
   * - showCancel：显示取消按钮（false 时确认框只剩确认按钮）
   */
  autoAdjustOverflow: true,
  showCancel: true,
} as const
