// packages/ui/src/components/page-header/index.ts
// TmPageHeader 出口：withInstall 附加 Vue 插件 install 方法
import PageHeader from './src/PageHeader.vue'
import { withInstall } from '../../utils/withInstall'

export const TmPageHeader = withInstall(PageHeader, 'TmPageHeader')
// 类型再导出：业务方可直接 import { TmPageHeaderProps, PageHeaderProps } from '@tm/ui'
export * from './src/props'
export default TmPageHeader
