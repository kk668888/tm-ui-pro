// packages/ui/src/components/carousel/index.ts
// TmCarousel 出口：withInstall 附加 Vue 插件 install 方法
import Carousel from './src/Carousel.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCarousel = withInstall(Carousel, 'TmCarousel')
// 类型再导出：业务方可直接 import { TmCarouselProps, CarouselProps, CarouselRef } from '@tm/ui'
export * from './src/props'
export default TmCarousel
