## Purpose

定义 TmMonthPicker 月份选择器的公开行为：ant DatePicker.MonthPicker 的库内薄封装，与 TmDatePicker 同契约（v-model、公司默认值、FormContext 级联）。

## Requirements

### Requirement: v-model 值契约

TmMonthPicker SHALL 双向绑定所选月份，值通道与 TmDatePicker 一致（受 `valueFormat` 透传控制输出类型）；清空时业务侧收到空值，SHALL NOT 抛错。

#### Scenario: 选择回写
- **WHEN** 业务 `v-model="m"` 且透传 `valueFormat="YYYY-MM"` 后选择「2026-09」
- **THEN** `m` 更新为 `2026-09`

### Requirement: 公司默认值与 FormContext 级联

公司默认值（`allowClear` / `size` / `bordered` 等与 TmDatePicker 一致）业务可覆盖；未显式传 `disabled` 时级联祖先 TmForm。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 选择器禁用不可打开面板
