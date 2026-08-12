// packages/ui/src/components/auto-complete/src/props.ts
// TmAutoComplete 类型定义：ant 原生 AutoCompleteProps（无公司扩展键）
import type { AutoCompleteProps } from 'ant-design-vue'

/** TmAutoComplete = ant 原生 AutoCompleteProps */
export type TmAutoCompleteProps = AutoCompleteProps

// 类型透传：业务方可直接 import TmAutoCompleteProps / AutoCompleteProps
export type { AutoCompleteProps } from 'ant-design-vue'
