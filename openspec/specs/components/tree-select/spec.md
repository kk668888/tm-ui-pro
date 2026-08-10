## Purpose

Defines TmTreeSelect, a thin ant-design-vue TreeSelect wrapper that bridges standard v-model, passes through tree data and field mapping, locks the popup under readonly, and cascades TmForm disabled context.

## Requirements

### Requirement: v-model 值桥接

TmTreeSelect SHALL 桥接业务标准 `v-model`（modelValue）与 ant TreeSelect 的受控值，支持单选值、多选值数组及 labelInValue 等 ant 原生形态。用户选择/取消或清空时 modelValue SHALL 同步更新。

#### Scenario: 单选更新值

- **WHEN** 用户选择树中一个节点
- **THEN** modelValue 更新为该节点 value

#### Scenario: 多选增删值

- **WHEN** 处于多选模式且用户勾选/取消节点
- **THEN** modelValue 数组对应增删该节点 value

### Requirement: treeData 与字段映射透传

TmTreeSelect SHALL 透传 ant 的 `treeData` 与 `fieldNames` 能力，业务对树数据结构与字段映射用法不变。

#### Scenario: 自定义字段映射

- **WHEN** 业务配置 fieldNames 映射自有树数据字段
- **THEN** 树按映射字段渲染节点与父子关系

### Requirement: readonly 只读锁

TmTreeSelect SHALL 支持只读语义：`readonly`（业务显式传或 TmForm context 级联）为真时，树弹层 SHALL 不可打开、当前值不可修改但可见；该行为 SHALL 由公共只读锁统一提供。

#### Scenario: readonly 锁定弹层

- **WHEN** readonly 为真且用户点击选择框
- **THEN** 树面板不打开，展示值不变

### Requirement: FormContext 级联

TmTreeSelect SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`，禁用时 SHALL 不可打开弹层。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 控件禁用，点击不打开弹层

### Requirement: 插槽与实例方法透传

TmTreeSelect SHALL 透传 ant TreeSelect 的插槽与实例方法至父组件 ref。

#### Scenario: 插槽与方法透传

- **WHEN** 业务传入自定义插槽或通过 ref 调用实例方法
- **THEN** 插槽正常渲染、内部实例收到调用
