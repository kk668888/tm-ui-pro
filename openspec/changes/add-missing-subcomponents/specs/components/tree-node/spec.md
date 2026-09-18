## Purpose

定义 TmTreeNode 树节点的公开行为：作为 TmTree 的模板子组件（`<TmTree><TmTreeNode …>`）与原生 `<a-tree-node>` 等价的模板写法承载，库薄封装 SHALL NOT 破坏 ant Tree 对节点的识别。

## ADDED Requirements

### Requirement: 模板子组件识别与渲染

TmTreeNode 作为 TmTree 插槽子内容时 SHALL 被识别为树节点：`title` prop 或默认插槽作为节点文本，嵌套的 TmTreeNode 渲染为子级。

#### Scenario: 嵌套树渲染
- **WHEN** `<TmTreeNode title="父" :checkable="true">` 内嵌套一个子 TmTreeNode
- **THEN** 渲染为带子节点的两级树，展开父节点可见子节点

### Requirement: 原生属性与插槽透传

TmTreeNode SHALL 透传 `disabled` / `selectable` / `checkable` / `icon` 等原生属性与插槽（含 `title` 插槽），业务显式传入生效。

#### Scenario: 禁用节点
- **WHEN** 业务传 `disabled`
- **THEN** 节点不可选中、不可勾选且呈禁用视觉
