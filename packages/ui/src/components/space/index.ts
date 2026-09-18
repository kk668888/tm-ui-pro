// packages/ui/src/components/space/index.ts
// TmSpace 出口：withInstall 附加 Vue 插件 install 方法
import Space from './src/Space.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSpace = withInstall(Space, 'TmSpace')
// 紧凑排布容器：ant 顶层导出 Compact（Space.Compact）别名复用（design D2）
import { Compact } from 'ant-design-vue'

export const TmCompact = withInstall(Compact, 'TmCompact')
// 类型再导出：业务方可直接 import { TmSpaceProps, SpaceProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmSpace
