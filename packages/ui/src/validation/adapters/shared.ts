// packages/ui/src/validation/adapters/shared.ts
// 两个适配器的共用小件：空值判定 + 计算类校验的「判定一步」
//
// 空值口径刻意与两侧 UI 库对齐（design D4 —— 借原生空值短路，不自写分支）：
// - vxe：checkRuleStatus 用 eqEmptyValue（'' / null / undefined）+ 空数组
// - async-validator：各类型校验器把 '' 归一为 undefined 后按 isEmptyValue（undefined / null / 空数组）短路

/**
 * 「未填」判定：undefined / null / 空字符串 / 空数组
 * 计算类校验器对这类值短路返回通过，把「空值拦不拦」完全交给 required 规则
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string' && value.length === 0) return true
  return Array.isArray(value) && value.length === 0
}

/** 值级判据的统一签名（与注册表的 CustomPredicate 一致） */
export type ValuePredicate = (value: unknown) => boolean

/**
 * 计算类校验的「判定一步」：非空才判，不通过即失败
 * - ant 侧：包一层 async，失败时 throw Error（async-validator 以异常消息为提示文案）
 * - vxe 侧：直接返回本函数结果（返回 Error 即判失败，Error.message 即提示文案）
 */
export function evaluatePredicate(
  predicate: ValuePredicate,
  value: unknown,
  message: string,
): Error | undefined {
  if (isEmptyValue(value)) return undefined
  return predicate(value) ? undefined : new Error(message)
}
