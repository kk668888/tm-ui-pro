// packages/ui/src/components/timeline/index.ts
// TmTimeline 出口：withInstall 附加 Vue 插件 install 方法（子项 TimelineItem 未封装，见 design Non-Goals）
import Timeline from './src/Timeline.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTimeline = withInstall(Timeline, 'TmTimeline')
// 类型再导出：业务方可直接 import { TmTimelineProps, TimelineProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmTimeline
