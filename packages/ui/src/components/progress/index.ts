// packages/ui/src/components/progress/index.ts
// TmProgress 出口：通过 withInstall 附加 Vue 插件 install 方法
import Progress from './src/Progress.vue'
import { withInstall } from '../../utils/withInstall'

export const TmProgress = withInstall(Progress, 'TmProgress')

// 类型再导出：业务方可直接 import { TmProgressProps, TmProgressStatus, ProgressProps } from '@tm/ui'
export * from './src/props'
export * from './src/status'
export default TmProgress
