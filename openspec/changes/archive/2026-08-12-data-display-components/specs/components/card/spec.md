## Purpose

定义 TmCard 业务卡片容器的公开行为，使概览页、详情页和卡片列表能够复用一致的内容分区与视觉默认值。

## ADDED Requirements

### Requirement: 卡片内容与分区
TmCard SHALL 支持标题、额外操作、封面、页签和正文等原生卡片内容，并允许业务内容通过对应插槽渲染。

#### Scenario: 渲染标题和正文
- **WHEN** 业务传入 `title` 并提供默认插槽内容
- **THEN** 卡片同时显示标题区域与正文区域

### Requirement: 默认值与原生透传
TmCard SHALL 提供公司卡片默认值，并允许业务显式传值覆盖，同时透传 Card 原生属性、事件和插槽。

#### Scenario: 业务覆盖默认值
- **WHEN** 业务显式传入与公司默认不同的 `bordered` 或 `size`
- **THEN** 卡片按业务配置渲染
