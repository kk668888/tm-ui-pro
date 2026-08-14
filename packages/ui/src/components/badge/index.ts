// packages/ui/src/components/badge/index.ts
// TmBadge 出口：withInstall 附加 Vue 插件 install 方法
import Badge from './src/Badge.vue'
import { withInstall } from '../../utils/withInstall'

export const TmBadge = withInstall(Badge, 'TmBadge')
// 类型再导出：业务方可直接 import { TmBadgeProps, BadgeProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmBadge
