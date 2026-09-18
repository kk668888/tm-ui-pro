## Purpose

定义 TmQuarterPicker 季度选择器的公开行为：ant DatePicker.QuarterPicker 的库内薄封装，与 TmDatePicker 同契约（v-model、公司默认值、FormContext 级联）。

## ADDED Requirements

### Requirement: v-model 值契约

TmQuarterPicker SHALL 双向绑定所选季度，值通道与 TmDatePicker 一致（受 `valueFormat` 透传控制输出类型）；清空时业务侧收到空值。

#### Scenario: 选择回写
- **WHEN** 业务选择「Q3 2026」
- **THEN** `v-model` 绑定值更新为对应季度值，面板中该季度呈选中态

### Requirement: 公司默认值与 FormContext 级联

公司默认值与 TmDatePicker 一致，业务可覆盖；未显式传 `disabled` 时级联祖先 TmForm。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 选择器禁用不可打开面板

### Requirement: valueFormat 字符串往返

配置 `valueFormat` 时，TmQuarterPicker SHALL 在绑定串与 Dayjs 之间双向转换，且解析结果 SHALL 为有效日期：合法串按格式解析并定位到对应季度，面板选值后 SHALL 按同一格式输出字符串。解析 SHALL 为宽松模式（按 token 扫描，多余字符被忽略）；当串**缺少必需 token**而解析失败时，该值 SHALL 按空值处理（控件显示空白），SHALL NOT 抛错、SHALL NOT 渲染 `Invalid Date`。

按格式解析与 `Q` token 输出依赖 dayjs 插件（`customParseFormat` / `advancedFormat`）；ant-design-vue 模块加载时已完成扩展，故库内无需业务侧配置。

#### Scenario: 字符串初值回显
- **WHEN** `modelValue="2026-Q3"` 且 `valueFormat="YYYY-[Q]Q"`
- **THEN** 内部下发给 ant 的值为有效 Dayjs，格式化回来为 `2026-Q3`，输入框显示该季度

#### Scenario: 选值回写
- **WHEN** 面板选中 2026 年第 3 季度
- **THEN** emit 的 `modelValue` 为字符串 `"2026-Q3"`

#### Scenario: 缺必需 token 容错
- **WHEN** `modelValue="2026-Q"` 且 `valueFormat="YYYY-[Q]Q"`（无季度数字 token）
- **THEN** 控件显示空白（按空值处理），不抛错、不出现 `Invalid Date`
