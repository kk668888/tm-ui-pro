## Purpose

定义 TmStatistic 统计数值与倒计时组件的公开行为，为指标、金额、比例和截止时间提供统一展示格式。

## Requirements

### Requirement: 统计值与倒计时
TmStatistic SHALL 导出 TmStatistic 与 TmCountdown，并支持标题、数值、前后缀、精度、格式化及截止时间。

#### Scenario: 格式化统计值
- **WHEN** 业务传入数值、精度和前后缀
- **THEN** 组件按配置显示格式化后的完整统计值

### Requirement: 原生事件透传
TmStatistic SHALL 透传 Statistic 与 Countdown 原生属性、事件和插槽，包括格式化函数与倒计时完成事件。

#### Scenario: 倒计时完成
- **WHEN** 倒计时到达目标时间
- **THEN** 组件触发原生完成事件
