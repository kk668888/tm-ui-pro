// packages/ui/src/validation/__tests__/registry.spec.ts
// 注册表单测：注册 / 覆盖 / 内置名保护 / 类型守卫
import { describe, it, expect } from 'vitest'
import {
  registerValidator,
  getCustomPredicate,
  isBuiltinRuleType,
  hasBuiltinType,
  isCustomRuleConfig,
} from '../registry'

describe('registerValidator', () => {
  it('注册后可按名取回同一判据函数', () => {
    const predicate = (value: unknown): boolean => value === 'ok'
    registerValidator('reg-spec-case', predicate)
    expect(getCustomPredicate('reg-spec-case')).toBe(predicate)
  })

  it('同名重复注册以后注册者为准', () => {
    registerValidator('overwrite-spec-case', () => true)
    registerValidator('overwrite-spec-case', () => false)
    expect(getCustomPredicate('overwrite-spec-case')?.('x')).toBe(false)
  })

  it('内置类型名禁止覆盖，直接抛错', () => {
    expect(() => registerValidator('ipv4', () => true)).toThrow(/内置类型/)
    expect(() => registerValidator('idCard', () => true)).toThrow(/内置类型/)
    expect(() => registerValidator('range', () => true)).toThrow(/内置类型/)
  })
})

describe('内置 / 自定义类型守卫', () => {
  it('isBuiltinRuleType 识别全部内置名', () => {
    for (const name of ['ipv4', 'ipv6', 'mac', 'port', 'phone', 'email', 'url']) {
      expect(isBuiltinRuleType(name)).toBe(true)
    }
    expect(isBuiltinRuleType('idCard')).toBe(true)
    expect(isBuiltinRuleType('creditCode')).toBe(true)
    expect(isBuiltinRuleType('range')).toBe(true)
    expect(isBuiltinRuleType('length')).toBe(true)
  })

  it('自定义名不是内置名', () => {
    expect(isBuiltinRuleType('ticketNo')).toBe(false)
    expect(isBuiltinRuleType('')).toBe(false)
  })

  it('hasBuiltinType / isCustomRuleConfig 互为反向收窄', () => {
    const builtinConfig = { type: 'ipv4' }
    const customConfig = { type: 'ticketNo' }
    expect(hasBuiltinType(builtinConfig)).toBe(true)
    expect(isCustomRuleConfig(builtinConfig)).toBe(false)
    expect(hasBuiltinType(customConfig)).toBe(false)
    expect(isCustomRuleConfig(customConfig)).toBe(true)
  })
})
