## Purpose

Defines TmModal in two forms: an imperative API (confirm/info/success/error/warning) that prefers the ConfigProvider-bound modal captured by TmApp, and a component wrapper with standard v-model open bridging for declarative usage.

## Requirements

### Requirement: 命令式静态方法

TmModal SHALL 导出静态方法 `confirm` / `info` / `success` / `error` / `warning`，在任意位置调用即弹出全局对话框，配置对象沿用 ant Modal 的 `confirm` 形态（title / content / onOk / onCancel 等）。

#### Scenario: confirm 弹出对话框

- **WHEN** 业务调用 `TmModal.confirm({ title: '删除', content: '确认删除？' })`
- **THEN** 弹出确认对话框，onOk / onCancel 回调按配置触发

### Requirement: App 上下文优先

有 TmApp 包裹时，TmModal 命令式 SHALL 使用 holder 中绑定了 ConfigProvider 上下文的 modal 实例；holder 为空时降级到 ant 全局 Modal（功能可用、主题不跟随、不抛错）。

#### Scenario: 包裹 TmApp 用上下文实例

- **WHEN** 根组件用 TmApp 包裹后调用 TmModal.confirm
- **THEN** 对话框使用 ConfigProvider 上下文渲染

#### Scenario: 未包裹降级全局

- **WHEN** 未包裹 TmApp 且调用 TmModal.confirm
- **THEN** 对话框仍弹出（ant 全局默认主题），不抛异常

### Requirement: 组件式 v-model 桥接

TmModal 作为组件使用时 SHALL 支持标准 `v-model` 控制开关（modelValue ↔ ant Modal 的 `open`），并剥离 `modelValue` / `open` 等数值通道避免与 v-model 冲突。

#### Scenario: v-model 控制开关

- **WHEN** 业务 `v-model` 绑定布尔值
- **THEN** 为真时对话框打开，为假时关闭；关闭操作更新 modelValue

### Requirement: 组件式 ant 原生透传与插槽

TmModal 组件 SHALL 透传 ant Modal 原生 props（title / width / footer / confirmLoading 等）与插槽（default / title / footer 等），业务对 ant 的用法不变。

#### Scenario: 透传与插槽

- **WHEN** 传入 width 与 default 插槽内容
- **THEN** 对话框按 width 渲染且展示插槽内容
