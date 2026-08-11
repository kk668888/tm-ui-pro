## Purpose

Defines TmDrawer, a thin ant-design-vue Drawer wrapper with standard v-model open bridging and full ant capability passthrough, so business pages get a consistent drawer behavior.

## ADDED Requirements

### Requirement: v-model 开关桥接

TmDrawer SHALL 支持标准 `v-model` 控制开关（modelValue ↔ ant Drawer 的 `open`），并剥离 `modelValue` / `open` 等数值通道避免与 v-model 冲突。

#### Scenario: v-model 控制开关

- **WHEN** 业务 `v-model` 绑定布尔值
- **THEN** 为真时抽屉打开，为假时关闭；关闭操作更新 modelValue

### Requirement: ant 原生能力透传

TmDrawer SHALL 透传 ant Drawer 原生 props（width / placement / closable / destroyOnClose 等）与插槽（default / title / footer 等），业务对 ant 的用法不变。

#### Scenario: 位置与宽度透传

- **WHEN** 传入 `placement: 'right'` 与 `width: 400`
- **THEN** 抽屉从右侧以 400px 宽度打开

#### Scenario: 插槽透传

- **WHEN** 传入 default 与 title 插槽内容
- **THEN** 抽屉按插槽渲染标题与内容

### Requirement: 方法透传

TmDrawer SHALL 经 useForwardRef 透传内部 ant Drawer 实例方法（如有）至父组件 ref。

#### Scenario: 方法透传

- **WHEN** 业务通过组件 ref 访问内部实例方法
- **THEN** 内部实例收到调用并正常执行
