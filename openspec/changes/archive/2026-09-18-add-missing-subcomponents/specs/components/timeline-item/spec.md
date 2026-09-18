## Purpose

定义 TmTimelineItem 时间线条目的公开行为：作为 TmTimeline 的模板子组件（ant Timeline.Item 薄封装），承载单条时间线的颜色、标签与自定义圆点。

## ADDED Requirements

### Requirement: 条目渲染契约

TmTimelineItem 作为 TmTimeline 插槽子内容时 SHALL 渲染为一条时间线记录：默认插槽为内容、`color` 控制圆点语义色、`label` 作为时间轴标签、`dot` 插槽替换默认圆点。

#### Scenario: 语义色圆点
- **WHEN** 业务传 `color="red"`
- **THEN** 该条目圆点呈红色语义样式，内容正常展示

#### Scenario: 自定义圆点
- **WHEN** 业务使用 `dot` 插槽渲染图标
- **THEN** 图标替换默认圆点，轴线连接不断裂

### Requirement: 原生属性透传

TmTimelineItem SHALL 透传 `position` / `disabled` 等原生属性，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于该条目
