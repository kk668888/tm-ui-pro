## Purpose

Defines TmSwitch, a thin ant-design-vue Switch wrapper that bridges standard v-model to a boolean checked state, supports checked/unchecked custom values, and cascades TmForm readonly/disabled context.

## ADDED Requirements

### Requirement: v-model 布尔值桥接

TmSwitch SHALL 桥接业务标准 `v-model`（modelValue）与 ant Switch 的受控勾选态，默认布尔值语义：`true` 开启、`false` 关闭。支持 ant 的 `checkedValue` / `unCheckedValue` 自定义开合值。

#### Scenario: 切换更新 modelValue

- **WHEN** 用户点击开关
- **THEN** modelValue 在开/关值之间切换

#### Scenario: 自定义开合值

- **WHEN** 配置 `checkedValue: 'on'`、`unCheckedValue: 'off'` 且 modelValue 为 `'on'`
- **THEN** 开关呈现开启态；用户点击后 modelValue 变为 `'off'`

### Requirement: FormContext 级联

TmSwitch SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`；`readonly` 因 ant 无原生实现，SHALL 映射为禁用态且保留当前开合状态展示。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 开关禁用不可切换

#### Scenario: readonly 映射为禁用

- **WHEN** TmForm context 的 readonly 为真且业务未显式覆盖
- **THEN** 开关禁用、当前开合状态仍显示

### Requirement: slots 与实例方法透传

TmSwitch SHALL 透传 ant Switch 的插槽（checkedChildren / unCheckedChildren 等）与实例方法（focus/blur）至父组件 ref。

#### Scenario: 插槽与方法透传

- **WHEN** 业务传入 checkedChildren 插槽或通过 ref 调用 focus
- **THEN** 插槽正常渲染、内部实例收到方法调用
