// packages/ui/src/components/timeline/index.ts
// TmTimeline 出口：withInstall 附加 Vue 插件 install 方法（子项 TimelineItem 未封装，见 design Non-Goals）
import Timeline from './src/Timeline.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTimeline = withInstall(Timeline, 'TmTimeline')
// 模板子组件写法：ant 顶层导出 TimelineItem 别名复用（design D2）
import { TimelineItem } from 'ant-design-vue'

export const TmTimelineItem = withInstall(TimelineItem, 'TmTimelineItem')
// 类型再导出：业务方可直接 import { TmTimelineProps, TimelineProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmTimeline
