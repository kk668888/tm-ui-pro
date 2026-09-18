## Purpose

定义 TmTimeRangePicker 时间范围选择器的公开行为：ant TimePicker.RangePicker 的库内薄封装，提供区间值 v-model 契约与 FormContext 级联。

## Requirements

### Requirement: 区间 v-model 契约

TmTimeRangePicker SHALL 以数组值双向绑定时间区间（起止两个时间），值通道与 ant `value` / `update:value` 一致；清空时业务侧收到空值。起止面板联动规则与 ant 原生一致。

#### Scenario: 区间回写
- **WHEN** 业务依次选择 `09:00` 与 `18:00`
- **THEN** `v-model` 绑定值更新为包含两个时间值的数组

### Requirement: 原生能力与 FormContext 级联

`format` / `minuteStep` / `hourStep` / `placeholder` / `disabledTime` 等原生能力透传；未显式传 `disabled` 时级联祖先 TmForm（禁用两个输入框）。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 起止两个时间框均禁用不可交互

### Requirement: valueFormat 字符串往返

配置 `valueFormat` 时，TmTimeRangePicker SHALL 对起止两侧**成对**做绑定串 ↔ Dayjs 转换，且转换结果 SHALL 为有效时间；面板选值后 SHALL 按同一格式输出字符串数组。解析 SHALL 为宽松模式（按 token 扫描，位数不足或多余字符一般可容忍）；某侧串**缺少必需 token**（如 `HH:mm:ss` 却只写到分钟）而解析失败时，该侧 SHALL 按空值处理（显示空白），**另一侧 SHALL 不受影响**，且 SHALL NOT 抛错、SHALL NOT 渲染 `Invalid Date`。

按格式解析依赖 dayjs 插件 `customParseFormat`；ant-design-vue 模块加载时已完成扩展，故库内无需业务侧配置。

#### Scenario: 字符串初值回显
- **WHEN** `modelValue=['09:00','18:00']` 且 `valueFormat='HH:mm'`
- **THEN** 内部下发给 ant 的值为两个有效 Dayjs（分别格式化为 `09:00` / `18:00`），两个输入框都显示时间

#### Scenario: 区间变更回写
- **WHEN** 面板选中区间 09:30 ~ 18:00
- **THEN** emit 的 `modelValue` 为 `['09:30','18:00']`

#### Scenario: 单侧缺必需 token 容错
- **WHEN** `valueFormat='HH:mm:ss'` 且 `modelValue=['09:30:00','18:00']`
- **THEN** 起始侧正常显示、结束侧显示空白（不抛错），且不出现 `Invalid Date`
