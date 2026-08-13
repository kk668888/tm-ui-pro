## Purpose

定义 TmCollapse 折叠面板及其子面板的公开行为，为详情分组和渐进披露场景提供统一且可组合的容器。

## Requirements

### Requirement: 折叠面板组合
TmCollapse SHALL 导出 TmCollapse 与 TmCollapsePanel，并支持通过配置项或子组件声明面板内容。

#### Scenario: 展开指定面板
- **WHEN** 业务设置活动面板键并提供多个面板
- **THEN** 对应键的面板展开并展示内容

### Requirement: 状态与事件透传
TmCollapse SHALL 透传 Collapse 原生属性、事件和插槽，包括受控活动键、手风琴模式与变化事件。

#### Scenario: 用户切换面板
- **WHEN** 用户点击可折叠面板标题
- **THEN** 组件更新展开状态并触发原生变化事件
