## Purpose

定义 TmCalendar 日历的公开行为，为日期浏览、面板切换和日期单元格业务内容提供统一的整月展示能力。

## Requirements

### Requirement: 日历选择与面板
TmCalendar SHALL 支持受控日期值、默认日期值、全屏或卡片模式以及日期和月份面板切换。

#### Scenario: 选择日期
- **WHEN** 用户选择一个可用日期
- **THEN** 组件更新选择态并触发原生选择与变化事件

### Requirement: 单元格透传
TmCalendar SHALL 透传 Calendar 原生属性、事件和插槽，包括有效范围、禁用日期、头部和单元格渲染能力。

#### Scenario: 自定义日期内容
- **WHEN** 业务提供日期单元格渲染内容
- **THEN** 每个匹配日期单元格展示业务内容
