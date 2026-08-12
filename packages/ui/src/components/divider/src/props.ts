// packages/ui/src/components/divider/src/props.ts
// TmDivider 类型定义：ant 原生 DividerProps（公司默认 type/orientation 在 defaults.ts 提供）
import type { DividerProps } from 'ant-design-vue'

/** TmDivider = ant 原生 DividerProps（公司默认 type/orientation 在 defaults.ts 提供） */
export type TmDividerProps = DividerProps

// 类型透传：业务方可直接 import TmDividerProps / DividerProps
export type { DividerProps } from 'ant-design-vue'
