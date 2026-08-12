// packages/ui/src/components/grid/src/props.ts
// TmGrid 类型定义：ant 原生 RowProps / ColProps（无公司扩展键）
import type { RowProps } from 'ant-design-vue'
import type { ColProps } from 'ant-design-vue'

/** TmRow = ant 原生 RowProps（24 栅格容器） */
export type TmRowProps = RowProps

/** TmCol = ant 原生 ColProps（栅格列） */
export type TmColProps = ColProps

// 类型透传：业务方可直接 import TmRowProps / TmColProps / RowProps / ColProps
export type { RowProps, ColProps } from 'ant-design-vue'
