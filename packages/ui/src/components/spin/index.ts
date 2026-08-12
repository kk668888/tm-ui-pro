// packages/ui/src/components/spin/index.ts
// TmSpin 出口：withInstall 附加 Vue 插件 install 方法
import Spin from './src/Spin.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSpin = withInstall(Spin, 'TmSpin')
// 类型再导出：业务方可直接 import { TmSpinProps, SpinProps } from '@tm/ui'
export * from './src/props'
export default TmSpin
