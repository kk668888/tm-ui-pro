// packages/ui/src/components/result/src/props.ts
// TmResult 类型定义：ant 原生 ResultProps（当前无公司扩展键）
import type { ResultProps } from 'ant-design-vue'

/** TmResult = ant 原生 ResultProps（薄封装纯透传） */
export type TmResultProps = ResultProps

// 类型透传：业务方可直接 import TmResultProps / ResultProps
export type { ResultProps } from 'ant-design-vue'
