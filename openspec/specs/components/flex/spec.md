## Purpose

Defines TmFlex, a thin ant-design-vue Flex wrapper whose default gap aligns with the TmSpace company spacing spec, so vertical rhythm stays consistent across layout components.

## Requirements

### Requirement: 间距与 TmSpace 对齐

TmFlex SHALL 将缺省 `gap` 与 TmSpace 公司间距规范对齐（默认 `middle`），业务传值覆盖。

#### Scenario: 默认 gap

- **WHEN** 渲染 `<TmFlex>` 且业务不传 `gap`
- **THEN** 使用公司默认间距 `middle`

#### Scenario: 业务覆盖 gap

- **WHEN** 业务传 `gap="16"` 或语义值 `gap="large"`
- **THEN** 使用业务指定间距，默认值不生效

### Requirement: ant 原生透传

TmFlex SHALL 透传 ant Flex 原生 props / slots / events（如 `vertical` / `justify` / `align` / `wrap` / `flex`），业务对 ant 的用法不变。

#### Scenario: 纵向布局

- **WHEN** 传入 `vertical`
- **THEN** 子元素按列排列

#### Scenario: 主轴对齐

- **WHEN** 传入 `justify="space-between"`
- **THEN** 子元素沿主轴两端分布
