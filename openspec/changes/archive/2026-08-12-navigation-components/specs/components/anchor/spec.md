## Purpose

Defines TmAnchor, thin ant-design-vue Anchor wrappers (TmAnchor/TmAnchorLink) for anchor navigation within a page.

## ADDED Requirements

### Requirement: 锚点子组件族

TmAnchor SHALL 导出两个子组件：`TmAnchor` / `TmAnchorLink`，分别薄封装 ant Anchor 的 Anchor / AnchorLink。

#### Scenario: 锚点导航

- **WHEN** 渲染 `<TmAnchor><TmAnchorLink href="#sec1" title="章节一" /></TmAnchor>`
- **THEN** 渲染 ant 锚点导航，点击滚动到对应锚点

#### Scenario: 嵌套链接

- **WHEN** TmAnchorLink 内嵌套 TmAnchorLink
- **THEN** 渲染二级锚点树

### Requirement: ant 原生透传

TmAnchor 家族 SHALL 透传 ant Anchor 原生 props / slots / events（`affix` / `bounds` / `offsetTop` / `targetOffset` / `items` / `onChange` / `onClick`）。

#### Scenario: 禁用固定

- **WHEN** 传入 `:affix="false"`
- **THEN** 锚点列表不随滚动固定
