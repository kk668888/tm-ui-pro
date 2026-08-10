## Purpose

Defines TmRadioGroup, a thin ant-design-vue Radio.Group wrapper that bridges standard v-model, drives options from an array, and cascades TmForm readonly/disabled context so business pages keep company-level form behavior.

## Requirements

### Requirement: v-model 值桥接

TmRadioGroup SHALL 桥接业务标准 `v-model`（modelValue）与 ant Radio.Group 的受控值，单选值类型为 `string | number | boolean`。业务显式传入 modelValue 时对应选项 SHALL 被选中，用户点击选项时 modelValue SHALL 更新为所选项值。

#### Scenario: 点击选项更新 modelValue

- **WHEN** 业务 v-model 绑定 modelValue 且用户点击某个选项
- **THEN** modelValue 更新为所选项的值，且该选项呈现选中态

#### Scenario: 外部修改同步选中态

- **WHEN** 业务外部修改 modelValue 为某选项的值
- **THEN** 对应选项呈现选中态，其余取消选中

### Requirement: options 数组驱动

TmRadioGroup SHALL 支持 `options` 数组 `{ label, value, disabled }[]` 渲染选项，业务无需手写 option 插槽；未传 options 时 SHALL 保留 ant 原生插槽透传能力。

#### Scenario: options 渲染选项

- **WHEN** 传入 `options: [{ label: 'A', value: 1 }, { label: 'B', value: 2 }]`
- **THEN** 渲染两个单选选项，文本分别为 A 与 B

#### Scenario: 选项级禁用

- **WHEN** options 中某项 `disabled: true`
- **THEN** 该选项不可点击选中，其余选项可正常选中

### Requirement: FormContext 级联

TmRadioGroup SHALL 注入祖先 TmForm 的联动上下文：业务显式传 `disabled` 优先于 context，未传时级联 TmForm `disabled`；`readonly` 语义为「只读展示不可改」，因 ant 无原生 readonly，SHALL 映射为禁用态。

#### Scenario: 显式 disabled 优先

- **WHEN** 业务显式传 `disabled: false` 且 TmForm context 的 disabled 为真
- **THEN** 控件保持可交互（显式值优先于 context）

#### Scenario: 未传时级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 整组选项禁用不可选中

#### Scenario: readonly 映射为禁用

- **WHEN** TmForm context 的 readonly 为真且业务未显式传 readonly/disabled
- **THEN** 控件呈现禁用态、当前选中值仍可见

### Requirement: slots 与实例方法透传

TmRadioGroup SHALL 全透传 ant Radio.Group 的插槽与实例方法（如 blur/focus）至父组件 ref，业务可直接通过 ref 调用内部方法。

#### Scenario: 实例方法透传

- **WHEN** 业务通过组件 ref 调用 ant Radio.Group 实例方法
- **THEN** 内部实例收到该调用并正常执行
