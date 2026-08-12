## Purpose

Defines TmAlert, a status alert banner that maps business status semantics to ant preset colors (reusing the shared status→color table) while transparently passing through all ant Alert props, slots, and events.

## ADDED Requirements

### Requirement: 语义色映射

TmAlert SHALL 支持 `status` 扩展键（`success` / `processing` / `failed` / `warning`），映射到 ant Alert 预设语义类型，与 TmTag 共享同一张状态→语义色映射表；业务显式传 `type` 或 `color` 时 SHALL 覆盖 status 映射。

#### Scenario: status 映射语义类型

- **WHEN** 业务传 `status="failed"`
- **THEN** Alert 以错误语义类型渲染（与 TmTag 同状态同一语义色）

#### Scenario: 显式 type 优先

- **WHEN** 业务同时传 `status` 与显式 `type`
- **THEN** 显式 type 生效，status 映射不覆盖

### Requirement: ant 属性 / 插槽 / 事件透传

TmAlert SHALL 透传 ant Alert 全部原生 props / slots / events（如 `description` / `closable` / `showIcon` / `banner` / `closeIcon` / `onClose` / `message` 插槽 / `description` 插槽），并显式兜底 `closable` 等 Boolean 默认值避免运行时陷阱。

#### Scenario: 关闭按钮与描述透传

- **WHEN** 业务传 `closable`、`description` 与 `@close`
- **THEN** 关闭按钮可点击、描述文本展示、关闭事件触发

#### Scenario: Boolean 默认值兜底

- **WHEN** 业务未传 `closable`
- **THEN** 使用公司默认值渲染（不因类型化 prop 默认 false 而异常）
