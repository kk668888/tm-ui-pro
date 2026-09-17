// packages/ui/src/validation/adapters/vxe.ts
// toVxeRule：校验配置 → vxe 规则数组，挂到 TmTable 列声明的 rules（vxe 原生能力，组件零改动）
//
// 产出策略与 toAntRule 同构（design D2），两处系统性差异：
// 1. 提示字段是 content —— ValidatorRule 的 message 已 @deprecated，禁止使用
// 2. 自定义 validator 的签名是 ({ cellValue, ... })，返回 void | Error | Promise<void>：
//    返回 Error 即判失败，其 .message 直接作为单元格提示文案（hook.js 485-492）；
//    返回 Promise 则失败必须 reject（hook.js 488-494 的 .catch 分支），二者行为等价。
//    自定义判据允许异步，故其 validator 恒为异步形态（add-async-validation D6）
//
// 批量校验：业务经 TmTable 透传的实例方法 tableRef.value.fullValidate() 完成（design D6）
//
// 类型收窄注意（同 ant.ts）：必须先用 hasBuiltinType 正向收窄处理内置分支，
// 否则 CustomRuleConfig(type: string) 的负向收窄会把联合缩成 never。

import type { VxeTableDefines } from 'vxe-table'
import type { AnyValidationRuleConfig } from '../types'
import { DEFAULT_CUSTOM_FORMAT_MESSAGE, DEFAULT_REQUIRED_MESSAGE, resolveFormatMessage } from '../messages'
import { CHECKSUM_PREDICATES } from '../predicates/checksum'
import { REGEX_PATTERNS } from '../predicates/regex'
import { getCustomPredicate, hasBuiltinType } from '../registry'
import { evaluatePredicate, evaluatePredicateAsync } from './shared'

/**
 * 产出 vxe 列规则数组
 * - 恒返回数组：可直接挂 `columns: [{ field, rules: toVxeRule(...) }]`
 * @throws config.type 为未注册的自定义名时抛错（与 toAntRule 行为一致）
 */
export function toVxeRule(config: AnyValidationRuleConfig): VxeTableDefines.ValidatorRule[] {
  const rules: VxeTableDefines.ValidatorRule[] = []

  // ① 必填规则独立成条：vxe 的 checkRuleStatus 对 required + 空值原生拦截（D3）
  if (config.required) {
    rules.push({
      required: true,
      content: config.requiredMessage ?? DEFAULT_REQUIRED_MESSAGE,
    })
  }

  // ② 内置分支：正向收窄后按类型产出（与 toAntRule 逐型对齐，保证判据等价）
  if (hasBuiltinType(config)) {
    const message = resolveFormatMessage(config)
    switch (config.type) {
      case 'range':
        // 声明式数值区间：vxe 的 type number 会做 Number() 转换后比对 min/max
        rules.push({ type: 'number', min: config.min, max: config.max, content: message })
        break
      case 'length':
        // 声明式长度区间：type string 时 min/max 即长度边界
        rules.push({ type: 'string', min: config.min, max: config.max, content: message })
        break
      case 'idCard':
      case 'creditCode': {
        // 计算类：返回 Error 即判失败，Error.message 即单元格提示
        const predicate = CHECKSUM_PREDICATES[config.type]
        rules.push({
          content: message,
          validator: ({ cellValue }) => evaluatePredicate(predicate, cellValue, message),
        })
        break
      }
      default:
        // 剩余全部是正则类：声明式 pattern（与 ant 侧同源同判据）
        rules.push({ pattern: REGEX_PATTERNS[config.type], content: message })
    }
    return rules
  }

  // ③ 自定义判据分支：config 已收窄为 CustomRuleConfig
  //    不产字符串名——vxe 虽支持 validator 字符串名，但那依赖全局注册表，这里刻意不用（D5）
  const predicate = getCustomPredicate(config.type)
  if (!predicate) {
    throw new Error(
      `[tm-ui validation] 未注册的校验类型 "${config.type}"，请先 registerValidator("${config.type}", predicate)`,
    )
  }
  const message = config.message ?? DEFAULT_CUSTOM_FORMAT_MESSAGE
  rules.push({
    content: message,
    // add-async-validation D6：自定义判据的 validator **恒为异步形态**（失败 reject）。
    // 不按判据是否 AsyncFunction 分支判断——嗅探会把「同步函数返回 Promise」误判为同步，
    // 使 Promise 被当 truthy 而静默恒通过（正确性缺陷，比多一次微任务严重得多）。
    // vxe 两种形态都支持：同步返回 Error 走 isError 分支；返回 Promise 走 .catch 分支，
    // 失败时 e.message 即单元格提示（hook.js 483–494）
    validator: async ({ cellValue }) => {
      const failure = await evaluatePredicateAsync(predicate, cellValue, message)
      if (failure) throw failure
    },
  })
  return rules
}
