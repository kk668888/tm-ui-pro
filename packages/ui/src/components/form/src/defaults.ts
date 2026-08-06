// packages/ui/src/components/form/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
//
// 设计要点：
// - TmForm 是纯薄封装，不新增公司扩展键（与 Button/Input/Select 不同）。
// - layout 默认 'horizontal' 对齐 ant 原生默认，显式落地为「公司默认」便于后续统一调整。
// - hideRequiredMark 默认 false：保留必填星号视觉规范，提升表单可用性。
import type { FormProps } from 'ant-design-vue'

/**
 * 公司默认 Form props 集合
 * - layout: 'horizontal'（标签与控件水平排列，公司表单视觉规范）
 * - hideRequiredMark: false（保留必填星号，符合表单填写预期）
 */
export const tmFormDefaults: Pick<FormProps, 'layout' | 'hideRequiredMark'> = {
  layout: 'horizontal',
  hideRequiredMark: false,
}
