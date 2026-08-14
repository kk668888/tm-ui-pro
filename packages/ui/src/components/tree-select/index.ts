// packages/ui/src/components/tree-select/index.ts
// TmTreeSelect 出口：withInstall 附加 Vue 插件 install 方法
import TreeSelect from './src/TreeSelect.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTreeSelect = withInstall(TreeSelect, 'TmTreeSelect')
// 类型再导出：业务方可直接 import { TmTreeSelectProps, TreeSelectProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmTreeSelect
