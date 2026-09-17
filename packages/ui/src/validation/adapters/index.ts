// packages/ui/src/validation/adapters/index.ts
// 适配器出口：ant / vxe 两侧统一从这里取
export { toAntRule } from './ant'
export { toVxeRule } from './vxe'
export { isEmptyValue } from './shared'
export type { ValuePredicate } from '../types'
