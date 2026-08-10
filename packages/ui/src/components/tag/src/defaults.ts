// packages/ui/src/components/tag/src/defaults.ts
// 公司默认 props + status 状态→语义色映射表
import type { TagProps } from 'ant-design-vue'

/**
 * status 状态 → ant 预设语义色 映射
 * ant Tag 的 color 支持预设语义色（success/processing/error/warning/default），
 * 直接映射到预设名，零自定义 CSS，随 ConfigProvider 主题联动。
 * 业务枚举 `failed` 对应 ant 的 `error`（ant 命名差异，映射表显式处理）。
 */
export const TAG_STATUS_COLOR = {
  success: 'success',
  processing: 'processing',
  failed: 'error',
  warning: 'warning',
} as const

/** status 合法枚举值（用于类型收窄） */
export type TagStatus = keyof typeof TAG_STATUS_COLOR

/**
 * 公司默认 props 集合
 * - bordered: true —— 关键兜底（2026-08-06 已记录通病）：TmTagProps 继承 antd TagProps，
 *   Vue 类型化 defineProps 会把 bordered（antd 默认 true 的 Boolean）生成默认 false 的运行时 prop，
 *   覆盖 antd 内部 `bordered = true` 解构兜底，标签被渲染成无边框。必须显式兜底 true。
 */
export const tmTagDefaults: Partial<TagProps> = {
  bordered: true,
}
