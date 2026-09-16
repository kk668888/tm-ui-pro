// packages/ui/src/validation/predicates/compare.ts
// 比较类判据内核：数值区间 / 字符串长度（闭区间）
//
// 注意（design D2）：这两个类型在适配器层产「声明式区间字段」（type + min/max），
// 不产自定义校验函数；本文件的纯函数仅用于内核单测与注册表复用。

/** 判定 value 是否可安全参与数值比较（number 或可解析的数字串，NaN / Infinity 不通过） */
function toFiniteNumber(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(num) ? num : Number.NaN
}

/**
 * 数值闭区间判据：value ∈ [min, max]
 * - 数字串（'50'）宽容转换为数值参与比较
 * - 非数值（'abc'）返回 false
 */
export function isInRange(value: unknown, min: number, max: number): boolean {
  const num = toFiniteNumber(value)
  return Number.isFinite(num) && num >= min && num <= max
}

/**
 * 字符串长度闭区间判据：value.length ∈ [min, max]
 * - 仅字符串参与判定；数值等其他类型返回 false（长度语义只对文本有意义）
 */
export function isLengthWithin(value: unknown, min: number, max: number): boolean {
  return typeof value === 'string' && value.length >= min && value.length <= max
}
