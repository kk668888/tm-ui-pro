## Purpose

定义 TmRadioButton 按钮态单选的公开行为：ant Radio.Button 的库内别名（值单元语义），与 TmRadio 同契构成组使用。

## Requirements

### Requirement: 值单元契约

TmRadioButton SHALL 作为 RadioGroup 的选项使用：点击触发组值更新为该按钮的 `value`；选中态由组值与自身 `value` 的比对结果决定，组件自身不持有选中状态。

> **组合限制（如实记录，Vue slot 语义固有限制）**：经 `TmRadioGroup` 的模板子组件（children）写法使用时，ant 的 provide/inject 识别因 slot 转发改变 parent 链而失效（极简纯转发 wrapper 同样复现，非库缺陷引入）。children 组合场景 SHALL 使用 ant 原生 RadioGroup；`TmRadioGroup` 组合场景业务走其 `options` prop（既有能力）。别名复用下组件行为与原生 `<a-radio-button>` 完全一致。

#### Scenario: 原生组内点击选中

- **WHEN** ant RadioGroup 值为 `a`，业务点击 `value="b"` 的 TmRadioButton
- **THEN** 组值更新为 `b`，`b` 按钮呈选中视觉、`a` 取消

### Requirement: 组视觉与禁用级联

同组 TmRadioButton SHALL 渲染为相连的按钮组形态；组级 `disabled` SHALL 级联禁用全部按钮，自身 `disabled` 仅禁用单个；两者同时存在时任一为真即禁用。

#### Scenario: 组级禁用

- **WHEN** RadioGroup 传 `disabled`
- **THEN** 组内全部按钮禁用不可点击

#### Scenario: 单按钮禁用

- **WHEN** 仅某按钮自身传 `disabled`
- **THEN** 该按钮禁用，其余按钮正常可点
