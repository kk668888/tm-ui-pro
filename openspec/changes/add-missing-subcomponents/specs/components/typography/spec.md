## Purpose

定义 TmTypography 排版本体的公开行为：ant Typography 本体的薄封装入口。标题/文本/段落/链接已由既有 `TmTypographyTitle` / `TmTypographyText` / `TmTypographyParagraph` / `TmTypographyLink` 导出承接，本能力仅补齐本体。

## ADDED Requirements

### Requirement: 本体入口导出

库 SHALL 导出 `TmTypography`，映射 ant `Typography` 本体，可经 TmResolver 按需解析；与既有 `TmTypography*` 子组件导出并存，互不影响。

#### Scenario: 按需解析可用
- **WHEN** 业务经 TmResolver 解析 `TmTypography`
- **THEN** 具名导入成功并渲染为 ant Typography 本体

### Requirement: 原生能力透传

TmTypography SHALL 透传 ant Typography 本体的属性与插槽（如 `component` 自定义容器标签、`code` / `mark` 等文本修饰），行为与原生写法一致。

#### Scenario: 容器标签透传
- **WHEN** 业务传 `component="article"` 并提供插槽内容
- **THEN** 内容渲染在 `<article>` 容器内，行为与原生 `<a-typography>` 一致
