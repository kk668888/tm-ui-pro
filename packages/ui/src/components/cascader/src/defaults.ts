// packages/ui/src/components/cascader/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { CascaderProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - allowClear: true（统一允许一键清空，提升表单易用性）
 * 注：allowClear 是 ant Boolean 默认 true 的属性，Vue 类型化 defineProps 会生成默认 false，
 * 必须在 withDefaults 显式兜底（既有通病，见 input/defaults.ts）。
 */
export const tmCascaderDefaults: Partial<CascaderProps> = {
  allowClear: true,
}
