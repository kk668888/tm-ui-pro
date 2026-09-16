// packages/ui/src/validation/predicates/checksum.ts
// 计算类判据内核：身份证（GB 11643）与统一社会信用代码（GB 32100）的完整校验位校验
//
// spec 要求：两者 MUST NOT 只做长度与字符集校验——格式之外必须执行校验位/校验码算法。
// 算法为纯函数自实现（design D8），不引入第三方校验库。

/** 18 位身份证格式：前 17 位数字 + 第 18 位数字或 X（大小写均可，判定时归一为大写） */
const ID_CARD_PATTERN = /^\d{17}[\dXx]$/

/** GB 11643 加权因子（第 1-17 位） */
const ID_CARD_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] as const

/** GB 11643 校验码表：模 11 的余数 → 第 18 位字符（ISO 7064 MOD 11-2） */
const ID_CARD_CHECK_CHARS = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] as const

/**
 * 18 位公民身份号码判据（GB 11643）
 * - 第 1 步：格式（17 位数字 + 1 位校验位）
 * - 第 2 步：加权求和 mod 11，比对第 18 位校验码
 */
export function isIdCard(value: unknown): boolean {
  if (typeof value !== 'string' || !ID_CARD_PATTERN.test(value)) return false
  const sum = ID_CARD_WEIGHTS.reduce(
    (acc, weight, index) => acc + Number(value[index]) * weight,
    0,
  )
  const expected = ID_CARD_CHECK_CHARS[sum % 11]
  return value[17].toUpperCase() === expected
}

/**
 * GB 32100 字符集：阿拉伯数字 + 大写字母（不含 I、O、S、V、Z，共 31 个字符）
 * 字符下标即其「值」：0-9 → 0-9，A → 10 … Y → 30
 */
const CREDIT_CODE_CHARSET = '0123456789ABCDEFGHJKLMNPQRTUWXY'

/** GB 32100 加权因子（第 1-17 位，附录 A） */
const CREDIT_CODE_WEIGHTS = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28] as const

/** 18 位统一社会信用代码格式：字符集内 18 位（大小写敏感，标准要求大写） */
const CREDIT_CODE_PATTERN = /^[0-9A-HJ-NP-RT-UW-Y]{18}$/

/**
 * 18 位统一社会信用代码判据（GB 32100）
 * - 第 1 步：格式（字符集内 18 位）
 * - 第 2 步：校验码 C18 = 31 - (Σ Ci×Wi) mod 31；当模为 0 时 C18 记 0
 */
export function isCreditCode(value: unknown): boolean {
  if (typeof value !== 'string' || !CREDIT_CODE_PATTERN.test(value)) return false
  const sum = CREDIT_CODE_WEIGHTS.reduce((acc, weight, index) => {
    const charValue = CREDIT_CODE_CHARSET.indexOf(value[index])
    // indexOf 结果必然 ≥ 0：格式正则已保证字符都在字符集内
    return acc + charValue * weight
  }, 0)
  const checkValue = (31 - (sum % 31)) % 31
  return value[17] === CREDIT_CODE_CHARSET[checkValue]
}

/** 计算类判据表：按 type 取值级判据（适配器生成 validator 时按 type 取用） */
export const CHECKSUM_PREDICATES = {
  idCard: isIdCard,
  creditCode: isCreditCode,
} as const

/** 计算类类型名（与 CHECKSUM_PREDICATES 的 key 一致） */
export type ChecksumPredicateKey = keyof typeof CHECKSUM_PREDICATES
