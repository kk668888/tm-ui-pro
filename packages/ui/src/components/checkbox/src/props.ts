// packages/ui/src/components/checkbox/src/props.ts
// TmCheckbox 类型定义：ant 原生 CheckboxProps（无公司扩展键）
import type { CheckboxProps } from 'ant-design-vue'

/** TmCheckbox = ant 原生 CheckboxProps */
export type TmCheckboxProps = CheckboxProps

// 类型透传：业务方可直接 import TmCheckboxProps / CheckboxProps
export type { CheckboxProps } from 'ant-design-vue'
