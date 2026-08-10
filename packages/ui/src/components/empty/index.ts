// packages/ui/src/components/empty/index.ts
// TmEmpty 出口：withInstall 附加 Vue 插件 install 方法
import Empty from './src/Empty.vue'
import { withInstall } from '../../utils/withInstall'

export const TmEmpty = withInstall(Empty, 'TmEmpty')
// 类型再导出：业务方可直接 import { TmEmptyProps, EmptyProps } from '@tm/ui'
export * from './src/props'
export default TmEmpty
