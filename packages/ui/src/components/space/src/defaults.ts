// packages/ui/src/components/space/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：size 用函数形式（() => 'middle'）——withDefaults 的 InferDefault 要求
// 匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
// 公司规范锁定默认间距 middle；未来改全库间距只动此处。

/** 公司默认间距：ant 语义值 middle */
export const DEFAULT_SPACE_SIZE = 'middle'

export const tmSpaceDefaults = {
  // 显式标注返回类型：ant SpaceProps = Partial<ExtractPropTypes>（索引含 undefined），
  // withDefaults 的 InferDefault 要求无 undefined 的精确类型，否则 TS2345。
  size: (): 'middle' => DEFAULT_SPACE_SIZE,
} as const
