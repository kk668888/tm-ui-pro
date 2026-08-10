## Purpose

Defines TmDatePicker and TmRangePicker, thin wrappers over ant-design-vue DatePicker/RangePicker that keep Dayjs-native values by default, offer optional valueFormat string bridging, lock the popup under readonly, and cascade TmForm disabled context.

## ADDED Requirements

### Requirement: Dayjs 值直通

未配置 `valueFormat` 时，TmDatePicker / TmRangePicker SHALL 保持 ant 原生值契约：`modelValue` 为 Dayjs（单日期）或 `[Dayjs, Dayjs]`（日期区间），组件不做任何格式转换，与直接使用 ant 的行为一致。

#### Scenario: 单选 Dayjs 直通

- **WHEN** 未配置 valueFormat 且用户选择某日期
- **THEN** modelValue 为该日期的 Dayjs 对象

#### Scenario: 区间 Dayjs 直通

- **WHEN** RangePicker 未配置 valueFormat 且用户选择起止日期
- **THEN** modelValue 为 `[Dayjs, Dayjs]` 二元组

### Requirement: valueFormat 字符串桥接

配置 `valueFormat` 时，TmDatePicker / TmRangePicker SHALL 在组件边界完成 string↔Dayjs 双向转换：业务 `modelValue` 为按格式字符串（单选）或 `[string, string]`（区间），内部转换为 Dayjs 交给 ant，用户改动后 SHALL 转回字符串格式输出。RangePicker 的 `valueFormat` 对起止日期同时生效。

#### Scenario: 单选字符串桥接

- **WHEN** 配置 `valueFormat: 'YYYY-MM-DD'` 且 modelValue 为 `'2026-08-10'`
- **THEN** 组件面板呈现 2026-08-10；用户改为 2026-08-11 后 modelValue 更新为 `'2026-08-11'`

#### Scenario: 区间字符串桥接

- **WHEN** RangePicker 配置 `valueFormat: 'YYYY-MM-DD'` 且用户选择 08-10 至 08-12
- **THEN** modelValue 为 `['2026-08-10', '2026-08-12']`

#### Scenario: 非法字符串不清空已有值

- **WHEN** modelValue 字符串无法解析为合法日期
- **THEN** 组件不回写错误值、不抛出未捕获异常，展示保持前一合法状态

### Requirement: readonly 只读锁

TmDatePicker / TmRangePicker SHALL 支持只读语义：`readonly`（业务显式传或 TmForm context 级联）为真时，弹层面板 SHALL 不可打开、日期不可修改，当前值仍可见；该行为 SHALL 由公共只读锁统一提供。

#### Scenario: readonly 锁定弹层

- **WHEN** readonly 为真且用户点击输入框
- **THEN** 弹层面板不打开，展示值不变

### Requirement: FormContext 级联

TmDatePicker / TmRangePicker SHALL 注入祖先 TmForm 联动上下文：业务显式传 `disabled` 优先，未传时级联 TmForm `disabled`，禁用时 SHALL 不可打开弹层也不可修改。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且 TmForm context 的 disabled 为真
- **THEN** 控件禁用，点击不打开弹层

### Requirement: 能力与插槽透传

TmDatePicker / TmRangePicker SHALL 透传 ant 原生能力（showTime / format / presets / disabledDate / placeholder / allowClear 等）与插槽至内部控件，业务对 ant 的用法不变。

#### Scenario: ant 原生能力透传

- **WHEN** 业务传入 disabledDate 或 presets
- **THEN** 面板按 disabledDate 约束禁用日期、按 presets 展示快捷项
