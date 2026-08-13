## Purpose

定义 TmTooltip 文字提示的公开行为，为截断文本、图标说明和轻量帮助信息提供统一的浮层触发与展示方式。

## ADDED Requirements

### Requirement: 提示内容与触发
TmTooltip SHALL 支持标题内容、触发方式、位置、箭头和受控打开状态，并提供公司统一的提示浮层默认值。

#### Scenario: 悬停显示提示
- **WHEN** 用户悬停在默认触发元素上且业务提供提示内容
- **THEN** 提示浮层按默认位置和视觉配置显示

### Requirement: 原生透传与覆盖
TmTooltip SHALL 透传 Tooltip 原生属性、事件和插槽，业务显式配置 SHALL 覆盖公司默认值。

#### Scenario: 受控关闭保持关闭
- **WHEN** 业务显式传入 `open=false`
- **THEN** 用户触发元素时提示浮层保持关闭
