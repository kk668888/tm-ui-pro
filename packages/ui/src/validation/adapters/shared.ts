// packages/ui/src/validation/adapters/shared.ts
// 两个适配器的共用小件：空值判定 + 校验的「判定一步」（同步版 / 异步版）
//
// 空值口径刻意与两侧 UI 库对齐（design D4 —— 借原生空值短路，不自写分支）：
// - vxe：checkRuleStatus 用 eqEmptyValue（'' / null / undefined）+ 空数组
// - async-validator：各类型校验器把 '' 归一为 undefined 后按 isEmptyValue（undefined / null / 空数组）短路
//
// 为什么分同步 / 异步两个函数（add-async-validation design D2）：
// - 内置判据（正则 / 校验位算法）是纯计算，恒同步 → 走 evaluatePredicate，
//   产出维持「同步返回 Error」形态，逐字节不变
// - 自定义判据可以是异步的（远程唯一性等）→ 走 evaluatePredicateAsync
// 统一改 async 会让内置类型的 vxe 产出由同步 Error 变为 Promise，属无谓回归面。

import type { CustomPredicate, ValuePredicate } from '../types'

/**
 * 「未填」判定：undefined / null / 空字符串 / 空数组
 * 校验器对这类值短路返回通过，把「空值拦不拦」完全交给 required 规则
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string' && value.length === 0) return true
  return Array.isArray(value) && value.length === 0
}

/** 同步值级判据：定义归口在 types.ts，此处 re-export 维持既有导入路径 */
export type { ValuePredicate } from '../types'

/**
 * 同步判定一步：非空才判，不通过即返回 Error（调用方据此产出各自形态的失败）
 * 供内置类型使用（判据为纯计算）
 */
export function evaluatePredicate(
  predicate: ValuePredicate,
  value: unknown,
  message: string,
): Error | undefined {
  if (isEmptyValue(value)) return undefined
  return predicate(value) ? undefined : new Error(message)
}

/**
 * 异步判定一步：判据可返回 Promise，等待结果后再判定
 *
 * 两个关键约定（add-async-validation spec）：
 * 1. 空值短路发生在**调用判据之前**——异步判据往往是一次外部请求，
 *    空值 MUST NOT 触发它（用户清空输入框不该再发一次查询）
 * 2. 判据抛出的异常**不捕不吞**，沿 Promise 链原样冒泡为校验失败，
 *    避免把「外部数据源不可用」伪装成「格式不正确」
 */
export async function evaluatePredicateAsync(
  predicate: CustomPredicate,
  value: unknown,
  message: string,
): Promise<Error | undefined> {
  if (isEmptyValue(value)) return undefined
  return (await predicate(value)) ? undefined : new Error(message)
}
