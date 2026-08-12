## Purpose

Defines TmTree, thin ant-design-vue Tree wrappers (TmTree/TmTreeNode/TmDirectoryTree) for directory and permission trees.

## ADDED Requirements

### Requirement: 树形子组件族

TmTree SHALL 导出两个子组件：`TmTree` / `TmDirectoryTree`，分别薄封装 ant Tree 的 Tree / DirectoryTree。节点一律用 `treeData` 配置驱动（ant 遗留子组件 API `<TreeNode/>` 经 wrapper 会被 treeUtil 递归处理破坏，故不导出 TmTreeNode）。

#### Scenario: 树形渲染

- **WHEN** 渲染 `<TmTree :tree-data="[...]">`
- **THEN** 渲染 ant 树形结构

#### Scenario: 目录树

- **WHEN** 渲染 `<TmDirectoryTree :tree-data="[...]">`
- **THEN** 渲染 ant 目录树（带文件夹图标）

### Requirement: ant 原生透传

TmTree 家族 SHALL 透传 ant Tree 原生 props / events（`treeData` / `checkable` / `selectedKeys` / `checkedKeys` / `expandedKeys` / `blockNode` / `onCheck` / `onSelect`）。

#### Scenario: 可勾选树

- **WHEN** 传入 `checkable`
- **THEN** 节点前显示复选框，勾选触发 onCheck

#### Scenario: 受控选中

- **WHEN** 传入 `:selected-keys="['node1']"`
- **THEN** 对应节点呈选中态
