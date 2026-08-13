## Purpose

定义 TmProgress 进度条的公开行为，为任务进度、加载和完成度展示提供统一的进度反馈能力。

## ADDED Requirements

### Requirement: 进度展示与状态
TmProgress SHALL 支持进度类型、百分比、尺寸、状态、成功段和文案展示。

#### Scenario: 显示进度
- **WHEN** 业务传入百分比值和状态
- **THEN** 组件按对应状态色显示进度条

### Requirement: 状态色默认与原生透传
TmProgress SHALL 提供公司状态色映射默认，并允许业务显式配置覆盖，同时透传 Progress 原生属性、事件和插槽。

#### Scenario: 业务覆盖状态色
- **WHEN** 业务显式传入与公司默认不同的状态
- **THEN** 进度条按业务状态渲染
