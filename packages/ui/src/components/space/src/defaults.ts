// packages/ui/src/components/space/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：size 用函数形式（() => SpaceProps['size']）——withDefaults 的 InferDefault 要求
// 匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 公司规范锁定默认间距 middle；未来改全库间距只动此处。
import type { SpaceProps } from 'ant-design-vue'

/** 公司默认间距：ant 语义值 middle */
export const DEFAULT_SPACE_SIZE = 'middle'

export const tmSpaceDefaults = {
  size: (): SpaceProps['size'] => DEFAULT_SPACE_SIZE,
} as const
