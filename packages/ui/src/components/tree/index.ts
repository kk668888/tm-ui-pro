// packages/ui/src/components/tree/index.ts
// TmTree 出口：TmTree / TmDirectoryTree 多子组件模块
// 注：ant Tree 的遗留子组件 API（<Tree><TreeNode/></Tree>）经 wrapper 会被 treeUtil 递归处理
// 破坏（wrapper 无法识别子 TreeNode 结构），故不导出 TmTreeNode；节点一律用 treeData 配置驱动。
import Tree from './src/Tree.vue'
import DirectoryTree from './src/DirectoryTree.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTree = withInstall(Tree, 'TmTree')
export const TmDirectoryTree = withInstall(DirectoryTree, 'TmDirectoryTree')

// 类型透传：业务方可直接 import { TreeProps, TmTreeProps, ... } from '@tm/ui'
export type { TreeProps, DirectoryTreeProps } from 'ant-design-vue'
export type { TmTreeProps, TmDirectoryTreeProps } from './src/props'

export default { TmTree, TmDirectoryTree }
