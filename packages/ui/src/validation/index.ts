// packages/ui/src/validation/index.ts
// 校验工具统一出口：业务方 `import { toAntRule, toVxeRule, registerValidator } from '@trustmo/tm-ui'`
//
// 用法速览：
// - TmForm：  <TmFormItem :rules="toAntRule({ type: 'phone', required: true })">
// - TmTable： columns: [{ field: 'ip', rules: toVxeRule({ type: 'ipv4' }) }]
//             提交前 tableRef.value.fullValidate() 批量校验
// - 扩展：    registerValidator('ticketNo', isTicketNo) 后，type: 'ticketNo' 即可用
export { toAntRule } from './adapters/ant'
export { toVxeRule } from './adapters/vxe'
export { registerValidator, getCustomPredicate, isBuiltinRuleType } from './registry'
export type { CustomPredicate } from './registry'
export type {
  AnyValidationRuleConfig,
  BaseRuleConfig,
  ChecksumRuleConfig,
  ChecksumRuleType,
  CustomRuleConfig,
  LengthRuleConfig,
  RangeRuleConfig,
  RegexRuleConfig,
  RegexRuleType,
  ValidationRuleConfig,
} from './types'
