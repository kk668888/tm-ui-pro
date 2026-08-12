// packages/ui/src/components/divider/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：type / orientation 用函数形式（() => DividerProps['type']）——withDefaults 的
// InferDefault 要求匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 公司规范锁定水平 + 居中分割线；未来改全库分割线视觉只动此处。
import type { DividerProps } from 'ant-design-vue'

/** 公司默认分割线形态：水平 */
export const DEFAULT_DIVIDER_TYPE = 'horizontal'
/** 公司默认文案位置：居中 */
export const DEFAULT_DIVIDER_ORIENTATION = 'center'

export const tmDividerDefaults = {
  type: (): DividerProps['type'] => DEFAULT_DIVIDER_TYPE,
  orientation: (): DividerProps['orientation'] => DEFAULT_DIVIDER_ORIENTATION,
} as const
