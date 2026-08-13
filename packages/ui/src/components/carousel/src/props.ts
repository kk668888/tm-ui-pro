// packages/ui/src/components/carousel/src/props.ts
// TmCarousel 类型定义：ant 原生 CarouselProps；CarouselRef 实例类型（从模块级深层导入）
import type { CarouselProps } from 'ant-design-vue'
// CarouselRef 未从 ant 顶层导出，从模块级深层导入（ant 无 exports map，路径稳定）
import type { CarouselRef } from 'ant-design-vue/es/carousel'

/** TmCarousel = ant 原生 CarouselProps */
export type TmCarouselProps = CarouselProps

// 类型透传：业务方可直接 import TmCarouselProps / CarouselProps / CarouselRef
export type { CarouselProps } from 'ant-design-vue'
export type { CarouselRef } from 'ant-design-vue/es/carousel'
