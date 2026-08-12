## Purpose

Defines TmBreadcrumb, thin ant-design-vue Breadcrumb wrappers (TmBreadcrumb/TmBreadcrumbItem/TmBreadcrumbSeparator) that give business pages a consistent page-level navigation trail.

## ADDED Requirements

### Requirement: 面包屑子组件族

TmBreadcrumb SHALL 导出三个子组件：`TmBreadcrumb` / `TmBreadcrumbItem` / `TmBreadcrumbSeparator`，分别薄封装 ant Breadcrumb 的 Breadcrumb / BreadcrumbItem / BreadcrumbSeparator。

#### Scenario: 面包屑导航

- **WHEN** 渲染 `<TmBreadcrumb><TmBreadcrumbItem>首页</TmBreadcrumbItem><TmBreadcrumbItem>列表</TmBreadcrumbItem></TmBreadcrumb>`
- **THEN** 渲染 ant 面包屑导航链，默认分隔符 `/`

#### Scenario: 自定义分隔符

- **WHEN** TmBreadcrumb 传 `separator=">"` 或使用 TmBreadcrumbSeparator
- **THEN** 项之间以自定义分隔符渲染

### Requirement: ant 原生透传

TmBreadcrumb 家族 SHALL 透传 ant Breadcrumb 原生 props / slots / events（`routes` / `params` / `itemRender` 及 default 插槽），业务对 ant 的用法不变。

#### Scenario: itemRender 定制

- **WHEN** 传入 `itemRender` 自定义渲染函数
- **THEN** 每个面包屑项按自定义函数渲染
