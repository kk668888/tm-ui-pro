// packages/ui/src/components/tree/index.ts
// TmTree 出口：TmTree / TmDirectoryTree 多子组件模块
// 注（2026-09-18 翻案）：历史上因 wrapper 包裹 TreeNode 破坏 treeUtil 递归识别而有意不导出
// TmTreeNode；现改为 ant 顶层导出「别名复用」（withInstall 原对象返回同一引用，vnode.type
// 全等保留），识别不再经 wrapper，集成测试锁定该行为（add-missing-subcomponents tasks 4.2）。
import Tree from './src/Tree.vue'
import DirectoryTree from './src/DirectoryTree.vue'
import { TreeNode } from 'ant-design-vue'
import { withInstall } from '../../utils/withInstall'

export const TmTree = withInstall(Tree, 'TmTree')
export const TmDirectoryTree = withInstall(DirectoryTree, 'TmDirectoryTree')
export const TmTreeNode = withInstall(TreeNode, 'TmTreeNode')

// 类型透传：业务方可直接 import { TreeProps, TmTreeProps, ... } from '@trustmo/tm-ui'
export type { TreeProps, DirectoryTreeProps } from 'ant-design-vue'
export type { TmTreeProps, TmDirectoryTreeProps } from './src/props'

export default { TmTree, TmDirectoryTree }
