## Purpose

Defines TmPopover, a popover card that transparently passes through ant Popover props, slots, and events, with a Boolean default guard for the `open` control.

## ADDED Requirements

### Requirement: ant 属性 / 插槽 / 事件透传

TmPopover SHALL 透传 ant Popover 全部原生 props / slots / events（如 `title` / `content` / `trigger` / `placement` / `overlayStyle` / `title` 插槽 / `content` 插槽 / `onOpenChange`），并显式兜底 `open` 等 Boolean 默认值避免类型化 prop 陷阱。

#### Scenario: 标题内容与触发方式透传

- **WHEN** 业务传 `title`、`content` 与 `trigger="click"`
- **THEN** 点击目标后气泡卡片显示标题与内容

#### Scenario: Boolean 默认值兜底

- **WHEN** 业务未传 `open`
- **THEN** 气泡默认关闭，不因类型化 prop 默认值异常
