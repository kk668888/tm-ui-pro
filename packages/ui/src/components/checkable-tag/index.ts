// packages/ui/src/components/checkable-tag/index.ts
// TmCheckableTag 出口：通过 withInstall 附加 Vue 插件 install 方法
import CheckableTag from './src/CheckableTag.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCheckableTag = withInstall(CheckableTag, 'TmCheckableTag')
// 类型再导出：业务方可直接 import { TmCheckableTagProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmCheckableTag
