## Purpose

Defines TmTimePicker, a time picker that bridges `v-model` between Dayjs and string via a `value-format` option (mirroring TmDatePicker), while transparently passing through the remaining ant TimePicker props, slots, and events.

## ADDED Requirements

### Requirement: value-format 字符串模式

配置 `value-format` 时，TmTimePicker SHALL 使 `v-model` 绑定值为字符串（按 format 格式化），组件内部在字符串 ↔ Dayjs 间双向转换，业务无需手动 dayjs。

#### Scenario: 字符串绑定与回填

- **WHEN** 业务传 `value-format="HH:mm:ss"` 且 `v-model` 初值 `"09:30:00"`
- **THEN** 时间选择器回显 09:30:00，业务改选后 `v-model` 仍为按格式格式化的字符串

### Requirement: 默认 Dayjs 模式

未配置 `value-format` 时，TmTimePicker SHALL 使 `v-model` 绑定值为 Dayjs 对象（ant 原生语义），组件直通不改值类型。

#### Scenario: 默认 Dayjs 直通

- **WHEN** 业务未传 `value-format` 且 `v-model` 绑定 Dayjs
- **THEN** 值以 Dayjs 对象双向流转，无隐式类型转换

### Requirement: ant 属性 / 插槽 / 事件透传

TmTimePicker SHALL 透传 ant TimePicker 全部原生 props / slots / events（如 `format` / `minute-step` / `hour-step` / `disabled` / `allow-clear` / `placeholder` / `disabled-time` / `on-change` / `on-open-change`）。

#### Scenario: 步长与禁用透传

- **WHEN** 业务传 `minute-step="5"` 与 `disabled`
- **THEN** 分钟选项按 5 分钟步进、选择器禁用
