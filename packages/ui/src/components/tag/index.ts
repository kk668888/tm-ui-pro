// packages/ui/src/components/tag/index.ts
// TmTag 出口：withInstall 附加 Vue 插件 install 方法
import Tag from './src/Tag.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTag = withInstall(Tag, 'TmTag')
// 类型再导出：业务方可直接 import { TmTagProps, TagProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmTag
