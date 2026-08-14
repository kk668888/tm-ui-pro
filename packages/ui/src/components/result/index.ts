// packages/ui/src/components/result/index.ts
// TmResult 出口：withInstall 附加 Vue 插件 install 方法
import Result from './src/Result.vue'
import { withInstall } from '../../utils/withInstall'

export const TmResult = withInstall(Result, 'TmResult')
// 类型再导出：业务方可直接 import { TmResultProps, ResultProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmResult
