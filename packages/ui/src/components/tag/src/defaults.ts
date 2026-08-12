// packages/ui/src/components/tag/src/defaults.ts
// 公司默认 props（语义色映射已上提共享 constants/status，见下方 re-export）
import type { TagProps } from 'ant-design-vue'
import {
  STATUS_COLOR as TAG_STATUS_COLOR,
  type StatusValue as TagStatus,
} from '../../../constants/status'

// 兼容既有内部引用：TmTag 的语义色映射指向共享源（单一真相，TmAlert 等复用）
export { TAG_STATUS_COLOR }
export type { TagStatus }

/**
 * 公司默认 props 集合
 * - bordered: true —— 关键兜底（2026-08-06 已记录通病）：TmTagProps 继承 antd TagProps，
 *   Vue 类型化 defineProps 会把 bordered（antd 默认 true 的 Boolean）生成默认 false 的运行时 prop，
 *   覆盖 antd 内部 `bordered = true` 解构兜底，标签被渲染成无边框。必须显式兜底 true。
 */
export const tmTagDefaults: Partial<TagProps> = {
  bordered: true,
}
