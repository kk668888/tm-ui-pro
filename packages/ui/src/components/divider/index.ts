// packages/ui/src/components/divider/index.ts
// TmDivider 出口：withInstall 附加 Vue 插件 install 方法
import Divider from './src/Divider.vue'
import { withInstall } from '../../utils/withInstall'

export const TmDivider = withInstall(Divider, 'TmDivider')
// 类型再导出：业务方可直接 import { TmDividerProps, DividerProps } from '@tm/ui'
export * from './src/props'
export default TmDivider
