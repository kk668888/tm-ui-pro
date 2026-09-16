// packages/ui/src/validation/registry.ts
// 自定义判据登记表：registerValidator 写入，适配器在【生成期】把类型名解析为函数
//
// 设计要点（design D5）：
// - 只写本模块私有的 Map，MUST NOT 写入 vxe 全局注册表 VxeUI.validators，
//   也不经任何全局对象暴露——产出的规则里 validator 恒为函数、不产字符串名，
//   ant / vxe 两侧行为对称且无全局副作用
// - 内置类型名禁止被自定义判据覆盖（registerValidator 直接抛错），避免静默改语义

import type {
  AnyValidationRuleConfig,
  CustomRuleConfig,
  ValidationRuleConfig,
} from './types'
import { CHECKSUM_PREDICATES, REGEX_PATTERNS } from './predicates'

/** 自定义判据：拿到待校验值，返回是否通过 */
export type CustomPredicate = (value: unknown) => boolean

/** 自定义判据登记表（模块私有，禁止外部直接读写） */
const customPredicates = new Map<string, CustomPredicate>()

/** 内置类型名清单：登记表用它拦截重名注册；适配器用它区分「内置分支 / 自定义分支」 */
export const BUILTIN_RULE_TYPES: ReadonlySet<string> = new Set<string>([
  ...Object.keys(REGEX_PATTERNS),
  ...Object.keys(CHECKSUM_PREDICATES),
  'range',
  'length',
])

/**
 * 注册自定义判据
 * - 注册后即可 `toAntRule({ type: name })` / `toVxeRule({ type: name })`
 * - 同名重复注册以后注册者为准
 * - @throws 名字与内置类型冲突时抛错（内置语义不允许被静默改写）
 */
export function registerValidator(name: string, predicate: CustomPredicate): void {
  if (isBuiltinRuleType(name)) {
    throw new Error(`[tm-ui validation] 判据名 "${name}" 是内置类型，禁止覆盖，请换一个名字`)
  }
  customPredicates.set(name, predicate)
}

/** 取自定义判据；不存在返回 undefined */
export function getCustomPredicate(name: string): CustomPredicate | undefined {
  return customPredicates.get(name)
}

/** 该名字是否为内置校验类型 */
export function isBuiltinRuleType(type: string): boolean {
  return BUILTIN_RULE_TYPES.has(type)
}

/**
 * 类型守卫：配置是否为「内置类型」
 * 通过后 config 收窄为闭集联合，switch 分支内即可安全取 min/max 等参数
 */
export function hasBuiltinType(
  config: AnyValidationRuleConfig,
): config is ValidationRuleConfig {
  return isBuiltinRuleType(config.type)
}

/** 收窄守卫的反向断言：配置是否为「自定义判据」配置 */
export function isCustomRuleConfig(config: AnyValidationRuleConfig): config is CustomRuleConfig {
  return !isBuiltinRuleType(config.type)
}
