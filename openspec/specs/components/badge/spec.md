## Purpose

Defines TmBadge, a thin ant-design-vue Badge wrapper that forwards count/status/dot capabilities and applies company visual defaults, so business pages get consistent badge behavior.

## Requirements

### Requirement: ant 原生能力透传

TmBadge SHALL 透传 ant Badge 原生 props / slots（如 `count` / `status` / `dot` / `overflowCount` / `showZero` / count 插槽等），业务对 ant 的用法不变。

#### Scenario: count 与 overflowCount 透传

- **WHEN** 传入 `count: 150` 与 `overflowCount: 99`
- **THEN** 徽标显示 `99+`

#### Scenario: status 点透传

- **WHEN** 传入 `status: 'processing'`
- **THEN** 渲染为状态点徽标

### Requirement: 公司默认兜底

TmBadge SHALL 应用公司视觉默认（如 size 等，业务可覆盖），并遵循薄封装 Boolean 陷阱兜底约定（ant 默认 true 的属性显式兜底）。

#### Scenario: 公司默认生效

- **WHEN** 业务未传相关默认键
- **THEN** 徽标按公司默认渲染，业务显式传同名键时覆盖
