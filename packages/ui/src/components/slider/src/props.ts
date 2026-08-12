// packages/ui/src/components/slider/src/props.ts
// TmSlider 类型定义：ant 原生 SliderProps（无公司扩展键）
import type { SliderProps } from 'ant-design-vue'

/** TmSlider = ant 原生 SliderProps */
export type TmSliderProps = SliderProps

// 类型透传：业务方可直接 import TmSliderProps / SliderProps
export type { SliderProps } from 'ant-design-vue'
