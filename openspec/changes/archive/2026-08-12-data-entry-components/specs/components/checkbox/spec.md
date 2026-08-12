## Purpose

Defines TmCheckbox, a thin ant-design-vue Checkbox wrapper (single) that complements the existing TmCheckboxGroup with consistent value semantics.

## ADDED Requirements

### Requirement: 单复选框

TmCheckbox SHALL 导出 `TmCheckbox`，薄封装 ant Checkbox，`checked` 值语义与既有 TmCheckboxGroup 对齐。

#### Scenario: 受控勾选

- **WHEN** 渲染 `<TmCheckbox v-model:checked="checked">选项</TmCheckbox>`
- **THEN** 按受控 checked 渲染勾选态

#### Scenario: 禁用

- **WHEN** 传入 `disabled`
- **THEN** 复选框不可交互

### Requirement: ant 原生透传

TmCheckbox SHALL 透传 ant Checkbox 原生 props / events（`checked` / `value` / `indeterminate` / `disabled` / `onChange`）。

#### Scenario: 半选态

- **WHEN** 传入 `indeterminate`
- **THEN** 复选框呈现半选态
