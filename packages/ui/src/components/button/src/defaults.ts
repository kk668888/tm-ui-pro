// packages/ui/src/components/button/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认（如 type=primary），其余 ant 默认保持原样
import type { TmButtonProps } from './props'

/**
 * 公司默认 props 集合
 * - type: 'primary'（公司视觉规范默认主按钮）
 * - debounce: 0（默认不防抖，保持 ant 原生点击语义）
 */
export const tmButtonDefaults: Required<Pick<TmButtonProps, 'type' | 'debounce'>> = {
  type: 'primary',
  debounce: 0,
}
