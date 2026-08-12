## Purpose

Defines TmMenu, thin ant-design-vue Menu wrappers (TmMenu/TmMenuItem/TmSubMenu/TmMenuItemGroup/TmMenuDivider) that unify company navigation menu style.

## ADDED Requirements

### Requirement: 菜单子组件族

TmMenu SHALL 导出五个子组件：`TmMenu` / `TmMenuItem` / `TmSubMenu` / `TmMenuItemGroup` / `TmMenuDivider`，分别薄封装 ant Menu 的 Menu / MenuItem / SubMenu / MenuItemGroup / MenuDivider。

#### Scenario: 横向菜单

- **WHEN** 渲染 `<TmMenu mode="horizontal" :items="[...]">`
- **THEN** 渲染 ant 横向导航菜单

#### Scenario: 纵向菜单

- **WHEN** 渲染 `<TmMenu mode="inline" :items="[...]">`
- **THEN** 渲染 ant 内联纵向菜单，可折叠

### Requirement: ant 原生透传

TmMenu 家族 SHALL 透传 ant Menu 原生 props / slots / events（`items` / `mode` / `theme` / `selectable` / `selectedKeys` / `openKeys` / `inlineCollapsed` / `onClick`）。

#### Scenario: 选中态受控

- **WHEN** 传入 `:selected-keys="['item1']"`
- **THEN** 对应菜单项呈选中态

#### Scenario: 暗色主题

- **WHEN** 传入 `theme="dark"`
- **THEN** 菜单呈现 ant 暗色主题
