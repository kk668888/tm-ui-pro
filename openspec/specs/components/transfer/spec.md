## Purpose

Defines TmTransfer, a thin ant-design-vue Transfer wrapper for shuttle selection with company default titles.

## Requirements

### Requirement: 公司默认标题

TmTransfer SHALL 提供公司默认 `titles`（默认「源列表 / 目标列表」）兜底，业务可覆盖。

#### Scenario: 默认标题

- **WHEN** 渲染 `<TmTransfer :data-source="[...]" />` 且不传 titles
- **THEN** 两侧面板显示公司默认标题

#### Scenario: 业务覆盖标题

- **WHEN** 传入 `:titles="['未选','已选']"`
- **THEN** 按业务标题渲染

### Requirement: 默认 render 显示选项文案

ant Transfer 的 `render` 默认 `null`（列表项不渲染文字）。TmTransfer SHALL 提供公司默认 `render`（显示 `item.title`），业务传 `render` 覆盖。

#### Scenario: 默认显示 item.title

- **WHEN** 渲染 `<TmTransfer :data-source="[{ key, title }]" />` 且不传 render
- **THEN** 列表项显示 item.title 文案

#### Scenario: 业务覆盖 render

- **WHEN** 传入自定义 `render` 函数
- **THEN** 列表项按业务函数渲染

### Requirement: ant 原生透传

TmTransfer SHALL 透传 ant Transfer 原生 props / events（`dataSource` / `targetKeys` / `render` / `onChange` / `showSearch` / `disabled`）。

#### Scenario: 受控穿梭

- **WHEN** 传入 `v-model:target-keys` 与 `@change`
- **THEN** 穿梭操作触发受控更新与回调

#### Scenario: 搜索过滤

- **WHEN** 传入 `show-search`
- **THEN** 两侧面板显示搜索框
