## Purpose

定义 TmTimeline 时间轴的公开行为，为流程记录、操作日志和事件进度提供一致的时序信息展示能力。

## ADDED Requirements

### Requirement: 时间轴展示
TmTimeline SHALL 透传默认插槽形式的时间轴内容，并保留位置、模式和待处理状态语义。

#### Scenario: 渲染事件序列
- **WHEN** 业务通过默认插槽提供多个上游时间轴项目
- **THEN** 组件按项目顺序显示节点和内容

### Requirement: 原生能力透传
TmTimeline SHALL 透传 Timeline 原生属性、事件和插槽，不改变项目配置结构。

#### Scenario: 显示待处理节点
- **WHEN** 业务启用待处理状态并提供待处理内容
- **THEN** 时间轴末端显示对应待处理节点
