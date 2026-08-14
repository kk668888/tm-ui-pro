// packages/ui/src/components/statistic/index.ts
// TmStatistic 出口：TmStatistic / TmCountdown 多子组件模块
import Statistic from './src/Statistic.vue'
import Countdown from './src/Countdown.vue'
import { withInstall } from '../../utils/withInstall'

export const TmStatistic = withInstall(Statistic, 'TmStatistic')
export const TmCountdown = withInstall(Countdown, 'TmCountdown')

// 类型再导出：业务方可直接 import { TmStatisticProps, TmCountdownProps, StatisticProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmStatistic, TmCountdown }
