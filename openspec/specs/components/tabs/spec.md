## Purpose

Defines TmTabs, thin ant-design-vue Tabs wrappers (TmTabs/TmTabPane) for unified page-level tab navigation.

## Requirements

### Requirement: 标签页子组件族

TmTabs SHALL 导出两个子组件：`TmTabs` / `TmTabPane`，分别薄封装 ant Tabs 的 Tabs / TabPane。

#### Scenario: 标签页渲染

- **WHEN** 渲染 `<TmTabs><TmTabPane key="a" tab="标签A">内容A</TmTabPane><TmTabPane key="b" tab="标签B">内容B</TmTabPane></TmTabs>`
- **THEN** 渲染 ant 标签页，默认激活第一个

#### Scenario: 受控激活

- **WHEN** 传入 `:active-key="'b'"`
- **THEN** 激活标签 B

### Requirement: ant 原生透传

TmTabs 家族 SHALL 透传 ant Tabs 原生 props / slots / events（`type` / `position` / `size` / `items` / `centered` / `destroyInactiveTabPane` / `onChange` / `onEdit`）。

#### Scenario: 卡片式标签

- **WHEN** 传入 `type="card"`
- **THEN** 标签页呈卡片样式

#### Scenario: 可编辑

- **WHEN** 传入 `type="editable-card"` 且 `@edit`
- **THEN** 支持增删标签并触发回调
