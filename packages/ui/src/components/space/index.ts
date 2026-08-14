// packages/ui/src/components/space/index.ts
// TmSpace 出口：withInstall 附加 Vue 插件 install 方法
import Space from './src/Space.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSpace = withInstall(Space, 'TmSpace')
// 类型再导出：业务方可直接 import { TmSpaceProps, SpaceProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmSpace
