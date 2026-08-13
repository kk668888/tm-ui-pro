## Purpose

定义 TmSegmented 分段控制器的公开行为，为少量互斥视图或筛选模式提供紧凑、可受控的切换方式。

## ADDED Requirements

### Requirement: 分段选择
TmSegmented SHALL 支持字符串、数字和带标签配置项，并支持受控值及默认值模式。

#### Scenario: 切换选项
- **WHEN** 用户点击另一个可用选项
- **THEN** 组件更新选择状态并触发原生变化事件

### Requirement: 原生属性透传
TmSegmented SHALL 透传 Segmented 原生属性、事件和插槽，包括尺寸、块级布局、禁用状态和选项渲染。

#### Scenario: 禁用选项不可选择
- **WHEN** 用户点击被禁用的分段选项
- **THEN** 当前值不发生变化
