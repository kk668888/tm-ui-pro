// packages/ui/src/components/collapse/index.ts
// TmCollapse 出口：TmCollapse / TmCollapsePanel 多子组件模块
import Collapse from './src/Collapse.vue'
import CollapsePanel from './src/CollapsePanel.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCollapse = withInstall(Collapse, 'TmCollapse')
export const TmCollapsePanel = withInstall(CollapsePanel, 'TmCollapsePanel')

// 类型再导出：业务方可直接 import { TmCollapseProps, TmCollapsePanelProps, CollapseProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmCollapse, TmCollapsePanel }
