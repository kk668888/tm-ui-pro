## Purpose

Defines TmCascader, a thin ant-design-vue Cascader wrapper that bridges standard v-model, passes through options, locks the popup under readonly, and cascades TmForm disabled context.

## Requirements

### Requirement: v-model 值桥接

TmCascader SHALL 桥接业务标准 `v-model`（modelValue）与 ant Cascader 的受控值，值类型为选中路径的值数组。用户选择或清空时 modelValue SHALL 同步更新。

#### Scenario: 选择更新值

- **WHEN** 用户选择一条完整级联路径
- **THEN** modelValue 更新为该路径各层值组成的数组

#### Scenario: 清空置空

- **WHEN** 用户清空已选级联值
- **THEN** modelValue 置为空数组

### Requirement: options 与字段映射透传

TmCascader SHALL 透传 ant 的 `options` 与 `fieldNames` 能力，业务对级联树的数据结构与字段映射用法不变。

#### Scenario: fieldNames 自定义映射

- **WHEN** 业务配置 fieldNames 映射自有数据字段
- **THEN** 级联树按映射字段渲染选项

### Requirement: readonly 只读锁

TmCascader SHALL 支持只读语义：`readonly`（业务显式传或 TmForm context 级联）为真时，级联弹层 SHALL 不可打开、当前值不可修改但可见；该行为 SHALL 由公共只读锁统一提供。

#### Scenario: readonly 锁定弹层

- **WHEN** readonly 为真且用户点击输入框
- **THEN** 级联面板不打开，展示值不变

### Requirement: FormContext 级联

TmCascader SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`，禁用时 SHALL 不可打开弹层。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 控件禁用，点击不打开弹层

### Requirement: 插槽与实例方法透传

TmCascader SHALL 透传 ant Cascader 的插槽（suffixIcon / displayRender 等）与实例方法至父组件 ref。

#### Scenario: 插槽与方法透传

- **WHEN** 业务传入自定义插槽或通过 ref 调用实例方法
- **THEN** 插槽正常渲染、内部实例收到调用
