## Purpose

定义 TmList 列表、列表项与元信息组件的公开行为，为结构化条目、加载状态和分页列表提供统一展示能力。

## ADDED Requirements

### Requirement: 列表组件组合
TmList SHALL 导出 TmList、TmListItem 与 TmListItemMeta，并支持数据源渲染和声明式子项渲染。

#### Scenario: 渲染数据源
- **WHEN** 业务传入数据源并提供条目渲染插槽
- **THEN** 列表为每条数据渲染对应内容

### Requirement: 列表状态透传
TmList SHALL 透传 List 原生属性、事件和插槽，包括加载、分页、栅格、空状态、头部与底部。

#### Scenario: 显示加载状态
- **WHEN** 业务设置 `loading`
- **THEN** 列表显示原生加载反馈且保留既有布局
