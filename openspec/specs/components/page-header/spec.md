## Purpose

Defines TmPageHeader, a thin ant-design-vue PageHeader wrapper for consistent page headers with title, back, tags and extra actions.

## Requirements

### Requirement: ant 原生透传

TmPageHeader SHALL 透传 ant PageHeader 原生 props / slots / events（`title` / `subTitle` / `backIcon` / `tags` / `extra` / `avatar` / `onBack`）。

#### Scenario: 页头渲染

- **WHEN** 渲染 `<TmPageHeader title="标题" sub-title="副标题" @back="...">内容</TmPageHeader>`
- **THEN** 渲染 ant 页头，含返回箭头、标题与副标题

#### Scenario: 自定义返回图标

- **WHEN** 传入 `:back-icon="false"` 或自定义图标
- **THEN** 按业务配置渲染返回区域

### Requirement: 内容插槽透传

TmPageHeader SHALL 透传默认插槽与具名插槽（`title` / `subTitle` / `tags` / `extra` / `avatar` / `backIcon`）。

#### Scenario: extra 操作区

- **WHEN** 在 `#extra` 插槽传入操作按钮
- **THEN** 操作区渲染在页头右侧
