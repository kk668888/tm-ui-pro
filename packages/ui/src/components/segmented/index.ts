// packages/ui/src/components/segmented/index.ts
// TmSegmented 出口：withInstall 附加 Vue 插件 install 方法
import Segmented from './src/Segmented.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSegmented = withInstall(Segmented, 'TmSegmented')
// 类型再导出：业务方可直接 import { TmSegmentedProps, SegmentedProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmSegmented
