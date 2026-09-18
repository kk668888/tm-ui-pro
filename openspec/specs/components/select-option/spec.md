## Purpose

定义 TmSelectOption 下拉选项的公开行为：作为 TmSelect 的模板子组件（`<TmSelect><TmSelectOption …>`）与原生 `<a-select-option>` 写法等价，库薄封装 SHALL NOT 破坏 ant Select 对选项的识别。

## Requirements

### Requirement: 模板子组件识别与渲染

TmSelectOption 作为 TmSelect 的插槽子内容时 SHALL 被 ant Select 识别为选项：渲染为下拉选项条目，`value` 作为选中值，默认插槽内容作为选项展示文本。

#### Scenario: 模板写法可用
- **WHEN** 业务 `<TmSelect v-model:value="v"><TmSelectOption value="a">A</TmSelectOption></TmSelect>` 并选择该项
- **THEN** 选项渲染展示 `A`，`v` 更新为 `a`

### Requirement: 原生属性透传

TmSelectOption SHALL 透传 `disabled`、`title`、`class` 等原生属性与事件；禁用选项 SHALL 不可选中且呈禁用视觉。

#### Scenario: 禁用选项
- **WHEN** 业务传 `disabled`
- **THEN** 选项展示禁用态，点击不改变 TmSelect 的值
