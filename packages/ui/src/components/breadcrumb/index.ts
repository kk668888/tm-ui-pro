// packages/ui/src/components/breadcrumb/index.ts
// TmBreadcrumb 出口：TmBreadcrumb / TmBreadcrumbItem / TmBreadcrumbSeparator 多子组件模块
import Breadcrumb from './src/Breadcrumb.vue'
import BreadcrumbItem from './src/BreadcrumbItem.vue'
import BreadcrumbSeparator from './src/BreadcrumbSeparator.vue'
import { withInstall } from '../../utils/withInstall'

export const TmBreadcrumb = withInstall(Breadcrumb, 'TmBreadcrumb')
export const TmBreadcrumbItem = withInstall(BreadcrumbItem, 'TmBreadcrumbItem')
export const TmBreadcrumbSeparator = withInstall(BreadcrumbSeparator, 'TmBreadcrumbSeparator')

// 类型透传：业务方可直接 import { BreadcrumbProps, TmBreadcrumbProps, ... } from '@tm/ui'
export type {
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbSeparatorProps,
} from 'ant-design-vue'
export type {
  TmBreadcrumbProps,
  TmBreadcrumbItemProps,
  TmBreadcrumbSeparatorProps,
} from './src/props'

export default { TmBreadcrumb, TmBreadcrumbItem, TmBreadcrumbSeparator }
