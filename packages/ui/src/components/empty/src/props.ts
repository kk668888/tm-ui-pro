// packages/ui/src/components/empty/src/props.ts
// TmEmpty 类型定义：ant 原生 EmptyProps（当前无公司扩展键）
import type { EmptyProps } from 'ant-design-vue'

/** TmEmpty = ant 原生 EmptyProps（公司默认 description 在 defaults.ts 提供） */
export type TmEmptyProps = EmptyProps

// 类型透传：业务方可直接 import TmEmptyProps / EmptyProps
export type { EmptyProps } from 'ant-design-vue'
