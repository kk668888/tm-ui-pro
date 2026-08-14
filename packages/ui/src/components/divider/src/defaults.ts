// packages/ui/src/components/divider/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：type / orientation 用函数形式（() => 'horizontal'）——withDefaults 的 InferDefault
// 要求匹配「值或函数签名」，字符串字面量直接传会触发 TS2345；且返回类型必须精确到字面量
// （不含 undefined），否则与 ant Partial<ExtractPropTypes> 索引类型（含 undefined）不兼容。
// 公司规范锁定水平 + 居中分割线；未来改全库分割线视觉只动此处。

/** 公司默认分割线形态：水平 */
export const DEFAULT_DIVIDER_TYPE = 'horizontal'
/** 公司默认文案位置：居中 */
export const DEFAULT_DIVIDER_ORIENTATION = 'center'

export const tmDividerDefaults = {
  // 显式标注字面量返回类型（不含 undefined）：ant 的 DividerProps = Partial<ExtractPropTypes<...>>，
  // 其索引类型含 undefined，而 withDefaults 的 InferDefault 要求「无 undefined 的精确类型」，
  // 否则触发 TS2345（`() => DividerProps['type']` 不匹配 InferDefault）。
  type: (): 'horizontal' => DEFAULT_DIVIDER_TYPE,
  orientation: (): 'center' => DEFAULT_DIVIDER_ORIENTATION,
} as const
