// packages/ui/src/validation/adapters/ant.ts
// toAntRule：校验配置 → ant（async-validator）规则数组，喂给 TmForm 表单项的 rules
//
// 产出策略（design D2）：
// - 正则类 → 声明式 pattern（与 vxe 侧产物判据一致）
// - 比较类 → 声明式 type + min/max（async-validator 的 number/string 校验器原生支持
//   「空串归一 undefined 后短路」，D3 空值语义无需自写分支）
// - 计算类 → 自定义 validator（两份适配器唯一分叉处：async-validator 的签名是
//   (rule, value, callback)，本实现用 Promise 风格——失败时 throw Error，异常消息即提示文案）
// - 自定义判据 → 同上，但走异步求值（判据可返回 Promise，见 add-async-validation D1）
// - required → 独立成条排在首位，空值拦截完全交给它
//
// 类型收窄注意：CustomRuleConfig 的 type 是宽泛 string，结构上与所有内置成员重叠，
// 因此必须先用 hasBuiltinType 做【正向】收窄处理内置分支；绝不可先做 isCustomRuleConfig
// 的【负向】收窄（那会把整个联合缩成 never）。

import type { RuleObject } from 'ant-design-vue/es/form'
import type { AnyValidationRuleConfig } from '../types'
import { DEFAULT_CUSTOM_FORMAT_MESSAGE, DEFAULT_REQUIRED_MESSAGE, resolveFormatMessage } from '../messages'
import { CHECKSUM_PREDICATES } from '../predicates/checksum'
import { REGEX_PATTERNS } from '../predicates/regex'
import { getCustomPredicate, hasBuiltinType } from '../registry'
import { evaluatePredicate, evaluatePredicateAsync } from './shared'

/**
 * 产出 ant 规则数组
 * - 恒返回数组：可直接绑定 `:rules="toAntRule(...)"`，且与「required 拆条」天然统一
 * @throws config.type 为未注册的自定义名时抛错（不做静默兜底，见 spec「未注册的类型名被拒」）
 */
export function toAntRule(config: AnyValidationRuleConfig): RuleObject[] {
  const rules: RuleObject[] = []

  // ① 必填规则独立成条：空值是否拦截完全由它决定（D3）
  if (config.required) {
    rules.push({
      required: true,
      message: config.requiredMessage ?? DEFAULT_REQUIRED_MESSAGE,
    })
  }

  // ② 内置分支：正向收窄后 config 为闭集联合，switch 分支内参数取用类型安全
  if (hasBuiltinType(config)) {
    const message = resolveFormatMessage(config)
    switch (config.type) {
      case 'range':
        // 声明式数值区间：async-validator 对空值原生短路（'' 会被归一为 undefined），D3 免实现
        rules.push({ type: 'number', min: config.min, max: config.max, message })
        break
      case 'length':
        // 声明式长度区间：type string 的 min/max 即长度边界
        rules.push({ type: 'string', min: config.min, max: config.max, message })
        break
      case 'idCard':
      case 'creditCode': {
        // 计算类：格式 + 校验位算法都在内核判据里，失败以异常消息提示
        const predicate = CHECKSUM_PREDICATES[config.type]
        rules.push({
          message,
          validator: (_rule: RuleObject, value: unknown) => {
            const failure = evaluatePredicate(predicate, value, message)
            return failure ? Promise.reject(failure) : Promise.resolve()
          },
        })
        break
      }
      default:
        // 剩余全部是正则类：产出声明式 pattern（与 vxe 侧同源同判据）
        rules.push({ pattern: REGEX_PATTERNS[config.type], message })
    }
    return rules
  }

  // ③ 自定义判据分支：经上一步收窄，此处 config 已是 CustomRuleConfig
  //    生成期查登记表，把名字解析为函数（D5 不产字符串名、不写 vxe 全局表）
  //    add-async-validation D1：自定义判据允许异步（远程唯一性等），故产出 async validator——
  //    async-validator 会 await 返回的 Promise，reject 出的 Error.message 即字段提示文案
  //    （async-validator dist index.js:1274 `if (res && res.then) res.then(() => cb(), e => cb(e))`）
  const predicate = getCustomPredicate(config.type)
  if (!predicate) {
    throw new Error(
      `[tm-ui validation] 未注册的校验类型 "${config.type}"，请先 registerValidator("${config.type}", predicate)`,
    )
  }
  const message = config.message ?? DEFAULT_CUSTOM_FORMAT_MESSAGE
  rules.push({
    message,
    validator: async (_rule: RuleObject, value: unknown) => {
      const failure = await evaluatePredicateAsync(predicate, value, message)
      if (failure) throw failure
    },
  })
  return rules
}
