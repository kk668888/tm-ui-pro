// packages/ui/src/components/watermark/src/props.ts
// TmWatermark 类型定义：ant 原生 WatermarkProps
import type { WatermarkProps } from 'ant-design-vue'

/** TmWatermark = ant 原生 WatermarkProps */
export type TmWatermarkProps = WatermarkProps

// 类型透传：业务方可直接 import TmWatermarkProps / WatermarkProps
export type { WatermarkProps } from 'ant-design-vue'
