// packages/ui/src/components/empty/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：description 用函数形式（`() => string`）——ant EmptyProps 的 description 是 VueNode，
// withDefaults 的 InferDefault 要求匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 纯字符串常量 DEFAULT_EMPTY_DESCRIPTION 作为文档/未来迁移的回退锚点。
export const DEFAULT_EMPTY_DESCRIPTION = '暂无数据'

export const tmEmptyDefaults = {
  description: (): string => DEFAULT_EMPTY_DESCRIPTION,
} as const
