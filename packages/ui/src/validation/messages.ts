// packages/ui/src/validation/messages.ts
// 默认文案：格式错误文案按 type 给默认值；必填文案统一默认「请输入」
//
// 设计要点（spec「提示文案拆分为格式文案与必填文案」）：
// - message（格式错）与 requiredMessage（空值）相互独立、可分别覆盖
// - range / length 的默认文案携带参数（min~max），由适配器在生成期拼接，
//   因此「带参数类型」的默认文案不走静态表，而走 resolveFormatMessage 的分支

import type { ValidationRuleConfig } from './types'

/** 必填（空值）默认文案 */
export const DEFAULT_REQUIRED_MESSAGE = '请输入'

/** 自定义判据（type 为注册名）的默认格式文案——自定义类型无法按名给语义化默认，用通用兜底 */
export const DEFAULT_CUSTOM_FORMAT_MESSAGE = '请输入正确的内容'

/** 无参类型的默认格式文案：key 与内置 type 一一对应（range/length 走参数拼接分支） */
const STATIC_DEFAULT_MESSAGES = {
  ipv4: '请输入正确的 IPv4 地址',
  ipv6: '请输入正确的 IPv6 地址',
  mac: '请输入正确的 MAC 地址',
  port: '请输入正确的端口号（0-65535）',
  phone: '请输入正确的手机号',
  email: '请输入正确的邮箱地址',
  url: '请输入正确的 URL 地址',
  idCard: '请输入正确的身份证号码',
  creditCode: '请输入正确的统一社会信用代码',
} as const

/**
 * 解析格式错误文案：显式传入优先，否则按 type 给默认
 * - range / length：默认文案拼接 min~max，让提示自带可读的区间信息
 * - 其余内置类型：查静态表
 */
export function resolveFormatMessage(config: ValidationRuleConfig): string {
  if (config.message) return config.message
  if (config.type === 'range') return `请输入 ${config.min}~${config.max} 之间的数值`
  if (config.type === 'length') return `长度需在 ${config.min}~${config.max} 位之间`
  return STATIC_DEFAULT_MESSAGES[config.type]
}
