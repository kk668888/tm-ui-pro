// packages/ui/src/components/descriptions/index.ts
// TmDescriptions 出口：TmDescriptions / TmDescriptionsItem 多子组件模块
import Descriptions from './src/Descriptions.vue'
import DescriptionsItem from './src/DescriptionsItem.vue'
import { withInstall } from '../../utils/withInstall'

export const TmDescriptions = withInstall(Descriptions, 'TmDescriptions')
export const TmDescriptionsItem = withInstall(DescriptionsItem, 'TmDescriptionsItem')

// 类型再导出：业务方可直接 import { TmDescriptionsProps, TmDescriptionsItemProps, DescriptionsProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmDescriptions, TmDescriptionsItem }
