// packages/ui/src/components/flex/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：gap 用函数形式（() => FlexProps['gap']）——withDefaults 的 InferDefault 要求
// 匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 公司规范：Flex 缺省无间距（ant 默认），此处引入 middle 与 TmSpace 间距对齐，统一纵向节奏。
import type { FlexProps } from 'ant-design-vue'

/** 公司默认 gap：与 TmSpace 间距规范对齐 */
export const DEFAULT_FLEX_GAP = 'middle'

export const tmFlexDefaults = {
  gap: (): FlexProps['gap'] => DEFAULT_FLEX_GAP,
} as const
