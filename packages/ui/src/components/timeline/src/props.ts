// packages/ui/src/components/timeline/src/props.ts
// TmTimeline 类型定义：ant 原生 TimelineProps
import type { TimelineProps } from 'ant-design-vue'

/** TmTimeline = ant 原生 TimelineProps */
export type TmTimelineProps = TimelineProps

// 类型透传：业务方可直接 import TmTimelineProps / TimelineProps
export type { TimelineProps } from 'ant-design-vue'
