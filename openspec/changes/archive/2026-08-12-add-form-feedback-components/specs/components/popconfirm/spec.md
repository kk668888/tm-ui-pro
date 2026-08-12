## Purpose

Defines TmPopconfirm, a popconfirm dialog that provides company-default confirm/cancel button text and a danger-confirm semantic, transparently passing through the remaining ant Popconfirm props and events.

## ADDED Requirements

### Requirement: 确认按钮默认文案

TmPopconfirm SHALL 提供公司默认确认/取消按钮文案（「确定」/「取消」）；业务显式传 `okText` / `cancelText` 时 SHALL 覆盖默认值。

#### Scenario: 默认文案渲染

- **WHEN** 业务仅传 `title` 未传 `okText` / `cancelText`
- **THEN** 确认按钮显示「确定」、取消按钮显示「取消」

#### Scenario: 显式文案覆盖

- **WHEN** 业务传 `okText="删除"` `cancelText="再想想"`
- **THEN** 按钮文案分别为「删除」「再想想」

### Requirement: 危险确认语义

TmPopconfirm 支持 `danger` 扩展键，置位时确认按钮 SHALL 以危险语义渲染（红色），对齐 TmButton 删除二次确认的视觉。

#### Scenario: danger 红色确认

- **WHEN** 业务传 `danger`
- **THEN** 确认按钮为危险语义（红色），提示操作有破坏性

### Requirement: ant 属性 / 事件透传

TmPopconfirm SHALL 透传 ant Popconfirm 全部原生 props / events（如 `title` / `description` / `placement` / `trigger` / `okButtonProps` / `cancelButtonProps` / `onConfirm` / `onCancel`）。

#### Scenario: 位置与确认回调透传

- **WHEN** 业务传 `placement="topLeft"` 与 `@confirm`
- **THEN** 气泡按指定位置展示，确认后触发回调
