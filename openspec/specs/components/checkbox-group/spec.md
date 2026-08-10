## Purpose

Defines TmCheckboxGroup, a thin ant-design-vue Checkbox.Group wrapper that bridges standard v-model to an array value, drives options from an array, and cascades TmForm readonly/disabled context.

## Requirements

### Requirement: v-model 数组值桥接

TmCheckboxGroup SHALL 桥接业务标准 `v-model`（modelValue）与 ant Checkbox.Group 的受控值，复选值类型为 `(string | number | boolean)[]`。用户勾选/取消时 modelValue SHALL 同步增删对应项。

#### Scenario: 勾选追加值

- **WHEN** 业务 v-model 绑定 modelValue 且用户勾选一个新选项
- **THEN** 所选项的值被追加进 modelValue 数组

#### Scenario: 取消移除值

- **WHEN** 用户取消一个已勾选选项
- **THEN** 该项的值从 modelValue 数组中移除

#### Scenario: 外部修改同步勾选态

- **WHEN** 业务外部修改 modelValue 数组
- **THEN** 数组中存在的值对应选项呈现勾选态，其余未勾选

### Requirement: options 数组驱动

TmCheckboxGroup SHALL 支持 `options` 数组 `{ label, value, disabled }[]` 渲染选项；未传 options 时 SHALL 保留 ant 原生插槽透传能力。

#### Scenario: options 渲染与选项级禁用

- **WHEN** 传入 `options: [{ label: 'A', value: 1 }, { label: 'B', value: 2, disabled: true }]`
- **THEN** 渲染两个复选选项，B 项不可勾选，A 项可正常勾选

### Requirement: FormContext 级联

TmCheckboxGroup SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`；`readonly` 因 ant 无原生实现，SHALL 映射为禁用态且保留已勾选值展示。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 整组选项禁用不可勾选

#### Scenario: readonly 映射为禁用

- **WHEN** TmForm context 的 readonly 为真且业务未显式覆盖
- **THEN** 控件禁用、已勾选值仍显示

### Requirement: slots 与实例方法透传

TmCheckboxGroup SHALL 全透传 ant Checkbox.Group 的插槽与实例方法至父组件 ref。

#### Scenario: 方法透传

- **WHEN** 业务通过组件 ref 调用 ant Checkbox.Group 实例方法
- **THEN** 内部实例收到该调用并正常执行
