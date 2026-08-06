// packages/ui/src/components/select/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
//
// 注：filterOption 不在此处静态默认，而在 Select.vue 的 antProps computed 中按
// remote 模式自适应（本地模式 true / 远程模式 false），以保证两种模式开箱即用。
import type { SelectProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - showSearch: true（统一启用搜索框，支持本地过滤与远程搜索两类场景）
 * - allowClear: true（统一允许一键清空，提升表单易用性）
 */
export const tmSelectDefaults: Pick<SelectProps, 'showSearch' | 'allowClear'> = {
  showSearch: true,
  allowClear: true,
}
