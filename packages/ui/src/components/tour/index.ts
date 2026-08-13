// packages/ui/src/components/tour/index.ts
// TmTour 出口：通过 withInstall 附加 Vue 插件 install 方法
import Tour from './src/Tour.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTour = withInstall(Tour, 'TmTour')

// 类型再导出：业务方可直接 import { TmTourProps, TourProps } from '@tm/ui'
export * from './src/props'
export default TmTour
