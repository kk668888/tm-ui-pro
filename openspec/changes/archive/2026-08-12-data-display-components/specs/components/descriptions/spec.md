## Purpose

定义 TmDescriptions 描述列表及条目组件的公开行为，为对象详情、摘要信息和只读字段展示提供统一结构。

## ADDED Requirements

### Requirement: 描述列表组合
TmDescriptions SHALL 导出 TmDescriptions 与 TmDescriptionsItem，并支持标签、内容、跨列和标题区域。

#### Scenario: 渲染详情字段
- **WHEN** 业务提供多个带标签的描述条目
- **THEN** 组件按指定列数展示每个标签及其内容

### Requirement: 布局透传
TmDescriptions SHALL 透传 Descriptions 原生属性和插槽，包括布局、边框、尺寸、列数与额外操作。

#### Scenario: 响应式列数
- **WHEN** 业务传入响应式 `column` 配置
- **THEN** 描述列表按当前断点采用相应列数
