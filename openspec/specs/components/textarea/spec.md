## Purpose

定义 TmTextarea 多行文本域的公开行为：对 ant Input.TextArea 的库内薄封装，与 TmInput 保持一致的 v-model 契约、公司默认值与 TmForm 级联。

## Requirements

### Requirement: v-model 值契约

TmTextarea SHALL 以 `modelValue: string` 双向绑定；输入或清除导致值为空时 SHALL emit `''`。

#### Scenario: 双向绑定与清空
- **WHEN** 业务 `v-model="intro"` 并键入后清空
- **THEN** `intro` 依次更新为键入内容与 `''`

### Requirement: 多行能力与原生透传

TmTextarea SHALL 透传 `autosize`、`showCount`、`maxlength`、`placeholder` 等原生能力；公司默认值（`allowClear` / `size` / `bordered`）与 TmInput 一致，业务显式传入可覆盖。

#### Scenario: 自动增高
- **WHEN** 业务传 `autosize: { minRows: 2, maxRows: 6 }` 并连续换行
- **THEN** 高度在 2–6 行间自动伸缩，内容不丢失

### Requirement: FormContext 级联

未显式传 `disabled` / `readonly` 时 SHALL 级联祖先 TmForm 同名状态；显式传入优先。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 文本域禁用不可编辑
