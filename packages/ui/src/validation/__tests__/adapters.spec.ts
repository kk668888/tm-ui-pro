// packages/ui/src/validation/__tests__/adapters.spec.ts
// 适配器单测：产出规则形状（pattern / min-max / validator、required 拆条、双文案默认）
// + 跨适配器判据等价（同一输入驱动两份规则，结论一致）+ 未注册类型名抛错 + 不写 vxe 全局表
import { describe, it, expect } from 'vitest'
import { VxeUI } from 'vxe-pc-ui'
import type { RuleObject } from 'ant-design-vue/es/form'
import { toAntRule } from '../adapters/ant'
import { toVxeRule } from '../adapters/vxe'
import { REGEX_PATTERNS } from '../predicates/regex'
import { registerValidator } from '../registry'

/** 触发 ant 计算类规则的 validator：返回校验失败文案；通过返回 undefined */
async function runAntValidator(rule: RuleObject, value: unknown): Promise<string | undefined> {
  const validator = rule.validator
  if (!validator) return undefined
  try {
    // ant 的 validator 声明签名是 (rule, value, callback)，调用需补第三个 no-op callback
    await validator({} as RuleObject, value, () => {})
    return undefined
  } catch (error) {
    return error instanceof Error ? error.message : String(error)
  }
}

/** vxe 自定义 validator 的最小可调用形状（测试只关心 cellValue 入参与 Error 返回） */
type VxeCellValidator = (params: { cellValue: unknown }) => Error | undefined

/** 触发 vxe 计算类规则的 validator：返回校验失败的 Error；通过返回 undefined */
function runVxeValidator(rule: unknown, cellValue: unknown): Error | undefined {
  return (rule as VxeCellValidator)({ cellValue })
}

describe('toAntRule / toVxeRule：正则类产出声明式 pattern', () => {
  it('ant 产出 { pattern, message }，且正则与内核同源', () => {
    const [rule] = toAntRule({ type: 'ipv4' })
    expect(rule).toEqual({ pattern: REGEX_PATTERNS.ipv4, message: '请输入正确的 IPv4 地址' })
  })

  it('vxe 产出 { pattern, content }（提示字段必须是 content，禁用已废弃的 message 字段）', () => {
    const [rule] = toVxeRule({ type: 'mac' })
    expect(rule).toEqual({ pattern: REGEX_PATTERNS.mac, content: '请输入正确的 MAC 地址' })
    expect(rule).not.toHaveProperty('message')
  })

  it('message 覆盖默认文案', () => {
    const [antRule] = toAntRule({ type: 'phone', message: '手机号不对' })
    const [vxeRule] = toVxeRule({ type: 'phone', message: '手机号不对' })
    expect(antRule.message).toBe('手机号不对')
    expect(vxeRule.content).toBe('手机号不对')
  })

  it('同一 type 两份产出引用同一个 RegExp（判据同源，不会漂移）', () => {
    const [antRule] = toAntRule({ type: 'url' })
    const [vxeRule] = toVxeRule({ type: 'url' })
    expect((antRule as { pattern: RegExp }).pattern).toBe((vxeRule as { pattern: RegExp }).pattern)
  })
})

describe('toAntRule / toVxeRule：比较类产出声明式区间', () => {
  it('range 产出数值区间（type number + min/max）', () => {
    const [antRule] = toAntRule({ type: 'range', min: 1, max: 100 })
    const [vxeRule] = toVxeRule({ type: 'range', min: 1, max: 100 })
    expect(antRule).toMatchObject({ type: 'number', min: 1, max: 100 })
    expect(vxeRule).toMatchObject({ type: 'number', min: 1, max: 100 })
  })

  it('length 产出长度区间（type string + min/max）', () => {
    const [antRule] = toAntRule({ type: 'length', min: 2, max: 20 })
    const [vxeRule] = toVxeRule({ type: 'length', min: 2, max: 20 })
    expect(antRule).toMatchObject({ type: 'string', min: 2, max: 20 })
    expect(vxeRule).toMatchObject({ type: 'string', min: 2, max: 20 })
  })

  it('range/length 默认文案拼接 min~max', () => {
    const [antRange] = toAntRule({ type: 'range', min: 1, max: 100 })
    const [antLength] = toAntRule({ type: 'length', min: 2, max: 20 })
    expect(antRange.message).toBe('请输入 1~100 之间的数值')
    expect(antLength.message).toBe('长度需在 2~20 位之间')
  })
})

describe('适配器：required 独立成条 + 双文案', () => {
  it('required: true 产出两条规则（必填在前，判据在后）', () => {
    const rules = toAntRule({ type: 'phone', required: true })
    expect(rules).toHaveLength(2)
    expect(rules[0]).toEqual({ required: true, message: '请输入' })
    expect(rules[1]).toMatchObject({ pattern: REGEX_PATTERNS.phone })
  })

  it('vxe 侧同样拆条，必填字段用 content', () => {
    const rules = toVxeRule({ type: 'phone', required: true })
    expect(rules).toHaveLength(2)
    expect(rules[0]).toEqual({ required: true, content: '请输入' })
    expect(rules[1]).toMatchObject({ pattern: REGEX_PATTERNS.phone })
  })

  it('requiredMessage 覆盖默认必填文案', () => {
    const [requiredRule] = toAntRule({ type: 'phone', required: true, requiredMessage: '手机号必填' })
    expect(requiredRule).toEqual({ required: true, message: '手机号必填' })
  })

  it('非必填时只产出判据一条', () => {
    expect(toAntRule({ type: 'email' })).toHaveLength(1)
    expect(toVxeRule({ type: 'email' })).toHaveLength(1)
  })
})

describe('适配器：计算类（校验位）产出 validator 且两份判定一致', () => {
  const CONFIG = { type: 'idCard', required: true } as const
  // 同一组输入喂给两份规则，期望逐值结论一致（spec「两份判据等价」）
  const VALUES = ['', null, undefined, '11010519491231002X', '110105194912310021'] as const
  const EXPECTED = [true, true, true, true, false] as const

  it('ant 侧 validator 对空值短路、对校验位错误给格式文案', async () => {
    const rules = toAntRule(CONFIG)
    expect(rules[0]).toEqual({ required: true, message: '请输入' })
    expect(await runAntValidator(rules[1], '')).toBeUndefined()
    expect(await runAntValidator(rules[1], '11010519491231002X')).toBeUndefined()
    expect(await runAntValidator(rules[1], '110105194912310021')).toBe('请输入正确的身份证号码')
  })

  it('vxe 侧 validator 对空值短路、对校验位错误返回 Error', () => {
    const rules = toVxeRule(CONFIG)
    expect(rules[0]).toEqual({ required: true, content: '请输入' })
    expect(typeof rules[1].validator).toBe('function')
    expect(runVxeValidator(rules[1].validator, '')).toBeUndefined()
    expect(runVxeValidator(rules[1].validator, '11010519491231002X')).toBeUndefined()
    expect(runVxeValidator(rules[1].validator, '110105194912310021')?.message).toBe(
      '请输入正确的身份证号码',
    )
  })

  it('跨适配器等价：同一组输入两份结论一致', async () => {
    // required: true 时产出 [必填, 判据]，判据在第二条
    const antFormat = toAntRule(CONFIG)[1]
    const vxeValidator = toVxeRule(CONFIG)[1].validator
    for (let i = 0; i < VALUES.length; i++) {
      const antFail = await runAntValidator(antFormat, VALUES[i])
      const vxeFail = runVxeValidator(vxeValidator, VALUES[i])
      expect({
        value: VALUES[i],
        antPass: antFail === undefined,
        vxePass: vxeFail === undefined,
      }).toEqual({
        value: VALUES[i],
        antPass: EXPECTED[i],
        vxePass: EXPECTED[i],
      })
    }
  })
})

describe('适配器：自定义判据', () => {
  it('注册后两个适配器均按自定义判据产出规则', async () => {
    registerValidator('ticketNo', (value) => value === 'OK')
    const [antRule] = toAntRule({ type: 'ticketNo', message: '工单号不合法' })
    expect(await runAntValidator(antRule, 'OK')).toBeUndefined()
    expect(await runAntValidator(antRule, 'NO')).toBe('工单号不合法')

    const [vxeRule] = toVxeRule({ type: 'ticketNo' })
    expect(runVxeValidator(vxeRule.validator, 'OK')).toBeUndefined()
    expect(runVxeValidator(vxeRule.validator, 'NO')?.message).toBe('请输入正确的内容')
  })

  it('未注册的自定义名抛出明确错误（ant / vxe 行为一致）', () => {
    expect(() => toAntRule({ type: 'never-registered' })).toThrow(/never-registered/)
    expect(() => toVxeRule({ type: 'never-registered' })).toThrow(/never-registered/)
  })
})

describe('适配器：不持有跨调用状态（spec「不引入运行时全局状态」）', () => {
  it('乱序交错调用适配器，同配置产出与结论不变', async () => {
    const first = toAntRule({ type: 'phone' })
    // 中间穿插其他类型的调用，模拟任意调用顺序
    toVxeRule({ type: 'idCard', required: true })
    toAntRule({ type: 'range', min: 1, max: 100 })
    toVxeRule({ type: 'length', min: 2, max: 20 })

    const second = toAntRule({ type: 'phone' })
    expect(second).toEqual(first)
    // pattern 规则的判据在正则上（无 validator 函数），直接断言判定结论
    const patternRule = second[0] as { pattern: RegExp }
    expect(patternRule.pattern.test('13800138000')).toBe(true)
    expect(patternRule.pattern.test('123')).toBe(false)
  })
})

describe('适配器：不写入 vxe 全局注册表（design D5）', () => {
  it('注册自定义判据后，VxeUI.validators 中不存在该判据', () => {
    registerValidator('no-bridge-check', () => true)
    expect(VxeUI.validators.get('no-bridge-check')).toBeUndefined()
  })
})
