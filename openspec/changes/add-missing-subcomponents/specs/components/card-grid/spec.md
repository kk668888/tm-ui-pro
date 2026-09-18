## Purpose

定义 TmCardGrid 卡片栅格单元的公开行为：作为 TmCard 内容区的可悬停栅格子块（ant Card.Grid 薄封装）。

## ADDED Requirements

### Requirement: 栅格单元契约

TmCardGrid 作为 TmCard 插槽子内容时 SHALL 渲染为带边框的栅格单元：默认插槽为单元内容，悬停呈浮起阴影反馈，多个单元自动栅格排布。

#### Scenario: 悬停反馈
- **WHEN** 用户鼠标悬停某单元
- **THEN** 该单元呈现阴影浮起效果，移出后恢复

### Requirement: 原生属性透传

TmCardGrid SHALL 透传 `hoverable` / `class` / `style` 等原生属性，业务显式传入生效。

#### Scenario: 关闭悬停
- **WHEN** 业务传 `hoverable: false`
- **THEN** 单元不再呈现悬停浮起效果
