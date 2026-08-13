## Purpose

Defines TmRadio, a thin ant-design-vue Radio wrapper (single) that complements the existing TmRadioGroup with consistent value semantics.

## Requirements

### Requirement: 单选框

TmRadio SHALL 导出 `TmRadio`，薄封装 ant Radio，`checked` 值语义与既有 TmRadioGroup 对齐。

#### Scenario: 受控选中

- **WHEN** 渲染 `<TmRadio :checked="true">选项</TmRadio>`
- **THEN** 按受控 checked 渲染选中态

#### Scenario: 禁用

- **WHEN** 传入 `disabled`
- **THEN** 单选框不可交互

### Requirement: ant 原生透传

TmRadio SHALL 透传 ant Radio 原生 props / events（`checked` / `value` / `disabled` / `onChange`）。

#### Scenario: 组合按钮

- **WHEN** 在 TmRadioGroup 内使用 TmRadio
- **THEN** 作为组内选项正常选中
