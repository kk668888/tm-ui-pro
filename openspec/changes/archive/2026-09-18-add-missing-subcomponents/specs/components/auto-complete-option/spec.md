## Purpose

定义 TmAutoCompleteOption 自动完成选项的公开行为：作为 TmAutoComplete 的模板子组件与原生 `<a-auto-complete-option>` 等价，库薄封装 SHALL NOT 破坏 ant AutoComplete 对选项的识别。

## ADDED Requirements

### Requirement: 模板子组件识别与渲染

TmAutoCompleteOption 作为 TmAutoComplete 插槽子内容时 SHALL 被识别为候选选项：`value` 为选中后回填的值，默认插槽内容为展示文本。

#### Scenario: 选择回填
- **WHEN** 业务在 TmAutoComplete 内用 `<TmAutoCompleteOption value="ab">` 渲染候选项并点击
- **THEN** 自动完成框的值回填为 `ab`

### Requirement: 原生属性透传

TmAutoCompleteOption SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于选项节点
