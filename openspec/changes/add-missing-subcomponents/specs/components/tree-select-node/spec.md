## Purpose

定义 TmTreeSelectNode 树选择节点的公开行为：承载 ant TreeSelect 的模板子组件写法，库薄封装 SHALL NOT 破坏 ant TreeSelect 对节点的识别（ant 4.x 官方主推 `treeData` prop，模板写法能力以 ant 实际行为为准，本组件如实透传）。

## ADDED Requirements

### Requirement: 模板子组件透传

TmTreeSelectNode 作为 TmTreeSelect 插槽子内容时 SHALL 原样转发为 ant 的树选择节点：`title` / `value` / `children` 等属性与插槽透传生效，行为与原生写法一致。

#### Scenario: 属性透传
- **WHEN** 业务以模板写法传 `title` 与 `value`
- **THEN** 节点按该文本与值渲染/回填，行为与原生 `<a-tree-select-node>` 一致

### Requirement: 与 treeData 的关系

业务同时使用 `treeData` 与模板子组件时，SHALL 保持 ant 原生优先级行为，本组件不做二次裁决、不静默丢弃任一来源。

#### Scenario: 行为一致性
- **WHEN** 业务同时传 `treeData` 与 TmTreeSelectNode 子组件
- **THEN** 呈现行为与 ant 原生相同写法完全一致
