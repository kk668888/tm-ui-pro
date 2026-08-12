## Purpose

Defines TmSpin, a loading spinner wrapper that transparently passes through ant Spin props, slots, and events, with a Boolean default guard for the `spinning` control.

## ADDED Requirements

### Requirement: ant 属性 / 插槽 / 事件透传

TmSpin SHALL 透传 ant Spin 全部原生 props / slots / events（如 `spinning` / `tip` / `size` / `delay` / `indicator` / `children` 插槽 / `description` 插槽），并显式兜底 `spinning` 的 Boolean 默认值避免类型化 prop 陷阱。

#### Scenario: 控制加载态

- **WHEN** 业务传 `:spinning="true"` 与 `tip="加载中"`
- **THEN** 包裹内容上显示带提示文案的加载动画

#### Scenario: 包裹内容插槽

- **WHEN** 业务在 TmSpin 内放业务内容
- **THEN** 加载态显示时内容被遮罩，加载结束恢复显示

### Requirement: 整页加载语义

TmSpin 可整体包裹页面或卡片区域提供加载遮罩；内部实例方法（如 `setPercent`）SHALL 经 ref 透传给业务。

#### Scenario: 实例方法透传

- **WHEN** 业务通过 ref 调用内部 ant Spin 实例方法
- **THEN** 方法真实转发到内部组件
