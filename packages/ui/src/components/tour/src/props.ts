// packages/ui/src/components/tour/src/props.ts
// TmTour 类型定义：ant 原生 TourProps（含 TourStepProps）
import type { TourProps } from 'ant-design-vue'

/** TmTour = ant 原生 TourProps */
export type TmTourProps = TourProps

// 类型透传：业务方可直接 import TmTourProps / TourProps
export type { TourProps } from 'ant-design-vue'
