// packages/ui/src/components/card/index.ts
// TmCard 出口：withInstall 附加 Vue 插件 install 方法
import Card from './src/Card.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCard = withInstall(Card, 'TmCard')
// 类型再导出：业务方可直接 import { TmCardProps, CardProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmCard
