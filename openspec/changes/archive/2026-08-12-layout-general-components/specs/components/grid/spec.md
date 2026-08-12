## Purpose

Defines TmGrid, thin ant-design-vue Row/Col wrappers (TmRow/TmCol) that let business pages reuse the 24-column grid with company defaults and full ant responsiveness.

## ADDED Requirements

### Requirement: Row / Col 双组件

TmGrid SHALL 导出 `TmRow` / `TmCol`，分别薄封装 ant Row / Col，保持 ant 24 栅格语义与嵌套能力。

#### Scenario: 栅格分列

- **WHEN** 渲染 `<TmRow><TmCol :span="8">A</TmCol><TmCol :span="16">B</TmCol></TmRow>`
- **THEN** 按 24 栅格 8/16 分列渲染

#### Scenario: 嵌套栅格

- **WHEN** 在 TmCol 内嵌套 TmRow / TmCol
- **THEN** 子栅格按 ant 嵌套规则正常渲染

### Requirement: 间距与对齐透传

TmRow SHALL 透传 ant Row 原生 props：`gutter`（含响应式对象）、`justify` / `align` / `wrap`。

#### Scenario: gutter 间距

- **WHEN** 渲染 `<TmRow :gutter="16">`
- **THEN** 列之间产生 16px 间距

#### Scenario: 响应式 gutter

- **WHEN** 传入 `:gutter="{ xs: 8, sm: 16, md: 24 }"`
- **THEN** 不同断点应用对应间距

### Requirement: 列属性与响应式透传

TmCol SHALL 透传 ant Col 原生 props：`span` / `offset` / `order` / `flex` / `push` / `pull` 及 `xs` / `sm` / `md` / `lg` / `xl` / `xxl` 响应式断点。

#### Scenario: 断点响应式

- **WHEN** 渲染 `<TmCol :xs="24" :md="12" :lg="8">`
- **THEN** 不同断点应用对应列宽

#### Scenario: offset 偏移

- **WHEN** 传入 `:span="8" :offset="4"`
- **THEN** 列按 8 宽并左移 4 栅格渲染
