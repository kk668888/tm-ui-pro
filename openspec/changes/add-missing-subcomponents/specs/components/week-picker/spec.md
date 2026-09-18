## Purpose

定义 TmWeekPicker 周选择器的公开行为：ant DatePicker.WeekPicker 的库内薄封装，与 TmDatePicker 同契约（v-model、公司默认值、FormContext 级联）。

## ADDED Requirements

### Requirement: v-model 值契约

TmWeekPicker SHALL 双向绑定所选周，值通道与 TmDatePicker 一致（受 `valueFormat` 透传控制输出类型）；清空时业务侧收到空值。

#### Scenario: 选择回写
- **WHEN** 业务选择某周
- **THEN** `v-model` 绑定值更新为该周（按透传的 valueFormat 输出），再次打开面板定位到已选周

### Requirement: 公司默认值与 FormContext 级联

公司默认值与 TmDatePicker 一致，业务可覆盖；未显式传 `disabled` 时级联祖先 TmForm。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 选择器禁用不可打开面板

### Requirement: valueFormat 字符串往返

配置 `valueFormat` 时，TmWeekPicker SHALL 在绑定串与 Dayjs 之间双向转换，且解析结果 SHALL 为有效日期：合法串按格式解析并定位到对应周，面板选值后 SHALL 按同一格式输出字符串。解析 SHALL 为宽松模式（按 token 扫描，多余字符被忽略）；当串**缺少必需 token**（如无年份）而解析失败时，该值 SHALL 按空值处理（控件显示空白），SHALL NOT 抛错、SHALL NOT 渲染 `Invalid Date` 文案。

按格式解析与 `ww` token 输出依赖 dayjs 插件（`customParseFormat` / `advancedFormat` / `weekOfYear`）；ant-design-vue 模块加载时已完成扩展，故库内无需业务侧配置。

#### Scenario: 字符串初值回显
- **WHEN** `modelValue="2026-36"` 且 `valueFormat="YYYY-ww"`
- **THEN** 内部下发给 ant 的值为有效 Dayjs，格式化回来为 `2026-36`，输入框显示该周

#### Scenario: 选值回写
- **WHEN** 面板选中 2026 年第 36 周（对应 2026-09-03）
- **THEN** emit 的 `modelValue` 为字符串 `"2026-36"`

#### Scenario: 宽松解析
- **WHEN** `modelValue="2026年36周"` 且 `valueFormat="YYYY-ww"`
- **THEN** 按 token 扫描解析出 2026 年第 36 周（与 `"2026-36"` 等价），不因多余字符失败

#### Scenario: 缺必需 token 容错
- **WHEN** `modelValue="第二周"` 且 `valueFormat="YYYY-ww"`（无年份 token）
- **THEN** 控件显示空白（按空值处理），不抛错、不出现 `Invalid Date`
