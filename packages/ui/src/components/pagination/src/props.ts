// packages/ui/src/components/pagination/src/props.ts
// TmPagination 类型定义：ant 原生 PaginationProps（公司默认 showSizeChanger/pageSizeOptions 在 defaults.ts 提供）
import type { PaginationProps } from 'ant-design-vue'

/** TmPagination = ant 原生 PaginationProps */
export type TmPaginationProps = PaginationProps

// 类型透传：业务方可直接 import TmPaginationProps / PaginationProps
export type { PaginationProps } from 'ant-design-vue'
