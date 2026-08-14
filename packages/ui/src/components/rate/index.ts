// packages/ui/src/components/rate/index.ts
// TmRate 出口：withInstall 附加 Vue 插件 install 方法
import Rate from './src/Rate.vue'
import { withInstall } from '../../utils/withInstall'

export const TmRate = withInstall(Rate, 'TmRate')
// 类型再导出：业务方可直接 import { TmRateProps, RateProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmRate
