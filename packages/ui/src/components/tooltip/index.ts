// packages/ui/src/components/tooltip/index.ts
// TmTooltip 出口：withInstall 附加 Vue 插件 install 方法
import Tooltip from './src/Tooltip.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTooltip = withInstall(Tooltip, 'TmTooltip')
// 类型再导出：业务方可直接 import { TmTooltipProps, TooltipProps, TooltipPlacement } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmTooltip
