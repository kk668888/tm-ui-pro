// packages/ui/src/components/affix/src/props.ts
// TmAffix 类型定义：ant 原生 AffixProps（无公司扩展键）
import type { AffixProps } from 'ant-design-vue'

/** TmAffix = ant 原生 AffixProps */
export type TmAffixProps = AffixProps

// 类型透传：业务方可直接 import TmAffixProps / AffixProps
export type { AffixProps } from 'ant-design-vue'
