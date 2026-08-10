// packages/ui/src/components/tree-select/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { TreeSelectProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - allowClear: true（统一允许一键清空，提升表单易用性）
 * - bordered: true —— 关键兜底（2026-08-10 修复）：ant TreeSelectProps 的 bordered 是
 *   Boolean 默认 true 的属性，Vue 类型化 defineProps 会生成默认 false 的运行时 prop，
 *   覆盖 antd 内部 `bordered = true` 解构兜底，树选择被渲染成无边框。必须显式兜底 true。
 * 注：allowClear/bordered 都是 ant Boolean 默认 true 的属性（既有通病，见 input/defaults.ts）。
 */
export const tmTreeSelectDefaults: Partial<TreeSelectProps> = {
  allowClear: true,
  bordered: true,
}
