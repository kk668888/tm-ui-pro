// packages/ui/src/components/page-header/src/props.ts
// TmPageHeader 类型定义：ant 原生 PageHeaderProps（无公司扩展键）
import type { PageHeaderProps } from 'ant-design-vue'

/** TmPageHeader = ant 原生 PageHeaderProps */
export type TmPageHeaderProps = PageHeaderProps

// 类型透传：业务方可直接 import TmPageHeaderProps / PageHeaderProps
export type { PageHeaderProps } from 'ant-design-vue'
