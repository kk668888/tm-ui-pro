// packages/ui/src/components/tree-select/index.ts
// TmTreeSelect 出口：withInstall 附加 Vue 插件 install 方法
import TreeSelect from './src/TreeSelect.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTreeSelect = withInstall(TreeSelect, 'TmTreeSelect')
// 模板子组件写法：ant 顶层导出别名复用（design D2，同 select/src/options.ts 决策）
import { TreeSelectNode } from 'ant-design-vue'

export const TmTreeSelectNode = withInstall(TreeSelectNode, 'TmTreeSelectNode')
// 类型再导出：业务方可直接 import { TmTreeSelectProps, TreeSelectProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmTreeSelect
