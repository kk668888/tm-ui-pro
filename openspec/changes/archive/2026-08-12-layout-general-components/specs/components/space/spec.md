## Purpose

Defines TmSpace, a thin ant-design-vue Space wrapper that enforces company default spacing so business pages reuse a single gap spec instead of hand-writing every `size`.

## ADDED Requirements

### Requirement: 公司默认间距

TmSpace SHALL 提供公司默认间距 `size`（默认 `middle`）并显式转发给内部 ant Space，业务传值覆盖。缺省 `vertical` SHALL 保持 `false`（水平排列兜底）。

#### Scenario: 默认间距

- **WHEN** 渲染 `<TmSpace>` 且业务不传 `size`
- **THEN** 内部 ant Space 使用公司默认间距 `middle`

#### Scenario: 业务覆盖间距

- **WHEN** 业务传 `size="large"`
- **THEN** 内部 ant Space 使用 `large` 间距，默认值不生效

### Requirement: ant 原生透传

TmSpace SHALL 透传 ant Space 原生 props / slots / events（如 `align` / `wrap` / `direction` / `split`），业务对 ant 的用法不变，缺省未被业务显式传入的 Boolean prop 不得覆盖 ant 内部默认值。

#### Scenario: 透传 split 分隔符

- **WHEN** 传入 `split="/"` 且提供多个子元素
- **THEN** ant Space 在子元素之间渲染分隔符

#### Scenario: 缺省 Boolean 不覆盖 ant 默认

- **WHEN** 业务未传 `direction` 等可选 prop
- **THEN** 透传对象不含幻影默认值，ant Space 按自身默认渲染

### Requirement: split 分隔符 prop 扩展键

ant Space 的 `split` 是具名插槽（`spaceProps` 未声明 `split` prop），业务写成 `split="|"` 属性会被 ant 静默忽略。TmSpace SHALL 提供公司扩展键 `split?: string`：业务以 prop 形式传入时，wrapper 自动转为 `#split` 插槽渲染；业务显式提供 `#split` 插槽时以插槽为准（prop 扩展不覆盖）。

#### Scenario: split prop 自动转插槽

- **WHEN** 渲染 `<TmSpace split="|"><span>项一</span><span>项二</span></TmSpace>`
- **THEN** 子元素之间渲染 `|` 分隔符，且 `split` 不泄漏为内部 DOM 的 HTML 属性

#### Scenario: 插槽形式优先

- **WHEN** 同时传 `split="/"` 与 `<template #split>|</template>`
- **THEN** 以 `#split` 插槽内容（`|`）渲染，prop 值（`/`）不生效
