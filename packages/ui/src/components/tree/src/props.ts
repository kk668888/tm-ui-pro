// packages/ui/src/components/tree/src/props.ts
// TmTree 类型定义：ant 原生 TreeProps / DirectoryTreeProps（无公司扩展键）
import type { TreeProps } from 'ant-design-vue'
import type { DirectoryTreeProps } from 'ant-design-vue'

/** TmTree = ant 原生 TreeProps */
export type TmTreeProps = TreeProps

/** TmDirectoryTree = ant 原生 DirectoryTreeProps */
export type TmDirectoryTreeProps = DirectoryTreeProps

// 类型透传
export type { TreeProps, DirectoryTreeProps } from 'ant-design-vue'
