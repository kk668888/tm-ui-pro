// packages/ui/src/components/badge/index.ts
// TmBadge 出口：withInstall 附加 Vue 插件 install 方法
import Badge from './src/Badge.vue'
import { withInstall } from '../../utils/withInstall'

export const TmBadge = withInstall(Badge, 'TmBadge')
// 缎带子组件：ant 顶层导出 BadgeRibbon 别名复用（design D2）
import { BadgeRibbon } from 'ant-design-vue'

export const TmBadgeRibbon = withInstall(BadgeRibbon, 'TmBadgeRibbon')
// 类型再导出：业务方可直接 import { TmBadgeProps, BadgeProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmBadge
