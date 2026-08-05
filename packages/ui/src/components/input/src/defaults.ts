// packages/ui/src/components/input/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
import type { InputProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - allowClear: true（统一允许一键清空，提升表单易用性）
 * - size: 'middle'（公司视觉规范默认中等尺寸）
 */
export const tmInputDefaults: Partial<InputProps> = {
  allowClear: true,
  size: 'middle',
}
