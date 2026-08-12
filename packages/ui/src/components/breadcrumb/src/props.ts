// packages/ui/src/components/breadcrumb/src/props.ts
// TmBreadcrumb 类型定义：ant 原生 BreadcrumbProps / BreadcrumbItemProps / BreadcrumbSeparatorProps（无公司扩展键）
import type { BreadcrumbProps } from 'ant-design-vue'
import type { BreadcrumbItemProps } from 'ant-design-vue'
import type { BreadcrumbSeparatorProps } from 'ant-design-vue'

/** TmBreadcrumb = ant 原生 BreadcrumbProps */
export type TmBreadcrumbProps = BreadcrumbProps

/** TmBreadcrumbItem = ant 原生 BreadcrumbItemProps */
export type TmBreadcrumbItemProps = BreadcrumbItemProps

/** TmBreadcrumbSeparator = ant 原生 BreadcrumbSeparatorProps */
export type TmBreadcrumbSeparatorProps = BreadcrumbSeparatorProps

// 类型透传
export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbSeparatorProps,
} from 'ant-design-vue'
