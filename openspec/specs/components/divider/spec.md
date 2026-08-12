## Purpose

Defines TmDivider, a thin ant-design-vue Divider wrapper that applies company visual defaults for orientation/type so business pages get consistent dividers without repeating props.

## Requirements

### Requirement: 公司视觉默认

TmDivider SHALL 提供公司默认 `type`（默认 `horizontal`）与 `orientation`（默认 `center`）兜底，业务传值覆盖。

#### Scenario: 默认分割线

- **WHEN** 渲染 `<TmDivider>` 且业务不传 `type` / `orientation`
- **THEN** 呈现 ant 默认 horizontal + center 分割线

#### Scenario: 业务覆盖形态

- **WHEN** 业务传 `type="vertical"` 或 `orientation="left"`
- **THEN** 分割线呈现对应形态，默认值不生效

### Requirement: ant 原生透传

TmDivider SHALL 透传 ant Divider 原生 props / slots / events（如 `dashed` / `plain` / `orientationMargin` 及默认插槽文案），业务对 ant 的用法不变。

#### Scenario: 虚线分割线

- **WHEN** 传入 `dashed`
- **THEN** ant Divider 呈现虚线

#### Scenario: 带文案分割线

- **WHEN** 在默认插槽传入文案
- **THEN** 文案按 ant 规则渲染在分割线中部
