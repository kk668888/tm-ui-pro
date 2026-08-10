## Purpose

Defines TmInputNumber, a thin ant-design-vue InputNumber wrapper that bridges standard v-model to a numeric value, applies company visual defaults, supports formatter/parser, and cascades TmForm readonly/disabled context.

## Requirements

### Requirement: v-model 数值桥接

TmInputNumber SHALL 桥接业务标准 `v-model`（modelValue）与 ant InputNumber 的受控值，值类型为 `number | null`。用户输入或步进调整时 modelValue SHALL 同步更新；清空时 SHALL 置为 `null`。

#### Scenario: 输入与步进更新值

- **WHEN** 用户输入数字或点击上/下步进按钮
- **THEN** modelValue 更新为解析后的数值

#### Scenario: 清空置 null

- **WHEN** 用户清空输入框内容
- **THEN** modelValue 置为 `null`

### Requirement: 边界与显示默认

TmInputNumber SHALL 透传 ant 的 `min` / `max` / `precision` / `step` / `formatter` / `parser` 能力并应用公司视觉默认（size / bordered 等，业务可覆盖）。值 SHALL 受 `min` / `max` 约束、按 `precision` 精度归一化。

#### Scenario: 超出边界被收敛

- **WHEN** 配置 `min: 0`、`max: 100` 且用户输入 150 或步进越过上限
- **THEN** 值被收敛到 100，不产生越界值

#### Scenario: 精度归一化

- **WHEN** 配置 `precision: 2` 且用户输入 1.235
- **THEN** 显示与值按 2 位小数归一化

### Requirement: FormContext 级联

TmInputNumber SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`；`readonly` SHALL 透传底层原生 readonly，若底层不支持则映射为禁用。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 输入框禁用不可编辑

#### Scenario: readonly 只读不可编辑

- **WHEN** TmForm context 的 readonly 为真且业务未显式覆盖
- **THEN** 输入框只读，当前值仍显示、不可修改

### Requirement: slots 与实例方法透传

TmInputNumber SHALL 透传 ant InputNumber 的插槽（prefix / suffix 等）与实例方法（focus/blur）至父组件 ref。

#### Scenario: 插槽与方法透传

- **WHEN** 业务传入 prefix 插槽或通过 ref 调用 focus
- **THEN** 插槽正常渲染、内部实例收到方法调用
