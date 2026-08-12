## Purpose

Defines TmDropdown, thin ant-design-vue Dropdown wrappers (TmDropdown/TmDropdownButton) for operation-column menus, keeping the trigger non-controlled so popups open naturally.

## Requirements

### Requirement: 下拉菜单子组件族

TmDropdown SHALL 导出两个子组件：`TmDropdown` / `TmDropdownButton`，分别薄封装 ant Dropdown 的 Dropdown / DropdownButton。

#### Scenario: 下拉菜单

- **WHEN** 渲染 `<TmDropdown><TmButton>操作</TmButton><template #overlay>菜单</template></TmDropdown>`
- **THEN** 渲染 ant 下拉菜单，默认 hover 触发

#### Scenario: 下拉按钮组

- **WHEN** 渲染 `<TmDropdownButton trigger="click">更多<template #overlay>菜单</template></TmDropdownButton>`
- **THEN** 渲染 ant 按钮组 + 下拉

### Requirement: 菜单内容经 #overlay 插槽提供

ant-design-vue 4.2.6 的 Dropdown `menu` prop 是 no-op（声明但未接线到 overlay，不渲染菜单内容）。TmDropdown / TmDropdownButton SHALL 依赖 `#overlay` 插槽提供菜单内容，并透传该插槽。

#### Scenario: overlay 插槽渲染菜单

- **WHEN** 在 `#overlay` 插槽提供菜单内容并展开下拉
- **THEN** 菜单内容在弹层中渲染

#### Scenario: menu prop 不渲染内容

- **WHEN** 仅传 `menu` prop 而不提供 `#overlay` 插槽
- **THEN** 下拉展开但菜单内容为空（ant 4.2.6 行为，文档注明用 #overlay）

### Requirement: 触发保持非受控

TmDropdown SHALL 在业务未显式传 `open` 时保持 ant 非受控（缺省 Boolean 幻影值不得覆盖 ant 内部默认），hover / 点击即可弹出。

#### Scenario: 缺省 open 非受控

- **WHEN** 业务不传 `open` 且 hover 触发元素
- **THEN** 菜单正常弹出，不因幻影 false 变受控锁定

#### Scenario: 显式受控

- **WHEN** 业务显式传 `:open="true"`
- **THEN** 菜单按受控状态渲染

### Requirement: ant 原生透传

TmDropdown SHALL 透传 ant Dropdown 原生 props / slots / events（`trigger` / `placement` / `arrow` / `overlayClassName` / `overlayStyle` / `disabled`）。

#### Scenario: 弹层位置

- **WHEN** 传入 `placement="bottomRight"`
- **THEN** 菜单在触发元素右下弹出
