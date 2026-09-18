## Purpose

Defines TmTypography, a thin ant-design-vue Typography wrapper family (Title/Paragraph/Text/Link) that unifies company typography hierarchy and passes through all ant text capabilities.

## Requirements

### Requirement: 排版子组件族

TmTypography SHALL 导出四个子组件：`TmTypographyTitle` / `TmTypographyParagraph` / `TmTypographyText` / `TmTypographyLink`，分别薄封装 ant Typography 的 Title / Paragraph / Text / Link，作为 `TmTypography` 的命名导出。

#### Scenario: 标题组件

- **WHEN** 渲染 `<TmTypographyTitle :level="3">示例</TmTypographyTitle>`
- **THEN** 内部 ant Typography.Title 以 level=3 渲染标题文本

#### Scenario: 段落组件

- **WHEN** 渲染 `<TmTypographyParagraph>正文</TmTypographyParagraph>`
- **THEN** 内部 ant Typography.Paragraph 渲染段落文本

#### Scenario: 链接组件

- **WHEN** 渲染 `<TmTypographyLink href="/x">链接</TmTypographyLink>`
- **THEN** 内部 ant Typography.Link 渲染链接文本

### Requirement: ant 原生透传

TmTypography 家族 SHALL 透传 ant Typography 原生 props / slots / events（如 `copyable` / `ellipsis` / `editable` / `mark` / `code` / `keyboard`），业务对 ant 的用法不变。

#### Scenario: 可复制文本

- **WHEN** 文本组件传入 `copyable` 且用户点击复制图标
- **THEN** ant 复制行为触发，onCopy 回调被调用

#### Scenario: 省略文本

- **WHEN** 文本组件传入 `ellipsis` 且文本内容超长
- **THEN** 文本按 ant 省略规则截断并可展开（若配置）

#### Scenario: 内联修饰

- **WHEN** 文本组件传入 `code` 或 `mark`
- **THEN** 文本呈现 ant 对应内联修饰样式

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
