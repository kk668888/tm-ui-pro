// packages/ui/src/components/card/index.ts
// TmCard 出口：withInstall 附加 Vue 插件 install 方法
import Card from './src/Card.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCard = withInstall(Card, 'TmCard')
// 栅格单元/元信息子组件：ant 顶层导出别名复用（design D2）
import { CardGrid, CardMeta } from 'ant-design-vue'

export const TmCardGrid = withInstall(CardGrid, 'TmCardGrid')
export const TmCardMeta = withInstall(CardMeta, 'TmCardMeta')
// 类型再导出：业务方可直接 import { TmCardProps, CardProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmCard
